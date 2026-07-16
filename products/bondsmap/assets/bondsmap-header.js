/* Bondsmap adapter for the shared Quantis North Sea header. */

(() => {
  'use strict';

  const labels = {
    RUSFAR: 'Индекс денежного рынка',
    RGBI: 'Индекс гос. облигаций',
    'USD/RUB': 'Доллар США'
  };

  const periods = {
    '1D': 'за день',
    W: 'за неделю',
    M: 'за месяц',
    '3M': 'за 3 месяца',
    '6M': 'за 6 месяцев',
    YTD: 'с начала года',
    '1Y': 'за год',
    '3Y': 'за 3 года',
    '5Y': 'за 5 лет',
    ALL: 'за весь период'
  };

  const header = document.querySelector('.bondsmap-product-header');
  if (!header) return;

  const allowedTickers = new Set(['RUSFAR', 'RGBI', 'USD/RUB']);
  const allCards = [...header.querySelectorAll('.js-period-card')];

  allCards.forEach((card) => {
    const ticker = card.querySelector('.metric-title')?.textContent.trim() || '';
    if (!allowedTickers.has(ticker)) card.remove();
  });

  const cards = [...header.querySelectorAll('.js-period-card')];

  cards.forEach((card) => {
    const title = card.querySelector('.metric-title');
    const value = card.querySelector('.metric-value');
    const chart = card.querySelector('.dynamic-spark');
    const delta = card.querySelector('[data-delta]');
    const ticker = title?.textContent.trim() || '';

    if (ticker === 'USD/RUB' && value) {
      const numericValue = Number.parseFloat(value.textContent.replace(',', '.'));
      if (Number.isFinite(numericValue)) {
        value.textContent = `${numericValue.toFixed(2)} ₽`;
      }
    }

    card.classList.remove('metric-card');
    card.classList.add('header-block', 'header-block--market');

    const head = document.createElement('div');
    head.className = 'market-indicator__head';

    const label = document.createElement('p');
    label.className = 'market-indicator__title';
    label.textContent = labels[ticker] || ticker;
    head.append(label);

    if (title) {
      title.className = 'market-indicator__ticker';
      head.append(title);
    }

    const metric = document.createElement('div');
    metric.className = 'market-indicator__metric';
    if (value) {
      value.className = 'market-indicator__value mono';
      metric.append(value);
    }

    if (chart) {
      chart.classList.remove('metric-spark');
      chart.classList.add('market-indicator__chart');
    }

    const foot = document.createElement('div');
    foot.className = 'market-indicator__foot';

    if (delta) {
      delta.classList.remove('single-delta');
      delta.classList.add('market-indicator__delta');
      foot.append(delta);
    }

    const period = document.createElement('span');
    period.className = 'market-indicator__period';
    period.dataset.marketPeriod = '';
    foot.append(period);

    card.replaceChildren(head, metric);
    if (chart) card.append(chart);
    card.append(foot);
  });

  function selectedPeriod() {
    return header.querySelector('.js-period-btn[aria-selected="true"]')?.dataset.period || 'YTD';
  }

  function syncMarketCards() {
    const period = selectedPeriod();
    cards.forEach((card) => {
      const state = card.classList.contains('positive')
        ? 'positive'
        : card.classList.contains('negative')
          ? 'negative'
          : 'neutral';
      card.dataset.state = state;
      const output = card.querySelector('[data-market-period]');
      if (output) output.textContent = periods[period] || period;
      const delta = card.querySelector('.market-indicator__delta');
      if (delta) delta.textContent = delta.textContent.replace(',', '.').replace(/^-/, '−');
    });
  }

  document.addEventListener('header-liquid-glass:change', (event) => {
    if (!event.target.closest('.bondsmap-product-header')) return;
    const period = event.detail?.value === 'D' ? '1D' : event.detail?.value;
    if (period && typeof applyOverviewPeriod === 'function') {
      applyOverviewPeriod(period);
    }
    requestAnimationFrame(syncMarketCards);
  });

  header.querySelectorAll('.js-period-btn').forEach((button) => {
    button.addEventListener('click', () => requestAnimationFrame(syncMarketCards));
  });

  syncMarketCards();
  header.classList.add('is-enhanced');
})();
