(() => {
  'use strict';

  const root = document.querySelector('[data-issuer-instruments]');
  const data = window.QUANTIS_ISSUER_MARKET;
  if (!root || !data) return;
  const ownScript = [...document.scripts].find(script => /issuer-instruments\.js(?:\?|$)/.test(script.src));
  const iconBase = ownScript?.src || window.location.href;
  const iconUrl = name => new URL(`icons/${name}.png?v=20260723`, iconBase).href;

  if (!data.stocks?.length && !data.bonds?.length) {
    root.innerHTML = '<div class="issuer-instruments__head"><div><p class="issuer-instruments__eyebrow">Инструменты</p><h2>Рыночные инструменты эмитента</h2><p>Связанные акции и облигации отсутствуют в текущем локальном каталоге.</p></div></div>';
    return;
  }

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
  const fmt = (value, digits = 2) => value == null || !Number.isFinite(Number(value)) ? '—' : Number(value).toLocaleString('ru-RU', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const option = (value, label = value) => `<option value="${esc(value)}">${esc(label)}</option>`;
  const state = { visible: [], filters: {}, sort: 'turnover', page: 1, pageSize: 80 };

  const filterDefinitions = [
    { key:'search', label:'Поиск', type:'search' },
    { key:'bond_class', label:'Класс выпуска', type:'enum' },
    { key:'coupon_type', label:'Тип купона', type:'enum' },
    { key:'nominal_currency', label:'Валюта', type:'enum' },
    { key:'credit_rating', label:'Рейтинг', type:'enum' },
    { key:'maturity_date', label:'Погашение', type:'date' },
    { key:'next_coupon_date', label:'Ближайший купон', type:'date' },
    { key:'price_pct', label:'Цена, %', type:'number' },
    { key:'coupon_rate_pct', label:'Купон, %', type:'number' },
    { key:'current_yield_pct', label:'Текущая доходность, %', type:'number' },
    { key:'ytm_pct', label:'Доходность к погашению, %', type:'number' },
    { key:'avg_daily_turnover', label:'Среднедневной оборот, ₽', type:'number' },
  ];
  const definitionByKey = new Map(filterDefinitions.map(definition => [definition.key, definition]));
  const unique = key => [...new Set(data.bonds.map(item => item[key]).filter(value => value !== null && value !== undefined && value !== ''))].sort((a, b) => String(a).localeCompare(String(b), 'ru', { numeric:true }));

  root.innerHTML = `
    <div class="issuer-instruments__head issuer-instruments__head--primary">
      <div><p class="issuer-instruments__eyebrow">Инструменты</p><h2>Рыночные инструменты эмитента</h2><p>${esc(data.shortName || data.name)} · акции и облигационные выпуски</p></div>
      <span class="issuer-instruments__meta" id="issuerMarketMeta"></span>
    </div>
    ${data.stocks.length ? `<section class="issuer-instruments__section">
      <div class="issuer-instruments__head"><div><p class="issuer-instruments__eyebrow">Долевые инструменты</p><h2>Акции</h2></div><span class="issuer-instruments__count">${data.stocks.length}</span></div>
      <div class="issuer-instruments__table issuer-instruments__table--stocks"><table><thead><tr><th>Инструмент</th><th>Тикер</th><th>ISIN</th><th>Тип</th></tr></thead><tbody>${data.stocks.map(item => `<tr data-href="${esc(item.href)}"><td><div class="issuer-instruments__name"><strong>${esc(item.shortName || item.name)}</strong><small>${esc(item.name)}</small></div></td><td>${esc(item.ticker)}</td><td>${esc(item.isin || '—')}</td><td>${esc(item.typeName || item.kindLabel)}</td></tr>`).join('')}</tbody></table></div>
    </section>` : ''}
    <section class="issuer-instruments__section issuer-instruments__section--bonds">
      <div class="issuer-instruments__head"><div><p class="issuer-instruments__eyebrow">Долговые инструменты</p><h2>Облигации</h2><p>Полный список выпусков с фильтрацией и сортировкой</p></div><span class="issuer-instruments__count">${data.bonds.length}</span></div>
      <div class="issuer-filter-shell" id="issuerFilterShell">
        <div class="issuer-filter-shell__head">
          <div class="issuer-filter-shell__title"><strong>Фильтры</strong><span id="issuerFilterCount">0 выбрано</span></div>
          <div class="issuer-filter-shell__actions">
            <details class="issuer-add-filter" id="issuerAddFilter"><summary aria-label="Добавить фильтр">Добавить</summary><div class="issuer-add-filter__list" id="issuerAddFilterList"></div></details>
            <button class="issuer-filter-reset" id="issuerReset" type="button" aria-label="Сбросить фильтры" disabled>Сбросить</button>
          </div>
        </div>
        <div class="issuer-filter-grid" id="issuerFilterGrid"></div>
      </div>
      <div class="issuer-table-toolbar"><span id="issuerTableMeta"></span><label class="issuer-sort-control"><span>Сортировка</span><span class="issuer-sort-picker"><strong id="issuerSortValue">По обороту</strong><img src="${iconUrl('chevron-down')}" alt="" aria-hidden="true"><select id="issuerSort" aria-label="Сортировка выпусков">${option('turnover','По обороту')}${option('ytm','По доходности')}${option('maturity','По погашению')}${option('title','По названию')}</select></span></label></div>
      <div class="issuer-instruments__table issuer-instruments__table--bonds"><table><thead><tr><th>Выпуск</th><th>ISIN</th><th>Цена, %</th><th>Купон, %</th><th>Текущая, %</th><th>YTM, %</th><th>Тип</th><th>Валюта</th><th>Рейтинг</th><th>Погашение</th></tr></thead><tbody id="issuerBondRows"></tbody></table></div>
      <div class="issuer-pagination"><span id="issuerPageMeta"></span><span class="issuer-pagination-buttons"><button id="issuerPrev" type="button" aria-label="Предыдущая страница" title="Предыдущая страница"><img src="${iconUrl('chevron-left')}" alt="" aria-hidden="true"></button><button id="issuerNext" type="button" aria-label="Следующая страница" title="Следующая страница"><img src="${iconUrl('chevron-right')}" alt="" aria-hidden="true"></button></span></div>
      <a class="issuer-instruments__more" href="${esc(data.bondsmapHref)}"><span><strong>Общая карта облигаций</strong><small>Сравнить выпуски эмитента со всем рынком</small></span><span>Открыть карту</span></a>
    </section>`;

  const rows = root.querySelector('#issuerBondRows');
  const filterGrid = root.querySelector('#issuerFilterGrid');
  const addFilterList = root.querySelector('#issuerAddFilterList');
  const addFilterMenu = root.querySelector('#issuerAddFilter');
  const resetButton = root.querySelector('#issuerReset');
  const sortControl = root.querySelector('#issuerSort');
  const sortValue = root.querySelector('#issuerSortValue');

  function filterBody(definition) {
    const filter = state.filters[definition.key] || {};
    if (definition.type === 'search') return `<input class="issuer-smart-search" type="search" data-filter="search" data-role="search" value="${esc(filter.value || '')}" placeholder="Название, ISIN или тикер">`;
    if (definition.type === 'enum') {
      const selected = filter.values || [];
      return `<details class="issuer-multi-select"><summary>${selected.length ? `Выбрано: ${selected.length}` : 'Выбрать'}</summary><div class="issuer-multi-select__list">${unique(definition.key).map(value => `<label><input type="checkbox" data-filter="${definition.key}" data-role="enum" value="${esc(value)}"${selected.includes(String(value)) ? ' checked' : ''}><span>${esc(value)}</span></label>`).join('')}</div></details>`;
    }
    if (definition.type === 'date') return `<div class="issuer-filter-range"><label><span>от</span><input type="date" data-filter="${definition.key}" data-role="from" value="${esc(filter.from || '')}"></label><label><span>до</span><input type="date" data-filter="${definition.key}" data-role="to" value="${esc(filter.to || '')}"></label></div>`;
    return `<div class="issuer-filter-range"><input type="number" step="any" data-filter="${definition.key}" data-role="min" value="${filter.min ?? ''}" placeholder="От"><input type="number" step="any" data-filter="${definition.key}" data-role="max" value="${filter.max ?? ''}" placeholder="До"></div>`;
  }

  function buildFilters() {
    filterGrid.innerHTML = state.visible.map(key => {
      const definition = definitionByKey.get(key);
      return `<div class="issuer-filter-card"><div class="issuer-filter-card__head"><strong>${esc(definition.label)}</strong><button type="button" data-remove-filter="${key}">Убрать</button></div>${filterBody(definition)}</div>`;
    }).join('');
    addFilterList.innerHTML = filterDefinitions.filter(definition => !state.visible.includes(definition.key)).map(definition => `<button type="button" data-add-filter="${definition.key}">${esc(definition.label)}</button>`).join('') || '<p>Все фильтры добавлены</p>';
    root.querySelector('#issuerFilterCount').textContent = `${state.visible.length} ${state.visible.length === 1 ? 'выбран' : 'выбрано'}`;
    resetButton.disabled = state.visible.length === 0;
  }

  function activeFilter(item, definition) {
    const filter = state.filters[definition.key] || {};
    if (definition.type === 'search') return !filter.value || String(item.search_blob || `${item.title} ${item.isin} ${item.secid}`).toLowerCase().includes(filter.value);
    if (definition.type === 'enum') return !filter.values?.length || filter.values.includes(String(item[definition.key] ?? ''));
    if (definition.type === 'date') {
      const value = String(item[definition.key] || '');
      if (filter.from && (!value || value < filter.from)) return false;
      if (filter.to && (!value || value > filter.to)) return false;
      return true;
    }
    const value = Number(item[definition.key]);
    if (filter.min !== null && filter.min !== undefined && filter.min !== '' && (!Number.isFinite(value) || value < Number(filter.min))) return false;
    if (filter.max !== null && filter.max !== undefined && filter.max !== '' && (!Number.isFinite(value) || value > Number(filter.max))) return false;
    return true;
  }

  function dateSortKey(value) {
    const match = String(value || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match ? Number(`${match[1]}${match[2]}${match[3]}`) : null;
  }

  function compareMaturity(a, b) {
    const aValue = dateSortKey(a.maturity_date);
    const bValue = dateSortKey(b.maturity_date);
    if (aValue === null && bValue === null) return String(a.title || '').localeCompare(String(b.title || ''), 'ru');
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    return aValue - bValue;
  }

  function render() {
    const filtered = data.bonds.filter(item => state.visible.every(key => activeFilter(item, definitionByKey.get(key))));
    filtered.sort((a, b) => state.sort === 'ytm' ? (Number(b.ytm_pct) || -1) - (Number(a.ytm_pct) || -1) : state.sort === 'maturity' ? compareMaturity(a, b) : state.sort === 'title' ? String(a.title).localeCompare(String(b.title), 'ru') : (Number(b.avg_daily_turnover) || 0) - (Number(a.avg_daily_turnover) || 0));
    const pages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    state.page = Math.min(state.page, pages);
    const from = (state.page - 1) * state.pageSize;
    const visibleRows = filtered.slice(from, from + state.pageSize);
    rows.innerHTML = visibleRows.length ? visibleRows.map(item => `<tr data-href="${esc(item.href)}"><td><div class="issuer-instruments__name"><strong>${esc(item.title)}</strong><small>${esc(item.secid)}</small></div></td><td>${esc(item.isin || item.secid)}</td><td><span class="issuer-metric">${fmt(item.price_pct)}</span></td><td><span class="issuer-metric">${fmt(item.coupon_rate_pct)}</span></td><td><span class="issuer-metric">${fmt(item.current_yield_pct)}</span></td><td><span class="issuer-metric issuer-metric--accent">${fmt(item.ytm_pct)}</span></td><td>${esc(item.coupon_type || '—')}</td><td>${esc(item.nominal_currency || '—')}</td><td>${esc(item.credit_rating || '—')}</td><td>${esc(item.maturity_date || '—')}</td></tr>`).join('') : '<tr><td colspan="10"><div class="issuer-instruments__empty">По заданным фильтрам выпусков не найдено.</div></td></tr>';
    const shownFrom = filtered.length ? from + 1 : 0;
    const shownTo = Math.min(from + state.pageSize, filtered.length);
    root.querySelector('#issuerMarketMeta').textContent = `Акций: ${data.stocks.length} · облигаций: ${filtered.length} из ${data.bonds.length}`;
    root.querySelector('#issuerTableMeta').textContent = `Показано ${shownFrom}–${shownTo} из ${filtered.length}`;
    root.querySelector('#issuerPageMeta').textContent = `Страница ${state.page} из ${pages}`;
    root.querySelector('#issuerPrev').disabled = state.page <= 1;
    root.querySelector('#issuerNext').disabled = state.page >= pages;
  }

  root.addEventListener('click', event => {
    const add = event.target.closest('[data-add-filter]');
    if (add) {
      state.visible.push(add.dataset.addFilter);
      state.filters[add.dataset.addFilter] = {};
      state.page = 1;
      addFilterMenu.removeAttribute('open');
      buildFilters();
      render();
      return;
    }
    const remove = event.target.closest('[data-remove-filter]');
    if (remove) {
      state.visible = state.visible.filter(key => key !== remove.dataset.removeFilter);
      delete state.filters[remove.dataset.removeFilter];
      state.page = 1;
      buildFilters();
      render();
      return;
    }
    const row = event.target.closest('tr[data-href]');
    if (row) {
      if (typeof window.QuantisOpenAsset === 'function') window.QuantisOpenAsset(row.dataset.href, row);
      else window.location.href = row.dataset.href;
    }
  });

  root.addEventListener('input', event => {
    const node = event.target.closest('[data-filter]');
    if (!node) return;
    const filter = state.filters[node.dataset.filter] || {};
    if (node.dataset.role === 'search') filter.value = node.value.trim().toLowerCase();
    if (node.dataset.role === 'min' || node.dataset.role === 'max' || node.dataset.role === 'from' || node.dataset.role === 'to') filter[node.dataset.role] = node.value;
    state.filters[node.dataset.filter] = filter;
    state.page = 1;
    render();
  });
  root.addEventListener('change', event => {
    const node = event.target.closest('[data-filter]');
    if (!node || node.dataset.role !== 'enum') return;
    const values = [...root.querySelectorAll(`[data-filter="${node.dataset.filter}"][data-role="enum"]:checked`)].map(input => input.value);
    state.filters[node.dataset.filter] = { values };
    const summary = node.closest('.issuer-multi-select')?.querySelector('summary');
    if (summary) summary.textContent = values.length ? `Выбрано: ${values.length}` : 'Выбрать';
    state.page = 1;
    render();
  });
  resetButton.addEventListener('click', () => { state.visible = []; state.filters = {}; state.page = 1; buildFilters(); render(); });
  sortControl.addEventListener('change', () => {
    state.sort = sortControl.value;
    state.page = 1;
    sortValue.textContent = sortControl.selectedOptions[0]?.textContent?.trim() || sortControl.value;
    render();
  });
  root.querySelector('#issuerPrev').addEventListener('click', () => { state.page = Math.max(1, state.page - 1); render(); root.querySelector('.issuer-table-toolbar').scrollIntoView({ block:'start', behavior:'smooth' }); });
  root.querySelector('#issuerNext').addEventListener('click', () => { state.page += 1; render(); root.querySelector('.issuer-table-toolbar').scrollIntoView({ block:'start', behavior:'smooth' }); });

  buildFilters();
  render();
})();
