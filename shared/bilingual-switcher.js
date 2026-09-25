(() => {
  'use strict';

  const script = document.currentScript;
  const locale = script?.dataset.nrLocale === 'en' ? 'en' : 'ru';
  const scriptUrl = new URL(script?.src || window.location.href, window.location.href);
  const projectRoot = new URL('../', scriptUrl);
  const publicRootLayout = script?.dataset.nrPublicRoot === 'true';
  const editionRoot = publicRootLayout && locale === 'ru'
    ? projectRoot
    : new URL(`${locale}/`, projectRoot);
  const preferenceKey = 'nedorezov-plus-2-language';
  const transitionKey = 'nedorezov-plus-2-transition';
  const localizedChoiceAliases = {
    bond_class: {
      'Корпоративные': 'corporate', Corporate: 'corporate',
      'Муниципальные': 'municipal', 'Municipal bonds': 'municipal',
      'ОФЗ': 'ofz', OFZ: 'ofz',
      'Прочие': 'other', Other: 'other',
    },
    coupon_type: {
      'Фикс': 'fixed', 'Fixed rate': 'fixed',
      'Флоатер': 'floating', 'Floating rate': 'floating',
      'Структурные облигации': 'structured', 'Structured notes': 'structured',
    },
  };

  function semanticChoiceValue(filter, value) {
    return localizedChoiceAliases[filter]?.[value] || '';
  }

  function routeTail() {
    const href = window.location.href;
    return href.startsWith(editionRoot.href) ? href.slice(editionRoot.href.length) : 'main/';
  }

  function languageHref(targetLocale) {
    const prefix = publicRootLayout && targetLocale === 'ru' ? '' : `${targetLocale}/`;
    return new URL(`${prefix}${routeTail()}`, projectRoot).href;
  }

  function stableKey(element, fallbackIndex = -1) {
    if (element.id) return `id:${element.id}`;
    if (element.hasAttribute('data-filter')) {
      const filter = element.getAttribute('data-filter') || '';
      const role = element.getAttribute('data-role') || '';
      const semanticValue = role === 'enum-choice' ? semanticChoiceValue(filter, element.value) : '';
      if (semanticValue) return `filter-choice:${encodeURIComponent(filter)}:${encodeURIComponent(semanticValue)}`;
      const peers = [...document.querySelectorAll('[data-filter]')].filter((item) => (
        item.getAttribute('data-filter') === filter && item.getAttribute('data-role') === role
      ));
      return `filter:${encodeURIComponent(filter)}:${encodeURIComponent(role)}:${peers.indexOf(element)}`;
    }
    if (element.hasAttribute('data-active-filter')) {
      const filter = element.getAttribute('data-active-filter') || '';
      const role = element.getAttribute('data-role') || '';
      return `active-filter:${encodeURIComponent(filter)}:${encodeURIComponent(role)}`;
    }
    if (element.getAttribute('name')) {
      const name = element.getAttribute('name');
      const peers = [...document.querySelectorAll('[name]')].filter((item) => item.getAttribute('name') === name);
      return `name:${name}:${peers.indexOf(element)}`;
    }
    for (const attribute of ['data-period', 'data-value', 'data-stock-sort', 'data-sort', 'aria-controls']) {
      const value = element.getAttribute(attribute);
      if (value) {
        const host = element.parentElement?.id ? `#${element.parentElement.id} ` : '';
        return `attribute:${encodeURIComponent(host)}:${encodeURIComponent(attribute)}:${encodeURIComponent(value)}`;
      }
    }
    return fallbackIndex >= 0 ? `control:${fallbackIndex}` : '';
  }

  function captureState(targetLocale) {
    const controls = [];
    document.querySelectorAll('input, select, textarea').forEach((element, index) => {
      const key = stableKey(element, index);
      if (!key) return;
      controls.push({
        key,
        value: element.value,
        selectedIndex: element instanceof HTMLSelectElement ? element.selectedIndex : undefined,
        checked: 'checked' in element ? Boolean(element.checked) : undefined,
      });
    });

    const selected = [];
    document.querySelectorAll('[aria-selected="true"], [aria-pressed="true"]').forEach((element) => {
      if (element.closest('.nr-language-switcher')) return;
      const key = stableKey(element);
      if (key) selected.push(key);
    });

    const openDetails = [];
    document.querySelectorAll('details[open]').forEach((element, index) => {
      openDetails.push(element.id ? `id:${element.id}` : `index:${index}`);
    });

    try {
      sessionStorage.setItem(transitionKey, JSON.stringify({
        createdAt: Date.now(),
        targetLocale,
        route: routeTail().split(/[?#]/, 1)[0],
        controls,
        selected,
        dynamicFilterKeys: [...new Set([...document.querySelectorAll('[data-filter]')].map((element) => element.getAttribute('data-filter')).filter(Boolean))],
        stockMetricFilterKeys: [...new Set([...document.querySelectorAll('[data-stock-filter-key]')].map((element) => element.getAttribute('data-stock-filter-key')).filter(Boolean))],
        baseFilters: [...document.querySelectorAll('[data-base-filter]')].map((element) => ({ key: element.getAttribute('data-base-filter'), visible: !element.hidden })),
        sortStates: [...document.querySelectorAll('[aria-sort]:not([aria-sort="none"])')].map((element) => ({ key: stableKey(element), value: element.getAttribute('aria-sort') })).filter((item) => item.key),
        openDetails,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      }));
    } catch (_) {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
  }

  function findByKey(key) {
    const split = key.indexOf(':');
    if (split < 0) return null;
    const kind = key.slice(0, split);
    const value = key.slice(split + 1);
    if (kind === 'id') return document.getElementById(value);
    if (kind === 'filter' || kind === 'active-filter') {
      const parts = value.split(':');
      const filter = decodeURIComponent(parts[0] || '');
      const role = decodeURIComponent(parts[1] || '');
      if (kind === 'active-filter') return document.querySelector(`[data-active-filter="${CSS.escape(filter)}"][data-role="${CSS.escape(role)}"]`);
      const index = Number(parts[2]);
      return [...document.querySelectorAll('[data-filter]')].filter((item) => (
        item.getAttribute('data-filter') === filter && item.getAttribute('data-role') === role
      ))[index] || null;
    }
    if (kind === 'filter-choice') {
      const parts = value.split(':');
      const filter = decodeURIComponent(parts[0] || '');
      const semanticValue = decodeURIComponent(parts.slice(1).join(':'));
      return [...document.querySelectorAll(`[data-filter="${CSS.escape(filter)}"][data-role="enum-choice"]`)].find((item) => (
        semanticChoiceValue(filter, item.value) === semanticValue
      )) || null;
    }
    if (kind === 'name') {
      const lastSplit = value.lastIndexOf(':');
      const name = value.slice(0, lastSplit);
      const index = Number(value.slice(lastSplit + 1));
      return [...document.querySelectorAll('[name]')].filter((item) => item.getAttribute('name') === name)[index] || null;
    }
    if (kind === 'control') return document.querySelectorAll('input, select, textarea')[Number(value)] || null;
    if (kind === 'attribute') {
      const parts = value.split(':');
      const host = decodeURIComponent(parts[0] || '');
      const attribute = decodeURIComponent(parts[1] || '');
      const attributeValue = decodeURIComponent(parts.slice(2).join(':'));
      return document.querySelector(`${host}[${attribute}="${CSS.escape(attributeValue)}"]`);
    }
    return null;
  }

  function restoreState() {
    let snapshot;
    try {
      snapshot = JSON.parse(sessionStorage.getItem(transitionKey) || 'null');
    } catch (_) {
      return;
    }
    const route = routeTail().split(/[?#]/, 1)[0];
    if (!snapshot || snapshot.targetLocale !== locale || snapshot.route !== route || Date.now() - snapshot.createdAt > 30000) return;
    const restoredElements = new WeakSet();
    const userModifiedKeys = new Set();
    let scrollRestored = false;
    const rememberUserChange = (event) => {
      if (!event.isTrusted) return;
      const element = event.target.closest?.('input, select, textarea, [aria-selected], [aria-pressed], [aria-sort]');
      const key = element ? stableKey(element) : '';
      if (key) userModifiedKeys.add(key);
      const baseAction = event.target.closest?.('[data-add-base], [data-remove-base]');
      const baseKey = baseAction?.getAttribute('data-add-base') || baseAction?.getAttribute('data-remove-base');
      if (baseKey) userModifiedKeys.add(`base:${baseKey}`);
    };
    for (const eventName of ['input', 'change', 'click']) document.addEventListener(eventName, rememberUserChange, true);
    const applySnapshot = () => {
      snapshot.stockMetricFilterKeys?.forEach((key) => {
        if (document.querySelector(`[data-stock-filter-key="${CSS.escape(key)}"]`)) return;
        document.querySelector(`[data-add-stock-metric="${CSS.escape(key)}"]`)?.click();
      });
      snapshot.dynamicFilterKeys?.forEach((key) => {
        if (document.querySelector(`[data-filter="${CSS.escape(key)}"]`)) return;
        document.querySelector(`[data-add-filter="${CSS.escape(key)}"]`)?.click();
      });
      snapshot.baseFilters?.forEach((item) => {
        const card = document.querySelector(`[data-base-filter="${CSS.escape(item.key)}"]`);
        if (!card || restoredElements.has(card) || userModifiedKeys.has(`base:${item.key}`)) return;
        restoredElements.add(card);
        if (item.visible === !card.hidden) return;
        document.querySelector(item.visible ? `[data-add-base="${CSS.escape(item.key)}"]` : `[data-remove-base="${CSS.escape(item.key)}"]`)?.click();
      });
      snapshot.selected?.forEach((key) => {
        const element = findByKey(key);
        if (!element || restoredElements.has(element) || userModifiedKeys.has(key)) return;
        restoredElements.add(element);
        if (element && element.getAttribute('aria-selected') !== 'true' && element.getAttribute('aria-pressed') !== 'true') {
          element.click();
        }
      });
      snapshot.controls?.forEach((item) => {
        const element = findByKey(item.key);
        if (!element || restoredElements.has(element) || userModifiedKeys.has(item.key)) return;
        restoredElements.add(element);
        if (item.checked !== undefined && 'checked' in element) element.checked = item.checked;
        const preservesTargetValue = element instanceof HTMLInputElement && (element.type === 'checkbox' || element.type === 'radio');
        if (item.value !== undefined && !preservesTargetValue) {
          if (element instanceof HTMLSelectElement && ![...element.options].some((option) => option.value === item.value) && Number.isInteger(item.selectedIndex)) {
            element.selectedIndex = Math.min(item.selectedIndex, element.options.length - 1);
          } else {
            element.value = item.value;
          }
        }
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      });
      snapshot.sortStates?.forEach((item) => {
        const element = findByKey(item.key);
        if (!element || restoredElements.has(element) || userModifiedKeys.has(item.key)) return;
        restoredElements.add(element);
        for (let attempt = 0; element && element.getAttribute('aria-sort') !== item.value && attempt < 2; attempt += 1) element.click();
      });
      document.querySelectorAll('details').forEach((element, index) => {
        if (restoredElements.has(element)) return;
        restoredElements.add(element);
        element.open = snapshot.openDetails?.includes(element.id ? `id:${element.id}` : `index:${index}`) || false;
      });
      if (!scrollRestored) {
        scrollRestored = true;
        requestAnimationFrame(() => window.scrollTo(snapshot.scrollX || 0, snapshot.scrollY || 0));
      }
    };

    // Pages initialize at different speeds because large local datasets are
    // decoded after DOMContentLoaded. Reapply the same idempotent snapshot
    // through the end of that initialization window so late renders cannot
    // replace the transferred filters with locale defaults.
    [0, 120, 400, 900, 1800].forEach((delay, index, delays) => {
      window.setTimeout(() => {
        applySnapshot();
        if (index === delays.length - 1) {
          for (const eventName of ['input', 'change', 'click']) document.removeEventListener(eventName, rememberUserChange, true);
          try { sessionStorage.removeItem(transitionKey); } catch (_) {}
        }
      }, delay);
    });
  }

  function prepareLanguageSwitch(targetLocale) {
    if (targetLocale === locale) return false;
    captureState(targetLocale);
    try { localStorage.setItem(preferenceKey, targetLocale); } catch (_) {}
    return true;
  }

  function mount() {
    if (document.querySelector('.nr-language-switcher')) return true;
    document.documentElement.lang = locale;
    try { localStorage.setItem(preferenceKey, locale); } catch (_) {}

    const host = document.querySelector('.qn-main-shell, .quantis-global-shell');
    if (!host) return false;

    const control = document.createElement('div');
    control.className = 'nr-language-switcher';
    control.dataset.locale = locale;
    control.setAttribute('role', 'navigation');
    control.setAttribute('aria-label', locale === 'ru' ? 'Язык интерфейса' : 'Interface language');
    control.innerHTML = ['ru', 'en'].map((value) => (
      `<a class="nr-language-switcher__link" href="${languageHref(value)}" data-language="${value}"${value === locale ? ' aria-current="page"' : ''}>${value.toUpperCase()}</a>`
    )).join('');
    control.addEventListener('click', (event) => {
      const link = event.target.closest('[data-language]');
      if (!link) return;
      if (!prepareLanguageSwitch(link.dataset.language)) event.preventDefault();
    });
    host.classList.add('nr-language-host');
    const reference = host.querySelector('.qn-search-trigger, .contact-link');
    host.insertBefore(control, reference?.parentElement === host ? reference : null);
    window.setTimeout(restoreState, 180);
    return true;
  }

  function start() {
    if (publicRootLayout) {
      let preferredLocale = locale;
      try { preferredLocale = localStorage.getItem(preferenceKey) || locale; } catch (_) {}
      if ((preferredLocale === 'ru' || preferredLocale === 'en') && preferredLocale !== locale) {
        window.location.replace(languageHref(preferredLocale));
        return;
      }
    }
    if (mount()) return;
    const observer = new MutationObserver(() => {
      if (mount()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    [250, 750, 1500, 3000].forEach((delay) => {
      window.setTimeout(() => {
        if (mount()) observer.disconnect();
      }, delay);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
