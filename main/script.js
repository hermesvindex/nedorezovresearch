(() => {
  'use strict';

  const payload = window.QUANTIS_MARKET_SNAPSHOT;
  const items = Array.isArray(payload?.items) ? payload.items : [];
  const groups = payload?.groups || {};
  const tracks = {
    featured: document.querySelector('#featuredTrack'),
    secondary: document.querySelector('#secondaryTrack')
  };
  const carouselCopies = 5;
  const carouselCenterCopy = Math.floor(carouselCopies / 2);
  const carouselStates = new WeakMap();
  const ultraWideMarket = window.matchMedia('(min-width: 2800px)');
  let marketResizeObserver = null;
  const byId = new Map(items.map(item => [item.id, item]));
  const percent = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
  const dateFormat = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const polymarketTimeFormat = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow'
  });

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));

  function valueText(item) {
    const digits = Number(item.valueDigits ?? 2);
    const formatted = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits
    }).format(Number(item.value));
    return `${item.valuePrefix || ''}${formatted}${item.valueSuffix ? `\u00a0${item.valueSuffix}` : ''}`;
  }

  function deltaText(item) {
    const isRate = item?.kind === 'rate';
    const isMacro = item?.kind === 'macro';
    const numeric = Number(isRate || isMacro ? item.deltaPoints : item?.deltaPct);
    if (isMacro) {
      if (!Number.isFinite(numeric)) return '—';
      if (Math.abs(numeric) < .005) return '0 п.п. к пред. месяцу';
      return `${numeric > 0 ? '+' : '−'}${percent.format(Math.abs(numeric))} п.п. к пред. месяцу`;
    }
    if (isRate) {
      if (!Number.isFinite(numeric)) return '—';
      const date = String(item.lastDecisionDate || '').match(/^\d{4}-(\d{2})-(\d{2})$/);
      const dateLabel = date ? ` · ${date[2]}.${date[1]}` : '';
      if (Math.abs(numeric) < .005) return `0 п.п.${dateLabel}`;
      return `${numeric > 0 ? '+' : '−'}${percent.format(Math.abs(numeric))} п.п.${dateLabel}`;
    }
    if (!Number.isFinite(numeric) || Math.abs(numeric) < .005) return '0%';
    return `${numeric > 0 ? '+' : '−'}${percent.format(Math.abs(numeric))}%`;
  }

  function deltaTone(item) {
    if (item?.kind === 'rate' || item?.kind === 'macro') return 'neutral';
    const numeric = Number(item?.kind === 'rate' ? item.deltaPoints : item?.deltaPct);
    if (!Number.isFinite(numeric) || Math.abs(numeric) < .005) return 'neutral';
    return numeric > 0 ? 'positive' : 'negative';
  }

  function dateText(value) {
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? '—' : dateFormat.format(date);
  }

  // TEMPORARY RELEASE BLOCK: live data for the September 2026 Bank of Russia decision.
  const polymarketEndpoint = 'https://gamma-api.polymarket.com/events/slug/bank-of-russia-decision-in-september-20260623013858993';
  const decisionBlock = document.querySelector('[data-temporary-block="cbr-september-2026"]');
  const decisionChartCanvas = decisionBlock?.querySelector('[data-decision-chart]');
  const decisionChartPlot = decisionBlock?.querySelector('.decision-chart__plot');
  const decisionChartTooltip = decisionBlock?.querySelector('[data-decision-tooltip]');
  const decisionChartCursor = decisionBlock?.querySelector('[data-decision-cursor]');
  const decisionPalette = {
    Decrease: { label: 'Снизят ставку', color: '#FF6A00' },
    'No Change': { label: 'Оставят без изменений', color: '#355E78' },
    Increase: { label: 'Повысят ставку', color: '#0F2233' }
  };
  const chartDateFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', timeZone: 'Europe/Moscow' });
  const tooltipDateFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Moscow' });
  const decisionOrder = ['Decrease', 'No Change', 'Increase'];
  let decisionChartSeries = [];
  let decisionChartGeometry = null;
  let historyUpdatedAt = 0;

  function yesProbability(market) {
    try {
      const outcomes = JSON.parse(market.outcomes || '[]');
      const prices = JSON.parse(market.outcomePrices || '[]');
      const yesIndex = outcomes.findIndex(outcome => String(outcome).toLowerCase() === 'yes');
      const value = Number(prices[yesIndex]);
      return Number.isFinite(value) ? value * 100 : null;
    } catch (error) {
      return null;
    }
  }

  function probabilityText(value) {
    return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(value)}%`;
  }

  function renderDecisionMarket(eventData, timestamp) {
    if (!decisionBlock || !Array.isArray(eventData?.markets)) return;
    eventData.markets.forEach(market => {
      const value = yesProbability(market);
      const outcome = decisionBlock.querySelector(`[data-decision-outcome="${CSS.escape(market.groupItemTitle || '')}"]`);
      if (!outcome || value === null) return;
      outcome.querySelector('[data-probability]').textContent = probabilityText(value);
      outcome.querySelector('[data-probability-bar]').style.setProperty('--probability', `${Math.max(0, Math.min(100, value))}%`);
    });
    const stamp = decisionBlock.querySelector('[data-polymarket-stamp]');
    if (stamp) {
      const formatted = polymarketTimeFormat.format(timestamp).replace(',', ' в');
      stamp.textContent = `Polymarket · проверено ${formatted} МСК`;
      stamp.dataset.state = 'live';
    }
  }

  function drawDecisionChart() {
    if (!decisionChartCanvas) return;
    const rect = decisionChartCanvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    decisionChartCanvas.width = Math.round(rect.width * ratio);
    decisionChartCanvas.height = Math.round(rect.height * ratio);
    const context = decisionChartCanvas.getContext('2d');
    if (!context) return;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, rect.width, rect.height);

    if (!decisionChartSeries.length) {
      decisionChartGeometry = null;
      context.fillStyle = '#7b8790';
      context.font = '600 11px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
      context.textAlign = 'center';
      context.fillText('Загрузка истории рынка…', rect.width / 2, rect.height / 2);
      return;
    }

    const allPoints = decisionChartSeries.flatMap(series => series.history);
    const minTime = Math.min(...allPoints.map(point => point.t));
    const maxTime = Math.max(...allPoints.map(point => point.t));
    const timeRange = maxTime - minTime || 1;
    const padding = { top: 12, right: 16, bottom: 30, left: 42 };
    const plotWidth = rect.width - padding.left - padding.right;
    const plotHeight = rect.height - padding.top - padding.bottom;
    const x = timestamp => padding.left + ((timestamp - minTime) / timeRange) * plotWidth;
    const y = probability => padding.top + (1 - probability / 100) * plotHeight;
    decisionChartGeometry = { minTime, maxTime, timeRange, padding, plotWidth };

    context.font = '500 10px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
    context.lineWidth = 1;
    context.textBaseline = 'middle';
    context.textAlign = 'right';
    [0, 25, 50, 75, 100].forEach(value => {
      const yPosition = y(value);
      context.beginPath();
      context.moveTo(padding.left, yPosition);
      context.lineTo(rect.width - padding.right, yPosition);
      context.strokeStyle = 'rgba(15,34,51,.09)';
      context.stroke();
      context.fillStyle = '#84919a';
      context.fillText(`${value}%`, padding.left - 8, yPosition);
    });

    context.textAlign = 'center';
    context.textBaseline = 'top';
    [0, .25, .5, .75, 1].forEach(ratioPosition => {
      const timestamp = minTime + timeRange * ratioPosition;
      context.fillStyle = '#84919a';
      context.fillText(chartDateFormat.format(new Date(timestamp * 1000)), x(timestamp), rect.height - 18);
    });

    decisionChartSeries.forEach(series => {
      context.beginPath();
      series.history.forEach((point, index) => {
        context[index ? 'lineTo' : 'moveTo'](x(point.t), y(point.p));
      });
      context.strokeStyle = series.color;
      context.lineWidth = 2.8;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.stroke();

      const lastPoint = series.history[series.history.length - 1];
      context.beginPath();
      context.arc(x(lastPoint.t), y(lastPoint.p), 3.5, 0, Math.PI * 2);
      context.fillStyle = series.color;
      context.fill();
      context.lineWidth = 2;
      context.strokeStyle = getComputedStyle(decisionBlock).backgroundColor;
      context.stroke();
    });
  }

  function nearestHistoryPoint(history, timestamp) {
    return history.reduce((nearest, point) => Math.abs(point.t - timestamp) < Math.abs(nearest.t - timestamp) ? point : nearest, history[0]);
  }

  function hideDecisionTooltip() {
    if (decisionChartTooltip) decisionChartTooltip.hidden = true;
    if (decisionChartCursor) decisionChartCursor.hidden = true;
  }

  function showDecisionTooltip(event) {
    if (!decisionChartPlot || !decisionChartTooltip || !decisionChartCursor || !decisionChartGeometry || !decisionChartSeries.length) return;
    const rect = decisionChartPlot.getBoundingClientRect();
    const { minTime, timeRange, padding, plotWidth } = decisionChartGeometry;
    const pointerX = Math.max(padding.left, Math.min(rect.width - padding.right, event.clientX - rect.left));
    const timestamp = minTime + ((pointerX - padding.left) / plotWidth) * timeRange;
    const referencePoint = nearestHistoryPoint(decisionChartSeries[0].history, timestamp);

    decisionChartTooltip.querySelector('[data-tooltip-date]').textContent = tooltipDateFormat.format(new Date(referencePoint.t * 1000));
    const valuesContainer = decisionChartTooltip.querySelector('[data-tooltip-values]');
    const rows = decisionChartSeries.map(series => {
      const point = nearestHistoryPoint(series.history, referencePoint.t);
      const row = document.createElement('div');
      row.className = 'decision-chart__tooltip-row';
      const dot = document.createElement('span');
      dot.className = 'decision-chart__tooltip-dot';
      dot.style.setProperty('--series-color', series.color);
      const label = document.createElement('span');
      label.className = 'decision-chart__tooltip-label';
      label.textContent = series.label;
      const value = document.createElement('strong');
      value.className = 'decision-chart__tooltip-value';
      value.textContent = probabilityText(point.p);
      row.append(dot, label, value);
      return row;
    });
    valuesContainer.replaceChildren(...rows);

    decisionChartCursor.style.left = `${pointerX}px`;
    decisionChartTooltip.style.left = `${Math.max(112, Math.min(rect.width - 112, pointerX))}px`;
    decisionChartCursor.hidden = false;
    decisionChartTooltip.hidden = false;
  }

  function yesTokenId(market) {
    try {
      const outcomes = JSON.parse(market.outcomes || '[]');
      const tokenIds = JSON.parse(market.clobTokenIds || '[]');
      const yesIndex = outcomes.findIndex(outcome => String(outcome).toLowerCase() === 'yes');
      return tokenIds[yesIndex] || null;
    } catch (error) {
      return null;
    }
  }

  async function refreshDecisionHistory(eventData) {
    if (!decisionChartCanvas || Date.now() - historyUpdatedAt < 300_000) return;
    const markets = eventData.markets.filter(market => decisionPalette[market.groupItemTitle] && yesTokenId(market));
    const series = await Promise.all(markets.map(async market => {
      const tokenId = yesTokenId(market);
      const url = `https://clob.polymarket.com/prices-history?market=${encodeURIComponent(tokenId)}&interval=max&fidelity=1440`;
      const response = await window.fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Polymarket history API: ${response.status}`);
      const data = await response.json();
      const history = (data.history || []).map(point => ({ t: Number(point.t), p: Number(point.p) * 100 }))
        .filter(point => Number.isFinite(point.t) && Number.isFinite(point.p));
      return { key: market.groupItemTitle, ...decisionPalette[market.groupItemTitle], history };
    }));
    decisionChartSeries = series.filter(seriesItem => seriesItem.history.length > 1)
      .sort((left, right) => decisionOrder.indexOf(left.key) - decisionOrder.indexOf(right.key));
    historyUpdatedAt = Date.now();
    drawDecisionChart();
  }

  async function refreshDecisionMarket() {
    if (!decisionBlock || typeof window.fetch !== 'function') return;
    try {
      const response = await window.fetch(polymarketEndpoint, { cache: 'no-store', headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Polymarket API: ${response.status}`);
      const eventData = await response.json();
      const sourceTimestamp = response.headers.get('last-modified');
      renderDecisionMarket(eventData, sourceTimestamp ? new Date(sourceTimestamp) : new Date());
      refreshDecisionHistory(eventData).catch(() => {});
    } catch (error) {
      // Keep the timestamped static snapshot already rendered in the document.
    }
  }

  function cardMarkup(item, copyIndex = carouselCenterCopy) {
    const tone = deltaTone(item);
    const isClone = copyIndex !== carouselCenterCopy;
    const logo = item.logo
      ? `<img class="market-card__logo" src="${escapeHtml(item.logo)}" alt="" loading="lazy" />`
      : '';
    return `<a class="market-card ${logo ? 'market-card--with-logo' : ''}" href="${escapeHtml(item.href)}" data-market-id="${escapeHtml(item.id)}" data-carousel-copy="${copyIndex}"${isClone ? ' aria-hidden="true" tabindex="-1"' : ` aria-label="Открыть карточку: ${escapeHtml(item.name)}"`}>
        <div class="market-card__head">
          <div class="market-card__identity">${logo}<h3 class="market-card__name">${escapeHtml(item.name)}</h3></div>
          <span class="market-card__ticker">${escapeHtml(item.ticker)}</span>
        </div>
        <div class="market-card__quote">
          <strong class="market-card__value">${escapeHtml(valueText(item))}</strong>
          <span class="market-card__delta ${tone}">${escapeHtml(deltaText(item))}</span>
        </div>
        <canvas aria-hidden="true"></canvas>
        <div class="market-card__meta"><span>${escapeHtml(item.kindLabel)}</span><time datetime="${escapeHtml(item.asof)}">${escapeHtml(dateText(item.asof))}</time></div>
      </a>`;
  }

  function orderedItems(groupNames) {
    const seen = new Set();
    return groupNames.flatMap(group => groups[group] || [])
      .map(id => byId.get(id))
      .filter(item => item && !seen.has(item.id) && seen.add(item.id));
  }

  function loopMarkup(ordered) {
    return Array.from({ length: carouselCopies }, (_, copyIndex) => ordered.map(item => cardMarkup(item, copyIndex)).join('')).join('');
  }

  function renderCards() {
    const singleRow = ultraWideMarket.matches;
    document.querySelector('.market-board')?.classList.toggle('market-board--single-row', singleRow);
    const secondaryRow = tracks.secondary?.closest('.market-row');
    if (secondaryRow) secondaryRow.hidden = singleRow;

    Object.entries(tracks).forEach(([group, track]) => {
      if (!track) return;
      const ordered = orderedItems(singleRow && group === 'featured' ? ['featured', 'secondary'] : [group]);
      track.innerHTML = ordered.length
        ? loopMarkup(ordered)
        : '<p class="market-card market-card--empty">Рыночные данные временно недоступны.</p>';
      track.dataset.carouselItems = String(ordered.length);
    });

    if (marketResizeObserver) {
      document.querySelectorAll('.market-card canvas').forEach(canvas => marketResizeObserver.observe(canvas));
    }
    requestAnimationFrame(() => {
      initializeMarketLoops();
      drawAll();
    });
  }

  function drawSparkline(canvas, item) {
    const values = (item.history || []).map(row => Number(row.price)).filter(Number.isFinite);
    if (values.length < 2) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(ratio, ratio);
    context.clearRect(0, 0, rect.width, rect.height);

    const pad = 3;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || Math.max(Math.abs(max) * .02, 1);
    const x = index => pad + (index / (values.length - 1)) * (rect.width - pad * 2);
    const y = value => pad + (1 - (value - min) / range) * (rect.height - pad * 2);
    const tone = deltaTone(item.deltaPct);
    const color = tone === 'positive' ? '#21865a' : tone === 'negative' ? '#dc3f5b' : '#52758a';

    context.beginPath();
    values.forEach((value, index) => index ? context.lineTo(x(index), y(value)) : context.moveTo(x(index), y(value)));
    context.lineWidth = 2.6;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.stroke();
  }

  function drawAll() {
    document.querySelectorAll('.market-card[data-market-id]').forEach(card => {
      const item = byId.get(card.dataset.marketId);
      const canvas = card.querySelector('canvas');
      if (item && canvas) drawSparkline(canvas, item);
    });
  }

  function positiveModulo(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  function measureLoop(viewport) {
    const track = viewport?.querySelector('.market-row__track');
    const card = track?.querySelector('.market-card[data-carousel-copy]');
    const itemCount = Number(track?.dataset.carouselItems || 0);
    if (!track || !card || !itemCount) return null;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return { track, span: itemCount * (card.getBoundingClientRect().width + gap) };
  }

  function normalizeLoop(viewport) {
    const state = carouselStates.get(viewport);
    if (!state?.span) return 0;
    const lower = (carouselCenterCopy - .5) * state.span;
    const upper = (carouselCenterCopy + .5) * state.span;
    let shift = 0;
    if (viewport.scrollLeft < lower) shift = Math.ceil((lower - viewport.scrollLeft) / state.span) * state.span;
    if (viewport.scrollLeft > upper) shift = -Math.ceil((viewport.scrollLeft - upper) / state.span) * state.span;
    if (shift) viewport.scrollLeft += shift;
    return shift;
  }

  function initializeMarketLoop(viewport, preservePosition = false) {
    if (!viewport || viewport.closest('.market-row')?.hidden) return;
    const measured = measureLoop(viewport);
    if (!measured?.span) return;
    const previous = carouselStates.get(viewport);
    const phase = preservePosition && previous?.span
      ? positiveModulo(viewport.scrollLeft - carouselCenterCopy * previous.span, previous.span) / previous.span
      : 0;
    const state = previous || { frame: 0, isDragging: false };
    state.span = measured.span;
    carouselStates.set(viewport, state);
    viewport.scrollLeft = carouselCenterCopy * measured.span + phase * measured.span;
  }

  function initializeMarketLoops(preservePosition = false) {
    document.querySelectorAll('[data-market-viewport]').forEach(viewport => initializeMarketLoop(viewport, preservePosition));
  }

  function scheduleLoopNormalization(viewport) {
    const state = carouselStates.get(viewport);
    if (!state || state.isDragging || state.frame) return;
    state.frame = requestAnimationFrame(() => {
      state.frame = 0;
      normalizeLoop(viewport);
    });
  }

  function scrollStep(viewport, direction = 1) {
    const track = viewport?.querySelector('.market-row__track');
    if (!viewport || !track) return;
    const card = track.querySelector('.market-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    viewport.scrollBy({ left: step * direction, behavior: 'smooth' });
  }

  renderCards();
  requestAnimationFrame(drawAll);
  requestAnimationFrame(drawDecisionChart);
  refreshDecisionMarket();
  window.setInterval(() => {
    if (!document.hidden) refreshDecisionMarket();
  }, 60_000);

  marketResizeObserver = new ResizeObserver(() => requestAnimationFrame(() => {
    drawAll();
    drawDecisionChart();
  }));
  document.querySelectorAll('.market-card canvas').forEach(canvas => marketResizeObserver.observe(canvas));
  if (decisionChartCanvas) marketResizeObserver.observe(decisionChartCanvas);

  let marketResizeFrame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(marketResizeFrame);
    marketResizeFrame = requestAnimationFrame(() => initializeMarketLoops(true));
  });
  ultraWideMarket.addEventListener('change', renderCards);
  if (decisionChartPlot) {
    decisionChartPlot.addEventListener('pointermove', showDecisionTooltip);
    decisionChartPlot.addEventListener('pointerdown', showDecisionTooltip);
    decisionChartPlot.addEventListener('pointerleave', hideDecisionTooltip);
  }

  document.querySelectorAll('[data-market-viewport]').forEach(viewport => {
    viewport.addEventListener('scroll', () => scheduleLoopNormalization(viewport), { passive: true });
    viewport.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      scrollStep(viewport, event.key === 'ArrowLeft' ? -1 : 1);
    });

    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let suppressClick = false;
    let isDragging = false;
    viewport.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch' || event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = viewport.scrollLeft;
      suppressClick = false;
      isDragging = false;
      const state = carouselStates.get(viewport);
      if (state) state.isDragging = false;
    });
    viewport.addEventListener('pointermove', event => {
      if (pointerId !== event.pointerId) return;
      const distance = event.clientX - startX;
      if (!isDragging && Math.abs(distance) > 12) {
        isDragging = true;
        suppressClick = true;
        viewport.setPointerCapture(pointerId);
        viewport.classList.add('is-dragging');
        const state = carouselStates.get(viewport);
        if (state) state.isDragging = true;
      }
      if (!isDragging) return;
      event.preventDefault();
      viewport.scrollLeft = startScroll - distance;
      const shift = normalizeLoop(viewport);
      if (shift) startScroll += shift;
    });
    const release = event => {
      if (pointerId !== event.pointerId) return;
      if (isDragging && viewport.hasPointerCapture(pointerId)) {
        viewport.releasePointerCapture(pointerId);
      }
      pointerId = null;
      isDragging = false;
      viewport.classList.remove('is-dragging');
      const state = carouselStates.get(viewport);
      if (state) state.isDragging = false;
      normalizeLoop(viewport);
    };
    viewport.addEventListener('pointerup', release);
    viewport.addEventListener('pointercancel', release);
    viewport.addEventListener('click', event => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }, true);
  });

  document.addEventListener('click', event => {
    const link = event.target.closest('.market-card[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (typeof window.QuantisOpenAsset !== 'function') return;
    event.preventDefault();
    window.QuantisOpenAsset(link.href, link);
  });
})();
