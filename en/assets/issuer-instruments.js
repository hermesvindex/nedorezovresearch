(() => {
  'use strict';

  const root = document.querySelector('[data-issuer-instruments]');
  const data = window.QUANTIS_ISSUER_MARKET;
  if (!root || !data) return;
  const ownScript = [...document.scripts].find(script => /issuer-instruments\.js(?:\?|$)/.test(script.src));
  const iconBase = ownScript?.src || window.location.href;
  const iconUrl = name => new URL(`icons/${name}.png?v=20260723`, iconBase).href;
  const localeRoot = new URL('../', iconBase);
  const localizedBondsmapHref = (() => {
    const source = new URL(data.bondsmapHref || 'bondsmap/bondsmap.html', window.location.href);
    return new URL(`bondsmap/bondsmap.html${source.search}${source.hash}`, localeRoot).href;
  })();

  if (!data.stocks?.length && !data.bonds?.length) {
    root.innerHTML = '<div class="issuer-instruments__head"><div><p class="issuer-instruments__eyebrow">Instruments</p><h2>Issuer securities</h2><p>No linked equities or bonds are available in the current local catalogue.</p></div></div>';
    return;
  }

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
  const fmt = (value, digits = 2) => value == null || !Number.isFinite(Number(value)) ? '—' : Number(value).toLocaleString('en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const option = (value, label = value) => `<option value="${esc(value)}">${esc(label)}</option>`;
  const state = { visible: [], filters: {}, sort: 'turnover', page: 1, pageSize: 80 };

  const filterDefinitions = [
    { key:'search', label:'Search', type:'search' },
    { key:'bond_class', label:'Asset class issue', type:'enum' },
    { key:'coupon_type', label:'Coupon type', type:'enum' },
    { key:'nominal_currency', label:'Currency', type:'enum' },
    { key:'credit_rating', label:'Credit rating', type:'enum' },
    { key:'maturity_date', label:'Maturity', type:'date' },
    { key:'next_coupon_date', label:'Next coupon', type:'date' },
    { key:'price_pct', label:'Price, %', type:'number' },
    { key:'coupon_rate_pct', label:'Coupon, %', type:'number' },
    { key:'current_yield_pct', label:'Current yield, %', type:'number' },
    { key:'ytm_pct', label:'Yield to maturity, %', type:'number' },
    { key:'avg_daily_turnover', label:'Average daily turnover, RUB', type:'number' },
  ];
  const definitionByKey = new Map(filterDefinitions.map(definition => [definition.key, definition]));
  const unique = key => [...new Set(data.bonds.map(item => item[key]).filter(value => value !== null && value !== undefined && value !== ''))].sort((a, b) => String(a).localeCompare(String(b), 'ru', { numeric:true }));

  root.innerHTML = `
    <div class="issuer-instruments__head issuer-instruments__head--primary">
      <div><p class="issuer-instruments__eyebrow">Instruments</p><h2>Issuer securities</h2><p>${esc(data.shortName || data.name)} · equities and bond issues</p></div>
      <span class="issuer-instruments__meta" id="issuerMarketMeta"></span>
    </div>
    ${data.stocks.length ? `<section class="issuer-instruments__section">
      <div class="issuer-instruments__head"><div><p class="issuer-instruments__eyebrow">Equity instruments</p><h2>Equities</h2></div><span class="issuer-instruments__count">${data.stocks.length}</span></div>
      <div class="issuer-instruments__table issuer-instruments__table--stocks"><table><thead><tr><th>Instrument</th><th>Ticker</th><th>ISIN</th><th>Type</th></tr></thead><tbody>${data.stocks.map(item => `<tr data-href="${esc(item.href)}"><td><div class="issuer-instruments__name"><strong>${esc(item.shortName || item.name)}</strong><small>${esc(item.name)}</small></div></td><td>${esc(item.ticker)}</td><td>${esc(item.isin || '—')}</td><td>${esc(item.typeName || item.kindLabel)}</td></tr>`).join('')}</tbody></table></div>
    </section>` : ''}
    <section class="issuer-instruments__section issuer-instruments__section--bonds">
      <div class="issuer-instruments__head"><div><p class="issuer-instruments__eyebrow">Debt instruments</p><h2>Bonds</h2><p>Complete issue list with filtering and sorting</p></div><span class="issuer-instruments__count">${data.bonds.length}</span></div>
      <div class="issuer-filter-shell" id="issuerFilterShell">
        <div class="issuer-filter-shell__head">
          <div class="issuer-filter-shell__title"><strong>Filters</strong><span id="issuerFilterCount">0 selected</span></div>
          <div class="issuer-filter-shell__actions">
            <details class="issuer-add-filter" id="issuerAddFilter"><summary aria-label="Add filter">Add</summary><div class="issuer-add-filter__list" id="issuerAddFilterList"></div></details>
            <button class="issuer-filter-reset" id="issuerReset" type="button" aria-label="Reset filters" disabled>Reset</button>
          </div>
        </div>
        <div class="issuer-filter-grid" id="issuerFilterGrid"></div>
      </div>
      <div class="issuer-table-toolbar"><span id="issuerTableMeta"></span><label class="issuer-sort-control"><span>Sorted by</span><span class="issuer-sort-picker"><strong id="issuerSortValue">By turnover</strong><img src="${iconUrl('chevron-down')}" alt="" aria-hidden="true"><select id="issuerSort" aria-label="Sorted by issues">${option('turnover','By turnover')}${option('ytm','By yield')}${option('maturity','By maturity date')}${option('title','By name')}</select></span></label></div>
      <div class="issuer-instruments__table issuer-instruments__table--bonds"><table><thead><tr><th>Issue</th><th>ISIN</th><th>Price, %</th><th>Coupon, %</th><th>Current, %</th><th>YTM, %</th><th>Type</th><th>Currency</th><th>Credit rating</th><th>Maturity</th></tr></thead><tbody id="issuerBondRows"></tbody></table></div>
      <div class="issuer-pagination"><span id="issuerPageMeta"></span><span class="issuer-pagination-buttons"><button id="issuerPrev" type="button" aria-label="Previous page" title="Previous page"><img src="${iconUrl('chevron-left')}" alt="" aria-hidden="true"></button><button id="issuerNext" type="button" aria-label="Next page" title="Next page"><img src="${iconUrl('chevron-right')}" alt="" aria-hidden="true"></button></span></div>
      <a class="issuer-instruments__more" href="${esc(localizedBondsmapHref)}"><span><strong>Full bond map</strong><small>Compare the issuer's bonds with the broader market</small></span><span>Open bond map</span></a>
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
    if (definition.type === 'search') return `<input class="issuer-smart-search" type="search" data-filter="search" data-role="search" value="${esc(filter.value || '')}" placeholder="Name, ISIN or ticker">`;
    if (definition.type === 'enum') {
      const selected = filter.values || [];
      return `<details class="issuer-multi-select"><summary>${selected.length ? `Selected: ${selected.length}` : 'Select'}</summary><div class="issuer-multi-select__list">${unique(definition.key).map(value => `<label><input type="checkbox" data-filter="${definition.key}" data-role="enum" value="${esc(value)}"${selected.includes(String(value)) ? ' checked' : ''}><span>${esc(value)}</span></label>`).join('')}</div></details>`;
    }
    if (definition.type === 'date') return `<div class="issuer-filter-range"><label><span>from</span><input type="date" data-filter="${definition.key}" data-role="from" value="${esc(filter.from || '')}"></label><label><span>until</span><input type="date" data-filter="${definition.key}" data-role="to" value="${esc(filter.to || '')}"></label></div>`;
    return `<div class="issuer-filter-range"><input type="number" step="any" data-filter="${definition.key}" data-role="min" value="${filter.min ?? ''}" placeholder="From"><input type="number" step="any" data-filter="${definition.key}" data-role="max" value="${filter.max ?? ''}" placeholder="Until"></div>`;
  }

  function buildFilters() {
    filterGrid.innerHTML = state.visible.map(key => {
      const definition = definitionByKey.get(key);
      return `<div class="issuer-filter-card"><div class="issuer-filter-card__head"><strong>${esc(definition.label)}</strong><button type="button" data-remove-filter="${key}">Remove</button></div>${filterBody(definition)}</div>`;
    }).join('');
    addFilterList.innerHTML = filterDefinitions.filter(definition => !state.visible.includes(definition.key)).map(definition => `<button type="button" data-add-filter="${definition.key}">${esc(definition.label)}</button>`).join('') || '<p>All filters have been added</p>';
    root.querySelector('#issuerFilterCount').textContent = `${state.visible.length} ${state.visible.length === 1 ? 'vybran' : 'selected'}`;
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
    rows.innerHTML = visibleRows.length ? visibleRows.map(item => `<tr data-href="${esc(item.href)}"><td><div class="issuer-instruments__name"><strong>${esc(item.title)}</strong><small>${esc(item.secid)}</small></div></td><td>${esc(item.isin || item.secid)}</td><td><span class="issuer-metric">${fmt(item.price_pct)}</span></td><td><span class="issuer-metric">${fmt(item.coupon_rate_pct)}</span></td><td><span class="issuer-metric">${fmt(item.current_yield_pct)}</span></td><td><span class="issuer-metric issuer-metric--accent">${fmt(item.ytm_pct)}</span></td><td>${esc(item.coupon_type || '—')}</td><td>${esc(item.nominal_currency || '—')}</td><td>${esc(item.credit_rating || '—')}</td><td>${esc(item.maturity_date || '—')}</td></tr>`).join('') : '<tr><td colspan="10"><div class="issuer-instruments__empty">No bond issues match the selected filters.</div></td></tr>';
    const shownFrom = filtered.length ? from + 1 : 0;
    const shownTo = Math.min(from + state.pageSize, filtered.length);
    root.querySelector('#issuerMarketMeta').textContent = `Equities: ${data.stocks.length} · bonds: ${filtered.length} of ${data.bonds.length}`;
    root.querySelector('#issuerTableMeta').textContent = `Showing ${shownFrom}–${shownTo} of ${filtered.length}`;
    root.querySelector('#issuerPageMeta').textContent = `Page ${state.page} of ${pages}`;
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
    if (summary) summary.textContent = values.length ? `Selected: ${values.length}` : 'Select';
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
