(() => {
  'use strict';

  const script = document.currentScript;
  const scriptUrl = new URL(script?.src || '../assets/integration-shell.js', window.location.href);
  const rootUrl = new URL('../', scriptUrl);
  const query = new URLSearchParams(window.location.search);
  const publicOrigin = 'https://nedorezov-research.ru';
  const isTildaEmbed = window.self !== window.top && query.get('embed') === 'tilda';

  const detailCta = document.getElementById('detailCta');
  const identityChips = document.getElementById('chips');
  if (detailCta && identityChips && !detailCta.closest('.asset-identity-actions')) {
    const identityActions = document.createElement('div');
    identityActions.className = 'asset-identity-actions';
    identityChips.parentNode.insertBefore(identityActions, identityChips);
    identityActions.append(identityChips, detailCta);
  }

  if (query.get('drawer') === '1' || (window.self !== window.top && !isTildaEmbed)) return;

  const url = path => new URL(path, rootUrl).href;
  const siteHref = path => url(String(path || '').replace(/^(\.\.\/)+/, ''));
  const publicHref = path => new URL(path, publicOrigin).href;
  const routes = [
    ['main', 'Главная', '/'],
    ['heatmap', 'Акции', '/shares'],
    ['statements', 'Отчетность', '/reports'],
    ['bonds', 'Облигации', '/bonds'],
    ['portfolio', 'Конструктор', '/pm'],
    ['mature', 'Модельный портфель', '/maturebonds'],
  ];
  const path = window.location.pathname;
  const active = path.includes('/issuer_pages/') ? 'bonds'
    : path.includes('/statements/') ? 'statements'
    : path.includes('/heatmap/') ? 'heatmap'
      : path.includes('/bondsmap/') ? 'bonds'
        : path.includes('/portfolio_manager_interactive/') ? 'portfolio'
          : path.includes('/mature_bonds_report/') ? 'mature' : 'main';
  document.body.dataset.qnRoute = active;

  document.body.classList.add('qn-has-global-shell');
  if (path.includes('/main/')) document.body.classList.add('qn-main-page');
  const mainShell = document.querySelector('.global-shell');
  const legacyMainShell = document.querySelector('.glass-nav');
  if (mainShell) {
    mainShell.classList.add('qn-main-shell');
  }

  const searchButton = document.createElement('button');
  searchButton.type = 'button';
  searchButton.className = 'qn-search-trigger';
  searchButton.setAttribute('aria-haspopup', 'dialog');
  searchButton.setAttribute('aria-controls', 'quantisSearch');
  searchButton.setAttribute('aria-expanded', 'false');
  searchButton.setAttribute('aria-label', 'Поиск');
  searchButton.innerHTML = `<svg class="qn-control-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="10.8" cy="10.8" r="6.6"></circle>
      <path d="m15.7 15.7 4.1 4.1"></path>
    </svg><span class="qn-control-label">Поиск</span>`;

  const mobileMenuButton = document.createElement('button');
  mobileMenuButton.type = 'button';
  mobileMenuButton.className = 'qn-mobile-menu-trigger';
  mobileMenuButton.setAttribute('aria-controls', 'quantisMobileNav');
  mobileMenuButton.setAttribute('aria-expanded', 'false');
  mobileMenuButton.setAttribute('aria-label', 'Открыть меню');
  mobileMenuButton.innerHTML = `<svg class="qn-control-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.5 7h15"></path>
      <path d="M4.5 12h15"></path>
      <path d="M4.5 17h15"></path>
    </svg><span class="qn-control-label">Меню</span>`;

  let shell;

  if (mainShell) {
    const contact = mainShell.querySelector('.contact-link');
    mainShell.insertBefore(searchButton, contact || null);
    mainShell.insertBefore(mobileMenuButton, contact || null);
    shell = mainShell;
  } else if (legacyMainShell) {
    const contact = legacyMainShell.querySelector('.nav-cta');
    legacyMainShell.insertBefore(searchButton, contact || null);
    shell = legacyMainShell;
  } else {
    shell = document.createElement('header');
    shell.className = 'quantis-global-shell';
    shell.setAttribute('aria-label', 'Навигация Nedorezov Research');
    shell.innerHTML = `
      <a class="quantis-global-shell__brand" href="${publicHref('/')}" target="_top">Nedorezov Research</a>
      <nav class="quantis-global-shell__nav" aria-label="Разделы платформы">
        ${routes.map(([key, label, href]) => `<a href="${publicHref(href)}" target="_top"${key === active ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
      </nav>`;
    shell.append(searchButton, mobileMenuButton);
    document.body.append(shell);
  }

  const drawerRoots = [...document.querySelectorAll('.drawer, .sidepanel')];
  const syncDrawerState = () => {
    document.body.classList.toggle('qn-asset-open', drawerRoots.some(root => root.classList.contains('open')));
  };
  drawerRoots.forEach(root => new MutationObserver(syncDrawerState).observe(root, { attributes: true, attributeFilter: ['class'] }));
  syncDrawerState();

  const mobile = document.createElement('nav');
  mobile.className = 'quantis-mobile-nav';
  mobile.id = 'quantisMobileNav';
  mobile.setAttribute('aria-label', 'Основные разделы');
  const mobileRoutes = routes;
  mobile.innerHTML = mobileRoutes.map(([key, label, href]) => `<a href="${publicHref(href)}" target="_top"${key === active || (active === 'statements' && key === 'heatmap') ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const mobileSearch = document.createElement('button');
  mobileSearch.type = 'button';
  mobileSearch.textContent = 'Поиск';
  mobile.append(mobileSearch);
  if (!legacyMainShell) document.body.append(mobile);

  function ensureSiteFooter() {
    if (document.querySelector('.site-footer')) return;

    const footer = document.createElement('footer');
    footer.className = 'site-footer qn-site-footer';
    footer.innerHTML = `
      <div class="site-footer__top">
        <div class="site-footer__about">
          <a class="site-footer__brand" href="${publicHref('/')}" target="_top">Nedorezov Research</a>
          <p>Независимая информационно-аналитическая платформа российского рынка капитала: акции, облигации, отчетность эмитентов, рыночные индикаторы и инструменты для анализа портфеля.</p>
        </div>
        <nav class="site-footer__nav" aria-label="Разделы сайта">
          <p class="site-footer__label">Разделы</p>
          ${routes.slice(1).map(([, label, href]) => `<a href="${publicHref(href)}" target="_top">${label}</a>`).join('')}
        </nav>
        <div class="site-footer__contacts">
          <p class="site-footer__label">Обратная связь</p>
          <p>Если вы нашли ошибку в данных, расчетах или интерфейсе, сообщите владельцу проекта.</p>
          <div class="site-footer__contact-actions">
            <a class="site-footer__contact" href="https://t.me/znedorezov" target="_top" rel="noopener noreferrer" aria-label="Написать Захару Недорезову в Telegram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
              <span>Telegram</span>
            </a>
            <a class="site-footer__contact site-footer__contact--mail" href="mailto:nedorezov.zakhar@yahoo.com" aria-label="Написать Захару Недорезову по электронной почте">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"></rect><path d="m5 8 7 5 7-5"></path></svg>
              <span>Электронная почта</span>
            </a>
          </div>
        </div>
      </div>
      <div class="site-footer__risk">
        <strong>Информация о рисках</strong>
        <p>Материалы сайта имеют информационно-аналитический характер и не являются индивидуальной инвестиционной рекомендацией. Упомянутые финансовые инструменты и сделки могут не соответствовать вашему финансовому положению, целям инвестирования, допустимому риску и ожидаемой доходности.</p>
        <p>Инвестиции сопряжены с риском частичной или полной потери вложенных средств. Стоимость активов может увеличиваться и уменьшаться; результаты прошлых периодов и расчетные прогнозы не определяют будущую доходность. До принятия решения проверьте исходные данные, самостоятельно оцените условия инструмента и проведите собственный анализ рисков.</p>
      </div>
      <div class="site-footer__bottom">
        <span>© 2026 Nedorezov Research</span>
        <a href="#">Наверх</a>
      </div>`;
    document.body.append(footer);
  }

  ensureSiteFooter();

  function publicRouteFor(target) {
    const pathname = target.pathname;
    if (pathname.includes('/issuer_pages/')) {
      const filename = pathname.split('/').pop() || '';
      const issuerId = filename.replace(/\.html$/i, '');
      return /^\d+$/.test(issuerId) ? publicHref(`/issuer?id=${encodeURIComponent(issuerId)}`) : null;
    }
    if (pathname.endsWith('/statements/company.html')) {
      const ticker = target.searchParams.get('ticker');
      return ticker ? publicHref(`/reports?ticker=${encodeURIComponent(ticker)}`) : publicHref('/reports');
    }
    if (pathname.endsWith('/main/index.html')) return publicHref('/');
    if (pathname.endsWith('/heatmap/heatmap.html')) return publicHref('/shares');
    if (pathname.endsWith('/statements/statements.html')) return publicHref('/reports');
    if (pathname.endsWith('/statements.html')) return publicHref('/reports');
    if (pathname.endsWith('/bondsmap/bondsmap.html')) {
      const destination = new URL(publicHref('/bonds'));
      target.searchParams.forEach((value, key) => {
        if (key !== 'embed') destination.searchParams.set(key, value);
      });
      return destination.href;
    }
    if (pathname.endsWith('/portfolio_manager_interactive/portfolio_interactive.html')) return publicHref('/pm');
    if (pathname.endsWith('/mature_bonds_report/mature_bonds_report.html')) return publicHref('/maturebonds');
    return null;
  }

  function rewritePublicLinks(root = document) {
    root.querySelectorAll('a[href]').forEach(link => {
      if (link.matches('.brand, .site-footer__brand, .quantis-global-shell__brand')) {
        link.href = publicHref('/');
        link.target = '_top';
        return;
      }
      let target;
      try { target = new URL(link.href, window.location.href); } catch (_) { return; }
      const destination = publicRouteFor(target);
      if (!destination) return;
      link.href = destination;
      link.target = '_top';
    });
  }

  rewritePublicLinks();

  function closeMobileMenu() {
    document.body.classList.remove('qn-mobile-menu-open');
    mobileMenuButton.setAttribute('aria-expanded', 'false');
    mobileMenuButton.setAttribute('aria-label', 'Открыть меню');
  }

  mobileMenuButton.addEventListener('click', () => {
    if (document.body.classList.contains('qn-search-open')) closeSearch(false);
    const isOpen = document.body.classList.toggle('qn-mobile-menu-open');
    mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
    mobileMenuButton.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });
  mobile.addEventListener('click', event => {
    if (event.target.closest('a, button')) closeMobileMenu();
  });

  const assetModal = document.createElement('section');
  assetModal.className = 'quantis-asset-modal';
  assetModal.setAttribute('role', 'dialog');
  assetModal.setAttribute('aria-modal', 'true');
  assetModal.setAttribute('aria-label', 'Карточка актива');
  assetModal.setAttribute('aria-hidden', 'true');
  assetModal.inert = true;
  assetModal.innerHTML = `<button class="quantis-asset-modal__backdrop" type="button" aria-label="Закрыть карточку кликом по фону"></button>
    <div class="quantis-asset-modal__panel">
      <button class="quantis-asset-modal__close" type="button" aria-label="Закрыть карточку"><span aria-hidden="true"></span></button>
      <iframe class="quantis-asset-modal__frame" title="Карточка актива"></iframe>
    </div>`;
  document.body.append(assetModal);
  const assetFrame = assetModal.querySelector('.quantis-asset-modal__frame');
  let assetReturnFocus = null;
  const modalSiblingState = new Map();

  function lockModalSiblings() {
    [...document.body.children].forEach(node => {
      if (node === assetModal || node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
      modalSiblingState.set(node, node.inert);
      node.inert = true;
    });
  }

  function unlockModalSiblings() {
    modalSiblingState.forEach((wasInert, node) => { if (node.isConnected) node.inert = wasInert; });
    modalSiblingState.clear();
  }

  function closeAssetModal() {
    document.body.classList.remove('qn-modal-asset-open');
    assetModal.setAttribute('aria-hidden', 'true');
    assetModal.inert = true;
    assetFrame.removeAttribute('src');
    unlockModalSiblings();
    if (assetReturnFocus?.isConnected) assetReturnFocus.focus();
  }

  function openAssetModal(href, source) {
    const target = new URL(href, window.location.href);
    target.searchParams.set('drawer', '1');
    assetReturnFocus = source || document.activeElement;
    assetFrame.src = target.href;
    assetModal.inert = false;
    assetModal.setAttribute('aria-hidden', 'false');
    lockModalSiblings();
    document.body.classList.add('qn-modal-asset-open');
    assetModal.querySelector('.quantis-asset-modal__close').focus();
  }
  window.QuantisOpenAsset = openAssetModal;

  assetModal.querySelector('.quantis-asset-modal__close').addEventListener('click', closeAssetModal);
  assetModal.querySelector('.quantis-asset-modal__backdrop').addEventListener('click', closeAssetModal);
  assetModal.addEventListener('pointerdown', event => {
    if (event.target === assetModal || event.target.classList.contains('quantis-asset-modal__backdrop')) closeAssetModal();
  }, true);

  const backdrop = document.createElement('button');
  backdrop.type = 'button';
  backdrop.className = 'quantis-search-backdrop';
  backdrop.tabIndex = -1;
  backdrop.setAttribute('aria-label', 'Закрыть поиск');

  const panel = document.createElement('section');
  panel.className = 'quantis-search';
  panel.id = 'quantisSearch';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Поиск по активам');
  panel.setAttribute('aria-hidden', 'true');
  panel.inert = true;
  panel.innerHTML = `
    <div class="quantis-search__head">
      <label class="quantis-search__field">
        <span class="sr-only">Актив, тикер или ISIN</span>
        <input id="quantisSearchInput" type="text" role="searchbox" inputmode="search" enterkeyhint="search" autocomplete="off" placeholder="Поиск" spellcheck="false">
        <kbd>ESC</kbd>
      </label>
      <button class="quantis-search__close" type="button">Закрыть</button>
    </div>
    <div class="quantis-search__filters" role="tablist" aria-label="Класс актива">
      <button type="button" data-kind="all" aria-selected="true">Все</button>
      <button type="button" data-kind="stock" aria-selected="false">Акции</button>
      <button type="button" data-kind="bond" aria-selected="false">Облигации</button>
      <button type="button" data-kind="fund" aria-selected="false">Фонды</button>
      <button type="button" data-kind="currency" aria-selected="false">Валюты</button>
      <button type="button" data-kind="index" aria-selected="false">Индексы</button>
      <button type="button" data-kind="other" aria-selected="false">Прочее</button>
    </div>
    <div class="quantis-search__meta" id="quantisSearchMeta"></div>
    <div class="quantis-search__results" id="quantisSearchResults" role="listbox"></div>`;
  document.body.append(backdrop, panel);

  const input = panel.querySelector('#quantisSearchInput');
  const results = panel.querySelector('#quantisSearchResults');
  const meta = panel.querySelector('#quantisSearchMeta');
  const closeButton = panel.querySelector('.quantis-search__close');
  const filterButtons = [...panel.querySelectorAll('[data-kind]')];
  let index = [];
  let issuers = [];
  let itemById = new Map();
  let loading = null;
  let kind = 'all';
  let selected = -1;
  let returnFocus = null;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const normalize = value => String(value || '').toLocaleLowerCase('ru').replace(/ё/g, 'е').replace(/[^a-zа-я0-9]+/gi, ' ').trim();
  const expertTop = {
    other: [
      'KEY_RATE', 'RU_CPI', 'BRENT_USD',
    ],
    currency: ['USD_RUB', 'EUR_RUB', 'CNY_RUB', 'EUR_USD', 'CHF_RUB', 'GBP_RUB'],
    index: [
      'IMOEX', 'RGBI', 'RUSFAR',
      'MOEXBC', 'MOEXBMI', 'MOEX10', 'MCXSM',
      'RGBITR', 'RUABITR', 'RUCBTRNS',
      'MOEXOG', 'MOEXFN', 'MOEXMM', 'MOEXCN', 'MOEXEU', 'MOEXTL', 'MOEXTN', 'MOEXRE',
    ],
  };
  const otherKinds = new Set(['macro', 'rate', 'commodity']);
  const matchesKind = item => kind === 'all'
    || (kind === 'other' ? otherKinds.has(item.kind) : item.kind === kind);
  const excludedIndexTerms = ['альфа капитал', 'альфа-капитал', 'райффайзен', 'raiffeisen', 'raif'];
  const isVisibleIndexSuggestion = item => {
    if (item.kind !== 'index') return true;
    const haystack = `${item._ticker || ''} ${item._name || ''}`;
    return !excludedIndexTerms.some(term => haystack.includes(term));
  };
  const formatMarketValue = item => {
    if (item.value === null || item.value === undefined || item.value === '') return '';
    const value = Number(item.value);
    if (!Number.isFinite(value)) return '';
    const digits = Number.isFinite(Number(item.valueDigits))
      ? Number(item.valueDigits)
      : (Math.abs(value) < 10 ? 4 : 2);
    const suffix = item.valueSuffix || (item.kind === 'bond' ? '%' : item.currency === 'RUB' ? ' ₽' : '');
    return `${item.valuePrefix || ''}${value.toLocaleString('ru-RU',{maximumFractionDigits:digits})}${suffix}`;
  };
  const formatDayDelta = item => {
    if (item.kind === 'rate') {
      const points = Number(item.deltaPoints);
      if (!Number.isFinite(points)) return '';
      const sign = points > 0 ? '+' : points < 0 ? '−' : '';
      const absolute = Math.abs(points).toLocaleString('ru-RU', { maximumFractionDigits: 2 });
      const decisionDate = String(item.lastDecisionDate || '');
      const match = decisionDate.match(/^\d{4}-(\d{2})-(\d{2})$/);
      const dateLabel = match ? `${match[2]}.${match[1]}` : '';
      return `${sign}${absolute} п.п.${dateLabel ? ` · ${dateLabel}` : ''}`;
    }
    if (item.deltaPct === null || item.deltaPct === undefined || item.deltaPct === '') return '';
    const value = Number(item.deltaPct);
    if (!Number.isFinite(value)) return '';
    return `${value > 0 ? '+' : ''}${value.toLocaleString('ru-RU',{maximumFractionDigits:2})}%`;
  };

  function loadIndex() {
    if (index.length) return Promise.resolve(index);
    if (loading) return loading;
    meta.textContent = 'Загружаем индекс активов…';
    const prepare = payload => {
      index = Array.isArray(payload?.items) ? payload.items.map(item => ({
        ...item,
        _ticker: normalize(item.ticker),
        _isin: normalize(item.isin),
        _aliases: (item.aliases || []).map(normalize).filter(Boolean),
        _name: normalize(`${item.name} ${item.shortName} ${item.typeName} ${item.issuerName || ''} ${(item.aliases || []).join(' ')}`),
      })) : [];
      itemById = new Map(index.map(item => [item.id, item]));
      issuers = Array.isArray(payload?.issuers) ? payload.issuers.map(issuer => ({
        ...issuer,
        _aliases: (issuer.aliases || []).map(normalize).filter(Boolean),
        _name: normalize(`${issuer.shortName || ''} ${issuer.name || ''} ${issuer.inn || ''}`),
      })) : [];
      return index;
    };
    if (window.QUANTIS_SEARCH_INDEX) {
      loading = Promise.resolve(prepare(window.QUANTIS_SEARCH_INDEX));
      return loading;
    }
    if (window.location.protocol === 'file:') {
      loading = new Promise(resolve => {
        const source = document.createElement('script');
        source.src = new URL('search-index.js', scriptUrl).href;
        source.onload = () => resolve(prepare(window.QUANTIS_SEARCH_INDEX));
        source.onerror = () => resolve([]);
        document.head.append(source);
      });
      return loading;
    }
    loading = fetch(new URL('search-index.json', scriptUrl))
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(prepare)
      .catch(() => {
        meta.textContent = 'Индекс временно недоступен. Обновите страницу.';
        return [];
      });
    return loading;
  }

  function score(item, needle) {
    const liquidity = Math.log10(Math.max(0, Number(item.turnover) || 0) + 1);
    if (!needle) return liquidity;
    if (item._ticker === needle) return 1000 + liquidity;
    if (item._isin === needle) return 980 + liquidity;
    if (item._aliases.includes(needle)) return 990 + liquidity;
    if (item._ticker.startsWith(needle)) return 850 - item._ticker.length + liquidity;
    if (item._isin.startsWith(needle)) return 820 - item._isin.length;
    if (item._aliases.some(alias => alias.startsWith(needle))) return 810;
    if (item._name.startsWith(needle)) return 760 - item._name.length / 100;
    const tokens = needle.split(' ').filter(Boolean);
    if (tokens.every(token => item._name.includes(token) || item._ticker.includes(token) || item._isin.includes(token))) return 620;
    if (item._name.includes(needle)) return 540;
    return -1;
  }

  function issuerScore(issuer, needle) {
    if (!needle) return -1;
    if (issuer._aliases.includes(needle)) return 1000;
    if (issuer._aliases.some(alias => alias.startsWith(needle))) return 850;
    if (issuer._name.startsWith(needle)) return 820;
    const tokens = needle.split(' ').filter(Boolean);
    if (tokens.every(token => issuer._name.includes(token) || issuer._aliases.some(alias => alias.includes(token)))) return 690;
    if (issuer._name.includes(needle) || issuer._aliases.some(alias => alias.includes(needle))) return 610;
    return -1;
  }

  function assetRow(item, position) {
    const detail = item.kind === 'bond' && item.maturity ? ` · погашение ${item.maturity}` : '';
    const fullTicker = ['index', 'currency', 'rate', 'commodity'].includes(item.kind);
    const marketValue = formatMarketValue(item);
    const dayDelta = formatDayDelta(item);
    const deltaValue = item.kind === 'rate' ? Number(item.deltaPoints) : Number(item.deltaPct);
    const deltaTone = item.kind === 'rate'
      ? 'is-neutral'
      : deltaValue < 0
        ? 'is-negative'
        : deltaValue > 0
          ? 'is-positive'
          : 'is-neutral';
    const localHref = siteHref(item.href);
    const publicHrefValue = publicRouteFor(new URL(localHref));
    const href = publicHrefValue || localHref;
    const target = publicHrefValue ? ' target="_top"' : '';
    const marketMeta = marketValue
      ? `<span class="quantis-search-result__market"><strong>${esc(marketValue)}</strong>${dayDelta ? `<small class="${deltaTone}">${esc(dayDelta)}</small>` : ''}</span>`
      : `<span class="quantis-search-result__type">${esc(item.isin || item.currency || '')}</span>`;
    return `<article class="quantis-search-result ${fullTicker && !item.logo ? 'quantis-search-result--market-identity' : ''}" role="option" aria-selected="${position === selected}">
      <a class="quantis-search-result__main" href="${esc(href)}"${target}>
        <span class="quantis-search-result__ticker">${item.logo ? `<img src="${url(item.logo)}" alt="">` : esc(fullTicker ? item.ticker : item.ticker.slice(0, 5))}</span>
        <span class="quantis-search-result__copy"><strong>${esc(item.shortName && normalize(item.shortName) !== normalize(item.ticker) ? item.shortName : item.name)}</strong><small>${esc(item.ticker)} · ${esc(item.kindLabel)}${esc(detail)}</small></span>
        ${marketMeta}
      </a>
    </article>`;
  }

  function actionRow(row, position) {
    const isBonds = row.type === 'issuer-bonds';
    const label = isBonds ? 'Все выпуски облигаций' : 'О компании и финансовая отчетность';
    const metaLabel = isBonds ? `${row.issuer.bondIds.length} выпусков · фильтр будет применен` : 'Профиль эмитента · отчетность';
    const href = isBonds
      ? publicHref(`/issuer?id=${encodeURIComponent(row.issuer.id)}`)
      : publicHref(`/reports?ticker=${encodeURIComponent(row.ticker)}`);
    return `<article class="quantis-search-result quantis-search-result--action" role="option" aria-selected="${position === selected}">
      <a class="quantis-search-result__main" href="${href}" target="_top">
        <span class="quantis-search-result__ticker">${row.issuer.logo ? `<img src="${url(row.issuer.logo)}" alt="">` : (isBonds ? 'Выпуски' : 'Компания')}</span>
        <span class="quantis-search-result__copy"><strong>${esc(row.issuer.shortName || row.issuer.name)} — ${label}</strong><small>${esc(metaLabel)}</small></span>
        <span class="quantis-search-result__type">Открыть</span>
      </a>
    </article>`;
  }

  function resultRow(row, position) {
    return row.type === 'asset' ? assetRow(row.item, position) : actionRow(row, position);
  }

  function buildRows(needle) {
    if (!needle && kind === 'all') {
      const mostLiquid = assetKind => index
        .filter(item => item.kind === assetKind && item.logo && Number(item.turnover) > 0)
        .sort((a, b) => Number(b.turnover) - Number(a.turnover) || String(a.ticker).localeCompare(String(b.ticker), 'ru'))
        .slice(0, 6);
      const stocks = mostLiquid('stock');
      const bonds = mostLiquid('bond');
      const mixed = Array.from({ length: Math.max(stocks.length, bonds.length) })
        .flatMap((_, position) => [stocks[position], bonds[position]])
        .filter(Boolean);
      return {
        rows: mixed.map(item => ({ type: 'asset', item })),
        total: mixed.length,
      };
    }
    if (!needle && expertTop[kind]) {
      const priority = new Map(expertTop[kind].map((id, position) => [id, position]));
      const expertItems = index
        .filter(item => matchesKind(item))
        .sort((a, b) => {
          const aPosition = priority.has(a.id) ? priority.get(a.id) : Number.MAX_SAFE_INTEGER;
          const bPosition = priority.has(b.id) ? priority.get(b.id) : Number.MAX_SAFE_INTEGER;
          return aPosition - bPosition || String(a.ticker).localeCompare(String(b.ticker), 'ru');
        });
      const visible = kind === 'index'
        ? expertItems.filter(item => priority.has(item.id))
        : expertItems;
      return {
        rows: visible.slice(0, 12).map(item => ({ type: 'asset', item })),
        total: visible.length,
      };
    }
    const rankedAssets = index
      .filter(item => matchesKind(item) && (kind !== 'index' || isVisibleIndexSuggestion(item)))
      .map(item => ({ item, value: score(item, needle) }))
      .filter(entry => entry.value >= 0)
      .sort((a, b) => b.value - a.value || String(a.item.ticker).localeCompare(String(b.item.ticker), 'ru'));
    if (!needle) return { rows: rankedAssets.slice(0, 12).map(entry => ({ type: 'asset', item: entry.item })), total: rankedAssets.length };

    const rankedIssuers = issuers
      .map(issuer => ({ issuer, value: issuerScore(issuer, needle) }))
      .filter(entry => entry.value >= 0)
      .sort((a, b) => b.value - a.value || String(a.issuer.shortName).localeCompare(String(b.issuer.shortName), 'ru'));
    const exactAssets = rankedAssets.filter(entry => entry.value >= 980);
    const rows = [];
    const used = new Set();
    const pushAsset = item => {
      if (!item || used.has(item.id) || !matchesKind(item)) return;
      rows.push({ type: 'asset', item });
      used.add(item.id);
    };

    exactAssets.forEach(entry => pushAsset(entry.item));
    if (exactAssets.length) {
      rankedAssets.forEach(entry => pushAsset(entry.item));
      return { rows: rows.slice(0, 14), total: rankedAssets.length };
    }
    rankedIssuers.slice(0, 2).forEach(({ issuer }, issuerIndex) => {
      issuer.stockIds.slice(0, 2).forEach(id => pushAsset(itemById.get(id)));
      const hasBondHub = issuer.bondIds.length > 1 || (issuer.bondIds.length && issuer.stockIds.length);
      if ((kind === 'all' || kind === 'bond') && hasBondHub) rows.push({ type: 'issuer-bonds', issuer });
      if ((kind === 'all' || kind === 'stock') && issuer.statementTickers.length) {
        rows.push({ type: 'issuer-company', issuer, ticker: issuer.statementTickers[0] });
      }
      if (kind === 'all' || kind === 'bond') issuer.bondIds.slice(0, issuerIndex ? 2 : 5).forEach(id => pushAsset(itemById.get(id)));
    });
    rankedAssets.forEach(entry => pushAsset(entry.item));
    return { rows: rows.slice(0, 14), total: Math.max(rows.length, rankedAssets.length) };
  }

  function render() {
    const needle = normalize(input.value);
    const { rows, total } = buildRows(needle);
    selected = rows.length ? Math.min(Math.max(selected, 0), rows.length - 1) : -1;
    results.innerHTML = rows.length ? rows.map(resultRow).join('') : '<div class="quantis-search__empty">Ничего не найдено. Проверьте тикер, ISIN или название актива.</div>';
    meta.textContent = needle
      ? (total > rows.length ? `Показано ${rows.length} наиболее релевантных результатов` : `Найдено: ${total}`)
      : (expertTop[kind] ? 'Экспертный топ' : '');
  }

  async function openSearch(source) {
    returnFocus = source || document.activeElement;
    closeMobileMenu();
    document.body.classList.add('qn-search-open');
    searchButton.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    panel.inert = false;
    await loadIndex();
    if (!document.body.classList.contains('qn-search-open')) return;
    selected = -1;
    render();
    window.setTimeout(() => input.focus(), 60);
  }

  function closeSearch(restoreFocus = true) {
    document.body.classList.remove('qn-search-open');
    searchButton.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;
    if (restoreFocus && returnFocus?.isConnected) returnFocus.focus();
  }

  function moveSelection(delta) {
    const options = [...results.querySelectorAll('[role="option"]')];
    if (!options.length) return;
    selected = (selected + delta + options.length) % options.length;
    options.forEach((option, indexValue) => option.setAttribute('aria-selected', String(indexValue === selected)));
    options[selected].scrollIntoView({ block: 'nearest' });
  }

  searchButton.addEventListener('click', event => {
    if (document.body.classList.contains('qn-search-open')) {
      closeSearch(false);
      return;
    }
    openSearch(event.currentTarget);
  });
  mobileSearch.addEventListener('click', event => openSearch(event.currentTarget));
  closeButton.addEventListener('click', closeSearch);
  backdrop.addEventListener('click', closeSearch);
  input.addEventListener('input', () => { selected = -1; render(); });
  filterButtons.forEach(button => button.addEventListener('click', () => {
    kind = button.dataset.kind;
    filterButtons.forEach(candidate => candidate.setAttribute('aria-selected', String(candidate === button)));
    selected = -1;
    render();
  }));
  panel.addEventListener('mousemove', event => {
    const option = event.target.closest('[role="option"]');
    if (!option) return;
    const options = [...results.querySelectorAll('[role="option"]')];
    selected = options.indexOf(option);
    options.forEach((candidate, indexValue) => candidate.setAttribute('aria-selected', String(indexValue === selected)));
  });
  document.addEventListener('keydown', event => {
    const shortcut = (event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'k';
    if (shortcut) {
      event.preventDefault();
      document.body.classList.contains('qn-search-open') ? input.focus() : openSearch(document.activeElement);
      return;
    }
    if (document.body.classList.contains('qn-modal-asset-open')) {
      if (event.key === 'Escape') { event.preventDefault(); closeAssetModal(); }
      return;
    }
    if (!document.body.classList.contains('qn-search-open')) {
      if (event.key === 'Escape' && document.body.classList.contains('qn-mobile-menu-open')) {
        event.preventDefault();
        closeMobileMenu();
        mobileMenuButton.focus();
      }
      return;
    }
    if (event.key === 'Escape') { event.preventDefault(); closeSearch(); }
    if (event.key === 'ArrowDown') { event.preventDefault(); moveSelection(1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); moveSelection(-1); }
    if (event.key === 'Enter' && selected >= 0) {
      const option = results.querySelectorAll('[role="option"]')[selected];
      const link = option?.querySelector('.quantis-search-result__main');
      if (link) { event.preventDefault(); link.click(); }
    }
  });

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    let target;
    try { target = new URL(link.href, window.location.href); } catch (_) { return; }
    const isAssetRoute = target.pathname.includes('/asset_cards/') || target.pathname.endsWith('/asset/index.html');
    if (!isAssetRoute) return;
    event.preventDefault();
    if (document.body.classList.contains('qn-search-open')) closeSearch();
    openAssetModal(target.href, link);
  });

  const heroCopy = document.querySelector('.hero .hero-content');
  if (heroCopy) {
    const heroSearch = document.createElement('button');
    heroSearch.type = 'button';
    heroSearch.className = 'quantis-hero-search';
    heroSearch.innerHTML = '<span><strong>Найти актив</strong><small>Акция, облигация, валюта, макроиндикатор, тикер или ISIN</small></span>';
    heroSearch.addEventListener('click', event => openSearch(event.currentTarget));
    heroCopy.append(heroSearch);
  }
})();
(() => {
  'use strict';
  if (!window.location.pathname.includes('/asset_cards/')) return;
  const shellScript = document.currentScript;
  const shellUrl = new URL(shellScript?.src || '../assets/integration-shell.js', window.location.href);
  const tooltipStyle = document.createElement('link');
  tooltipStyle.rel = 'stylesheet';
  tooltipStyle.href = new URL('asset-card.css?v=20260722-hover', shellUrl).href;
  document.head.appendChild(tooltipStyle);
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const formatDate = value => {
    const text = String(value ?? '');
    const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(text) ? `${text}T00:00:00` : text);
    return Number.isNaN(date.getTime()) ? text : date.toLocaleDateString('ru-RU');
  };
  const formatValue = point => {
    const value = Number(point.y);
    if (!Number.isFinite(value)) return '—';
    const name = String(point.data?.name || point.fullData?.name || 'Значение');
    if (/оборот/i.test(name)) return `${value.toLocaleString('ru-RU',{maximumFractionDigits:0})}\u00a0₽`;
    const suffix = /доход|цена, %/i.test(name) ? '%' : '';
    return `${value.toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})}${suffix}`;
  };
  const attach = chart => {
    if (!chart?.on || chart.dataset.assetTooltipBound) return;
    chart.dataset.assetTooltipBound = 'shared';
    let tooltip = chart.querySelector('.asset-chart-tooltip');
    if (!tooltip) { tooltip=document.createElement('div'); tooltip.className='asset-chart-tooltip'; tooltip.setAttribute('role','status'); chart.appendChild(tooltip); }
    let guide = chart.querySelector('.asset-chart-hover-line');
    if (!guide) { guide=document.createElement('span'); guide.className='asset-chart-hover-line'; guide.setAttribute('aria-hidden','true'); chart.appendChild(guide); }
    const coarse=window.matchMedia?.('(pointer: coarse)')?.matches===true;
    const state={pointer:null,touchLocked:false};
    const hide=force=>{if(!force&&coarse&&state.touchLocked)return;tooltip.classList.remove('is-visible');guide.classList.remove('is-visible');};
    chart.addEventListener('mousemove',event=>{const r=chart.getBoundingClientRect(),plot=chart.querySelector('.nsewdrag')?.getBoundingClientRect(),x=event.clientX-r.left,y=event.clientY-r.top;const inside=x>=0&&x<=r.width&&y>=0&&y<=r.height&&(!plot||(event.clientX>=plot.left&&event.clientX<=plot.right&&event.clientY>=plot.top&&event.clientY<=plot.bottom));state.pointer=inside?{x,y}:null;},{capture:true,passive:true});
    chart.addEventListener('mouseleave',()=>{state.pointer=null;hide(false);},{passive:true});
    window.addEventListener('scroll',()=>hide(true),{capture:true,passive:true});
    const render=(event,lock=false)=>{
      const point=event.points?.[0]; if(!point)return hide(true);
      state.touchLocked=lock;
      const points=event.points?.length?event.points:[point];
      tooltip.innerHTML=`<span class="asset-chart-tooltip__period">${escapeHtml(formatDate(point.x))}</span>${points.map(item=>{const name=item.data?.name||item.fullData?.name||'Значение';const color=item.data?.line?.color||item.fullData?.line?.color||item.data?.marker?.color||'rgba(16,18,21,.20)';return `<span class="asset-chart-tooltip__metric"><i style="--tooltip-color:${escapeHtml(color)}"></i>${escapeHtml(name)}</span><strong>${escapeHtml(formatValue(item))}</strong>`;}).join('')}`;
      tooltip.classList.add('is-visible');
      const rect=chart.getBoundingClientRect(),source=event.event||{},ex=Number(source.clientX)-rect.left,ey=Number(source.clientY)-rect.top;
      const axis=point.xaxis?.d2p?point.xaxis.d2p(point.x):point.xaxis?.l2p?point.xaxis.l2p(point.x):NaN,axisX=(Number.isFinite(axis)?axis:rect.width/2)+(point.xaxis?._offset||0);
      const x=state.pointer?.x??(Number.isFinite(ex)&&ex>=0&&ex<=rect.width?ex:axisX),y=state.pointer?.y??(Number.isFinite(ey)&&ey>=0&&ey<=rect.height?ey:rect.height/2);
      requestAnimationFrame(()=>{const w=tooltip.offsetWidth,h=tooltip.offsetHeight;let left=x+16;if(left+w>rect.width-8)left=x-w-16;tooltip.style.left=`${Math.max(8,Math.min(rect.width-w-8,left))}px`;tooltip.style.top=`${Math.max(8,Math.min(rect.height-h-8,y-h/2))}px`;const plot=chart.querySelector('.nsewdrag')?.getBoundingClientRect();guide.style.left=`${axisX}px`;guide.style.top=`${plot?plot.top-rect.top:10}px`;guide.style.height=`${plot?plot.height:Math.max(0,rect.height-48)}px`;guide.classList.add('is-visible');});
    };
    chart.on('plotly_hover',event=>render(event,false));
    chart.on('plotly_click',event=>render(event,true));
    chart.on('plotly_unhover',()=>hide(false));
  };
  let attempts=0;
  const start=()=>{
    const chart=document.getElementById('chart');
    if(chart)attach(chart);
    attempts+=1;
    if(!chart?.dataset.assetTooltipBound&&attempts<20)window.setTimeout(start,150);
  };
  window.setTimeout(start,60);
})();

(() => {
  'use strict';

  const selectSelector = [
    'select.qn-page-size',
    'select.page-size',
    '#stockPageSize',
  ].join(',');
  const shellScript = [...document.scripts].find(script => /integration-shell\.js(?:\?|$)/.test(script.src));
  const iconUrl = new URL('icons/chevron-down.png?v=20260723', shellScript?.src || window.location.href).href;

  function enhance(select) {
    if (!(select instanceof HTMLSelectElement) || select.dataset.qnPageSizeEnhanced === 'true') return;

    let control = select.closest('label');
    if (!control) {
      control = document.createElement('label');
      select.parentNode?.insertBefore(control, select);
      const caption = document.createElement('span');
      caption.textContent = 'На странице';
      control.append(caption, select);
    }
    control.classList.add('qn-page-size-control');
    const caption = [...control.children].find(child => child.tagName === 'SPAN' && !child.classList.contains('qn-page-size-picker'));
    if (caption) caption.textContent = 'Строк';

    const picker = document.createElement('span');
    picker.className = 'qn-page-size-picker';
    picker.setAttribute('aria-hidden', 'true');

    const value = document.createElement('strong');
    value.className = 'qn-page-size-value';
    value.textContent = select.selectedOptions[0]?.textContent?.trim() || select.value;

    const icon = document.createElement('img');
    icon.className = 'qn-page-size-chevron';
    icon.src = iconUrl;
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');

    select.before(picker);
    picker.append(value, icon, select);
    picker.removeAttribute('aria-hidden');
    select.dataset.qnPageSizeEnhanced = 'true';

    select.addEventListener('change', () => {
      value.textContent = select.selectedOptions[0]?.textContent?.trim() || select.value;
    });
  }

  document.querySelectorAll(selectSelector).forEach(enhance);
})();

(() => {
  'use strict';

  const ownScript = [...document.scripts].find(script => /integration-shell\.js(?:\?|$)/.test(script.src));
  const assetBase = ownScript?.src || window.location.href;
  const icons = {
    previous: new URL('icons/chevron-left.png?v=20260723-compact', assetBase).href,
    next: new URL('icons/chevron-right.png?v=20260723-compact', assetBase).href,
  };
  const explicitIds = new Set([
    'stockPagePrev', 'stockPageNext',
    'prevPage', 'nextPage', 'mobilePrevPage', 'mobileNextPage',
    'operatingPrev', 'operatingNext', 'bankPrev', 'bankNext',
    'issuerPrev', 'issuerNext',
  ]);
  const paginationScopes = [
    '.qn-pagination', '.stock-pagination', '.pager',
    '.mobile-pagination', '.issuer-pagination',
  ].join(',');

  function directionOf(button) {
    const text = `${button.id} ${button.getAttribute('aria-label') || ''} ${button.textContent || ''}`.toLocaleLowerCase('ru');
    if (/prev|назад|предыдущ/.test(text)) return 'previous';
    if (/next|впер.д|далее|следующ/.test(text)) return 'next';
    return '';
  }

  function enhancePagination(button) {
    if (!(button instanceof HTMLButtonElement) || button.dataset.qnIconPagination === 'true') return;
    if (!explicitIds.has(button.id) && !button.closest(paginationScopes)) return;
    const direction = directionOf(button);
    if (!direction) return;
    const label = direction === 'previous' ? 'Предыдущая страница' : 'Следующая страница';
    const icon = document.createElement('img');
    icon.src = icons[direction];
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    button.replaceChildren(icon);
    button.classList.add('qn-icon-pagination', `qn-icon-pagination--${direction}`);
    button.setAttribute('aria-label', label);
    button.title = label;
    button.dataset.qnIconPagination = 'true';
  }

  function unifyPaginationLayout(root = document) {
    const buttons = [];
    if (root instanceof HTMLButtonElement && root.matches('.qn-icon-pagination')) buttons.push(root);
    root.querySelectorAll?.('.qn-icon-pagination').forEach(button => buttons.push(button));

    buttons.forEach(button => {
      const parent = button.parentElement;
      if (!parent || parent.classList.contains('qn-pagination-buttons')) return;

      if (parent.classList.contains('qn-pagination')) {
        let group = parent.querySelector(':scope > .qn-pagination-buttons');
        if (!group) {
          group = document.createElement('div');
          group.className = 'qn-pagination-buttons';
          group.setAttribute('role', 'group');
          group.setAttribute('aria-label', 'Навигация по страницам');
          parent.appendChild(group);
        }
        [...parent.children]
          .filter(child => child instanceof HTMLButtonElement && child.classList.contains('qn-icon-pagination'))
          .forEach(child => group.appendChild(child));
        return;
      }

      const directButtons = [...parent.children]
        .filter(child => child instanceof HTMLButtonElement && child.classList.contains('qn-icon-pagination'));
      if (directButtons.length >= 1) {
        parent.classList.add('qn-pagination-buttons');
        parent.setAttribute('role', 'group');
        parent.setAttribute('aria-label', 'Навигация по страницам');
      }
    });
  }

  const compactActionSelector = [
      '#addStockFilter', '#resetStockFilters', '#toggleStockFilters',
      '#addFilterMenu > summary', '#resetAll', '#collapseFilters',
      '[data-qn-reset]', '[data-qn-collapse]', '#openComposerBtn',
    ].join(',');

  function normalizeActionLabel(control) {
    const current = (control.textContent || '').trim();
    let visible = current.replace(/^\+\s*/, '');
    let label = '';
    if (control.matches('#addStockFilter, #addFilterMenu > summary')) {
      visible = 'Добавить';
      label = 'Добавить фильтр';
    } else if (control.matches('#resetStockFilters, #resetAll, [data-qn-reset]')) {
      visible = 'Сбросить';
      label = 'Сбросить фильтры';
    } else if (control.matches('#toggleStockFilters, #collapseFilters, [data-qn-collapse]')) {
      const isShow = /показ/i.test(current);
      visible = isShow ? 'Показать' : 'Скрыть';
      label = isShow ? 'Показать фильтры' : 'Скрыть фильтры';
    }
    if (visible && current !== visible) control.textContent = visible;
    if (label) control.setAttribute('aria-label', label);
  }

  function compactActions(root = document) {
    const controls = [];
    if (root instanceof Element && root.matches(compactActionSelector)) controls.push(root);
    root.querySelectorAll?.(compactActionSelector).forEach(control => controls.push(control));
    controls.forEach(control => {
      control.classList.add('qn-compact-action');
      normalizeActionLabel(control);
    });
    if (root instanceof HTMLButtonElement) enhancePagination(root);
    root.querySelectorAll('button').forEach(enhancePagination);
    unifyPaginationLayout(root);
  }

  function keepFirstPeriodInset() {
    ['bondsPeriodToolbar', 'heatmapPeriodTabs'].forEach(id => {
      const toolbar = document.getElementById(id);
      if (!toolbar || toolbar.dataset.qnPeriodInset === 'true') return;
      toolbar.dataset.qnPeriodInset = 'true';
      toolbar.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button || button !== toolbar.querySelector('button')) return;
        requestAnimationFrame(() => toolbar.scrollTo({ left: 0, behavior: 'auto' }));
      });
    });
  }

  keepFirstPeriodInset();
  compactActions();
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') {
        const parent = record.target.parentElement;
        if (parent) compactActions(parent);
        continue;
      }
      if (record.target instanceof Element) compactActions(record.target);
      for (const node of record.addedNodes) {
        const element = node instanceof Element ? node : node.parentElement;
        if (element) compactActions(element);
      }
    }
  });
  observer.observe(document.documentElement, { childList: true, characterData: true, subtree: true });
})();


/* apple-active-center-lifecycle-v39 */
(() => {
  const selector = '.header-liquid-glass, .size-metric-control, .quantis-search__filters';
  const center = group => {
    if (!group || group.scrollWidth <= group.clientWidth) return;
    const active = group.querySelector('[aria-selected="true"], [aria-pressed="true"]');
    if (!active) return;
    const target = active.offsetLeft - (group.clientWidth - active.offsetWidth) / 2;
    group.scrollLeft = Math.max(0, target);
  };
  const centerAll = () => document.querySelectorAll(selector).forEach(center);
  const schedule = () => requestAnimationFrame(centerAll);
  [0, 120, 360, 900].forEach(delay => window.setTimeout(schedule, delay));
  const observer = new MutationObserver(records => {
    const groups = new Set();
    records.forEach(record => {
      const target = record.target instanceof Element ? record.target : null;
      const group = target?.matches(selector) ? target : target?.closest(selector);
      if (group) groups.add(group);
      if (record.type === 'childList') {
        record.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.matches(selector)) groups.add(node);
          node.querySelectorAll?.(selector).forEach(item => groups.add(item));
        });
      }
    });
    if (groups.size) requestAnimationFrame(() => groups.forEach(center));
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['aria-selected', 'aria-pressed']
  });
})();


/* apple-active-center-geometry-v40 */
(() => {
  const selector = '.header-liquid-glass, .size-metric-control, .quantis-search__filters';
  const center = group => {
    if (!group || group.scrollWidth <= group.clientWidth) return;
    const active = group.querySelector('[aria-selected="true"], [aria-pressed="true"]');
    if (!active) return;
    const groupRect = group.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const delta = (activeRect.left + activeRect.width / 2)
      - (groupRect.left + groupRect.width / 2);
    group.scrollLeft = Math.max(0, group.scrollLeft + delta);
  };
  const centerAll = () => document.querySelectorAll(selector).forEach(center);
  const schedule = () => requestAnimationFrame(centerAll);
  [0, 160, 420, 960].forEach(delay => window.setTimeout(schedule, delay));
  document.addEventListener('click', event => {
    const group = event.target.closest?.(selector);
    if (group) requestAnimationFrame(() => center(group));
  });
  const observer = new MutationObserver(records => {
    const groups = new Set();
    records.forEach(record => {
      const target = record.target instanceof Element ? record.target : null;
      const group = target?.matches(selector) ? target : target?.closest(selector);
      if (group) groups.add(group);
    });
    if (groups.size) requestAnimationFrame(() => groups.forEach(center));
  });
  observer.observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-selected', 'aria-pressed']
  });
})();
