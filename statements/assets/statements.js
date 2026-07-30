(() => {
  'use strict';

  const payload = window.STATEMENTS_INDEX || {};
  const companies = Array.isArray(payload.companies) ? payload.companies : [];
  const state = {
    query: '',
    sectors: new Set(),
    standards: new Set(),
    period: payload.default_period || '2025',
    groups: {
      operating: { page: 1, pageSize: 40, sortKey: 'issuer', sortDir: 'asc' },
      bank: { page: 1, pageSize: 20, sortKey: 'issuer', sortDir: 'asc' },
    },
  };
  const standardOrder = ['IFRS', 'RAS', 'UNKNOWN'];
  const number = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });
  const ratio = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
  const tableConfig = {
    operating: {
      table: 'operatingTable',
      meta: 'operatingMeta',
      count: 'operatingCount',
      pageSize: 'operatingPageSize',
      pageLabel: 'operatingPageLabel',
      prev: 'operatingPrev',
      next: 'operatingNext',
      columns: ['revenue', 'ebitda', 'profit', 'assets', 'equity', 'debt', 'fcf', 'pe', 'pbv', 'ps', 'ev_ebitda', 'roe', 'roa'],
      sortKeys: ['issuer', 'sector', 'standard', 'period', 'revenue', 'ebitda', 'profit', 'assets', 'equity', 'debt', 'fcf', 'pe', 'pbv', 'ps', 'ev_ebitda', 'roe', 'roa'],
      baseColumns: 4,
      colspan: 18,
    },
    bank: {
      table: 'bankTable',
      meta: 'bankMeta',
      count: 'bankCount',
      pageSize: 'bankPageSize',
      pageLabel: 'bankPageLabel',
      prev: 'bankPrev',
      next: 'bankNext',
      columns: ['net_interest_income', 'operating_income', 'nim', 'cir', 'cost_of_risk', 'npl', 'capital_adequacy', 'bank_assets', 'bank_equity', 'deposits', 'roe', 'roa', 'pe', 'pbv'],
      sortKeys: ['issuer', 'standard', 'period', 'net_interest_income', 'operating_income', 'nim', 'cir', 'cost_of_risk', 'npl', 'capital_adequacy', 'bank_assets', 'bank_equity', 'deposits', 'roe', 'roa', 'pe', 'pbv'],
      baseColumns: 3,
      colspan: 18,
    },
  };
  const moneyRoles = new Set([
    'revenue', 'ebitda', 'profit', 'assets', 'equity', 'debt', 'fcf',
    'net_interest_income', 'operating_income', 'bank_assets', 'bank_equity', 'deposits',
  ]);
  const percentRoles = new Set(['roe', 'roa', 'nim', 'cir', 'cost_of_risk', 'npl', 'capital_adequacy']);

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function normalizeSearch(value) {
    return String(value ?? '')
      .toLocaleLowerCase('ru')
      .replace(/ё/g, 'е')
      .replace(/[^a-zа-я0-9]+/giu, ' ')
      .trim()
      .replace(/\s+/g, ' ');
  }

  function standardLabel(value) {
    return value === 'IFRS' ? 'МСФО' : value === 'RAS' ? 'РСБУ' : value === 'UNKNOWN' ? 'Прочие' : value;
  }

  function periodLabel(value) {
    const match = String(value || '').match(/^(\d{4})Q([1-4])$/);
    return match ? `Q${match[2]} ${match[1]}` : String(value || '—');
  }

  function issuerWord(value) {
    const mod100 = value % 100;
    const mod10 = value % 10;
    if (mod100 >= 11 && mod100 <= 14) return 'эмитентов';
    if (mod10 === 1) return 'эмитент';
    if (mod10 >= 2 && mod10 <= 4) return 'эмитента';
    return 'эмитентов';
  }

  function selectedSnapshot(item) {
    const byStandard = item.reporting_table || {};
    const allowed = state.standards.size
      ? standardOrder.filter(standard => state.standards.has(standard))
      : standardOrder;
    for (const standard of allowed) {
      const values = byStandard?.[standard]?.[state.period];
      if (values) return { standard, values };
    }
    return { standard: '', values: null };
  }

  function filtered(group) {
    const query = normalizeSearch(state.query);
    const tokens = query.split(' ').filter(Boolean);
    return companies.filter(item => {
      if (item.reporting_model !== group) return false;
      const haystack = normalizeSearch([
        item.ticker,
        item.isin,
        item.company_name,
        item.sector,
        ...(Array.isArray(item.search_aliases) ? item.search_aliases : []),
      ].join(' '));
      return (!query || tokens.every(token => haystack.includes(token)))
        && (!state.sectors.size || state.sectors.has(item.sector || 'Сектор не указан'))
        && (!state.standards.size || item.standards.some(value => state.standards.has(value)));
    });
  }

  function periodRank(value) {
    if (value === 'LTM') return 99999;
    const quarter = String(value || '').match(/^(\d{4})Q([1-4])$/);
    if (quarter) return Number(quarter[1]) * 4 + Number(quarter[2]);
    const year = Number(value);
    return Number.isFinite(year) ? year * 4 + 4 : null;
  }

  function sortValue(item, key) {
    const snapshot = selectedSnapshot(item);
    if (key === 'issuer') return item.company_name || item.ticker || '';
    if (key === 'sector') return item.sector || 'Сектор не указан';
    if (key === 'standard') return snapshot.standard ? standardLabel(snapshot.standard) : null;
    if (key === 'period') return snapshot.values ? periodRank(state.period) : null;
    const value = Number(snapshot.values?.[key]);
    return Number.isFinite(value) ? value : null;
  }

  function sorted(group, rows) {
    const groupState = state.groups[group];
    const direction = groupState.sortDir === 'desc' ? -1 : 1;
    return rows.slice().sort((a, b) => {
      const aValue = sortValue(a, groupState.sortKey);
      const bValue = sortValue(b, groupState.sortKey);
      const aMissing = aValue === null || aValue === undefined || aValue === '';
      const bMissing = bValue === null || bValue === undefined || bValue === '';
      if (aMissing && bMissing) return String(a.company_name || a.ticker).localeCompare(String(b.company_name || b.ticker), 'ru');
      if (aMissing) return 1;
      if (bMissing) return -1;
      const comparison = typeof aValue === 'number' && typeof bValue === 'number'
        ? aValue - bValue
        : String(aValue).localeCompare(String(bValue), 'ru', { sensitivity: 'base', numeric: true });
      return comparison === 0
        ? String(a.company_name || a.ticker).localeCompare(String(b.company_name || b.ticker), 'ru')
        : comparison * direction;
    });
  }

  function updateSortHeaders(group) {
    const table = document.getElementById(tableConfig[group].table);
    const groupState = state.groups[group];
    table.querySelectorAll('th[data-sort]').forEach(th => {
      const active = th.dataset.sort === groupState.sortKey;
      th.setAttribute('aria-sort', active ? (groupState.sortDir === 'asc' ? 'ascending' : 'descending') : 'none');
      const button = th.querySelector('.statements-sort-button');
      if (button) button.dataset.sortDir = active ? groupState.sortDir : 'none';
    });
  }

  function setupSorting(group) {
    const config = tableConfig[group];
    const table = document.getElementById(config.table);
    table.querySelectorAll('th[data-sort]').forEach(th => {
      const key = th.dataset.sort;
      if (!config.sortKeys.includes(key)) return;
      const label = th.innerHTML;
      const accessibleLabel = th.textContent.trim().replace(/\s+/g, ' ');
      th.innerHTML = `<button class="statements-sort-button" type="button" data-sort-key="${esc(key)}" aria-label="Сортировать: ${esc(accessibleLabel)}"><span class="statements-sort-label">${label}</span><img class="statements-sort-icon" src="../assets/icons/chevron-down.png" alt=""></button>`;
      th.querySelector('button').addEventListener('click', () => {
        const groupState = state.groups[group];
        if (groupState.sortKey === key) {
          groupState.sortDir = groupState.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          groupState.sortKey = key;
          groupState.sortDir = ['issuer', 'sector', 'standard', 'period'].includes(key) ? 'asc' : 'desc';
        }
        groupState.page = 1;
        renderGroup(group);
      });
    });
    updateSortHeaders(group);
  }

  function logo(item) {
    if (!item.logo) return `<span>${esc(item.ticker.slice(0, 3))}</span>`;
    return `<img src="${esc(item.logo)}" alt="" loading="lazy" decoding="async" onerror="this.parentElement.textContent='${esc(item.ticker.slice(0, 3))}'">`;
  }

  function companyCell(item) {
    return `<div class="company-cell">
      <div class="company-logo">${logo(item)}</div>
      <div class="company-copy"><strong>${esc(item.company_name)}</strong><span>${esc(item.display_code || item.ticker)} · ${esc(item.isin || 'ISIN не указан')}</span></div>
    </div>`;
  }

  function metricCell(role, values) {
    const raw = values?.[role];
    const value = Number(raw);
    if (!Number.isFinite(value)) return '<td class="qn-number qn-missing">—</td>';
    const formatted = moneyRoles.has(role)
      ? number.format(value)
      : ratio.format(value);
    const suffix = percentRoles.has(role) ? '%' : '';
    const tone = value < 0 && ['profit', 'fcf', 'roe', 'roa'].includes(role) ? ' qn-negative' : '';
    return `<td class="qn-number${tone}">${esc(formatted)}${suffix}</td>`;
  }

  function rowHtml(item, group) {
    const snapshot = selectedSnapshot(item);
    const values = snapshot.values;
    const leading = group === 'bank'
      ? `<td>${companyCell(item)}</td><td>${snapshot.standard ? `<span class="coverage-tag">${esc(standardLabel(snapshot.standard))}</span>` : '—'}</td><td>${values ? esc(periodLabel(state.period)) : '—'}</td>`
      : `<td>${companyCell(item)}</td><td>${esc(item.sector || 'Сектор не указан')}</td><td>${snapshot.standard ? `<span class="coverage-tag">${esc(standardLabel(snapshot.standard))}</span>` : '—'}</td><td>${values ? esc(periodLabel(state.period)) : '—'}</td>`;
    return `<tr>${leading}${tableConfig[group].columns.map(role => metricCell(role, values)).join('')}<td><a class="statement-link" href="${esc(item.page)}">Открыть</a></td></tr>`;
  }

  function renderGroup(group) {
    const config = tableConfig[group];
    const groupState = state.groups[group];
    const rows = sorted(group, filtered(group));
    const pages = Math.max(1, Math.ceil(rows.length / groupState.pageSize));
    groupState.page = Math.min(groupState.page, pages);
    const start = (groupState.page - 1) * groupState.pageSize;
    const visible = rows.slice(start, start + groupState.pageSize);
    const body = document.querySelector(`#${config.table} tbody`);
    body.innerHTML = visible.length
      ? visible.map(item => rowHtml(item, group)).join('')
      : `<tr><td colspan="${config.colspan}"><div class="empty-state">По заданным условиям эмитенты не найдены.</div></td></tr>`;
    document.getElementById(config.meta).innerHTML = `Показано <strong>${visible.length}</strong> из <strong>${rows.length}</strong> · ${esc(periodLabel(state.period))}`;
    document.getElementById(config.count).textContent = `${rows.length} ${issuerWord(rows.length)}`;
    document.getElementById(config.pageLabel).textContent = `Страница ${groupState.page} из ${pages}`;
    document.getElementById(config.prev).disabled = groupState.page <= 1;
    document.getElementById(config.next).disabled = groupState.page >= pages;
    updateSortHeaders(group);
  }

  function render() {
    renderGroup('operating');
    renderGroup('bank');
  }

  function resetPages() {
    state.groups.operating.page = 1;
    state.groups.bank.page = 1;
  }

  function bindChecks(selector, target) {
    document.querySelectorAll(selector).forEach(input => input.addEventListener('change', () => {
      input.checked ? target.add(input.value) : target.delete(input.value);
      resetPages();
      render();
    }));
  }

  document.getElementById('companySearch').addEventListener('input', event => {
    state.query = event.target.value;
    resetPages();
    render();
  });
  document.getElementById('reportingPeriod').addEventListener('change', event => {
    state.period = event.target.value;
    resetPages();
    render();
  });
  document.querySelector('[data-qn-reset]').addEventListener('click', () => {
    state.query = '';
    state.sectors.clear();
    state.standards.clear();
    state.period = payload.default_period || '2025';
    resetPages();
    document.getElementById('companySearch').value = '';
    document.getElementById('reportingPeriod').value = state.period;
    document.querySelectorAll('[data-sector-filter],[data-standard-filter]').forEach(input => { input.checked = false; });
    window.setTimeout(render, 0);
  });
  Object.entries(tableConfig).forEach(([group, config]) => {
    document.getElementById(config.pageSize).addEventListener('change', event => {
      state.groups[group].pageSize = Number(event.target.value) || 40;
      state.groups[group].page = 1;
      renderGroup(group);
    });
    document.getElementById(config.prev).addEventListener('click', () => {
      state.groups[group].page = Math.max(1, state.groups[group].page - 1);
      renderGroup(group);
    });
    document.getElementById(config.next).addEventListener('click', () => {
      state.groups[group].page += 1;
      renderGroup(group);
    });
  });
  bindChecks('[data-sector-filter]', state.sectors);
  bindChecks('[data-standard-filter]', state.standards);
  setupSorting('operating');
  setupSorting('bank');
  render();
})();
