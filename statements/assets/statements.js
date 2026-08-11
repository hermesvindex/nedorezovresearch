(() => {
  'use strict';

  const payload = window.STATEMENTS_INDEX || {};
  const companies = Array.isArray(payload.companies) ? payload.companies : [];
  const state = {
    query: '',
    sectors: new Set(),
    standards: new Set(),
    period: payload.default_period || '2025',
    page: 1,
    pageSize: 80,
    sortKey: 'issuer',
    sortDir: 'asc',
  };
  const standardOrder = ['IFRS', 'RAS', 'UNKNOWN'];
  const columns = ['revenue', 'ebitda', 'profit', 'profitability', 'assets', 'equity', 'debt', 'fcf', 'pe', 'pbv', 'ps', 'ev_ebitda', 'roe', 'roa'];
  const sortKeys = new Set(['issuer', 'sector', 'standard', 'period', ...columns]);
  const moneyRoles = new Set(['revenue', 'ebitda', 'profit', 'assets', 'equity', 'debt', 'fcf']);
  const percentRoles = new Set(['profitability', 'roe', 'roa']);
  const bankRoleMap = {
    revenue: 'operating_income',
    ebitda: 'bank_not_applicable',
    assets: 'bank_assets',
    equity: 'bank_equity',
    debt: 'deposits',
  };
  const number = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });
  const ratio = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
  const table = document.getElementById('statementsTable');

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

  function metricRole(item, role) {
    return item.reporting_model === 'bank' ? (bankRoleMap[role] || role) : role;
  }

  function metricValue(item, values, role) {
    if (role === 'profitability') {
      const profit = Number(values?.profit);
      const denominator = Number(values?.[item.reporting_model === 'bank' ? 'operating_income' : 'revenue']);
      if (!Number.isFinite(profit) || !Number.isFinite(denominator) || denominator === 0) return null;
      const profitability = profit / denominator * 100;
      return profitability <= 100 && profitability >= -500 ? profitability : null;
    }
    const value = Number(values?.[metricRole(item, role)]);
    if (!Number.isFinite(value)) return null;
    if (role === 'profit') {
      const denominator = Number(values?.[item.reporting_model === 'bank' ? 'operating_income' : 'revenue']);
      if (value > 0 && Number.isFinite(denominator) && denominator > 0 && value > denominator) return null;
    }
    if (['pe', 'pbv', 'ps', 'ev_ebitda'].includes(role) && Math.abs(value) > 200) return null;
    if (['roe', 'roa'].includes(role) && Math.abs(value) > 500) return null;
    return value;
  }

  function filtered() {
    const query = normalizeSearch(state.query);
    const tokens = query.split(' ').filter(Boolean);
    return companies.filter(item => {
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
    return metricValue(item, snapshot.values, key);
  }

  function sorted(rows) {
    const direction = state.sortDir === 'desc' ? -1 : 1;
    return rows.slice().sort((a, b) => {
      const aValue = sortValue(a, state.sortKey);
      const bValue = sortValue(b, state.sortKey);
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

  function updateSortHeaders() {
    table.querySelectorAll('th[data-sort]').forEach(th => {
      const active = th.dataset.sort === state.sortKey;
      th.setAttribute('aria-sort', active ? (state.sortDir === 'asc' ? 'ascending' : 'descending') : 'none');
      const button = th.querySelector('.statements-sort-button');
      if (button) button.dataset.sortDir = active ? state.sortDir : 'none';
    });
  }

  function setupSorting() {
    table.querySelectorAll('th[data-sort]').forEach(th => {
      const key = th.dataset.sort;
      if (!sortKeys.has(key)) return;
      const label = th.innerHTML;
      const accessibleLabel = th.textContent.trim().replace(/\s+/g, ' ');
      th.innerHTML = `<button class="statements-sort-button" type="button" data-sort-key="${esc(key)}" aria-label="Сортировать: ${esc(accessibleLabel)}"><span class="statements-sort-label">${label}</span><img class="statements-sort-icon" src="../assets/icons/chevron-down.png" alt=""></button>`;
      th.querySelector('button').addEventListener('click', () => {
        if (state.sortKey === key) {
          state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          state.sortKey = key;
          state.sortDir = ['issuer', 'sector', 'standard', 'period'].includes(key) ? 'asc' : 'desc';
        }
        state.page = 1;
        render();
      });
    });
    updateSortHeaders();
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

  function metricCell(item, role, values) {
    const value = metricValue(item, values, role);
    if (value === null) return '<td class="qn-number qn-missing">—</td>';
    const formatted = moneyRoles.has(role) ? number.format(value) : ratio.format(value);
    const suffix = percentRoles.has(role) ? '%' : '';
    const tone = value < 0 && ['profit', 'fcf', 'roe', 'roa'].includes(role) ? ' qn-negative' : '';
    return `<td class="qn-number${tone}">${esc(formatted)}${suffix}</td>`;
  }

  function rowHtml(item) {
    const snapshot = selectedSnapshot(item);
    const action = `<td class="statement-action"><a class="statement-link" href="${esc(item.page)}">Открыть</a></td>`;
    const leading = `<td>${companyCell(item)}</td><td>${esc(item.sector || 'Сектор не указан')}</td>${action}<td>${snapshot.standard ? `<span class="coverage-tag">${esc(standardLabel(snapshot.standard))}</span>` : '—'}</td><td>${snapshot.values ? esc(periodLabel(state.period)) : '—'}</td>`;
    return `<tr>${leading}${columns.map(role => metricCell(item, role, snapshot.values)).join('')}</tr>`;
  }

  function render() {
    const rows = sorted(filtered());
    const pages = Math.max(1, Math.ceil(rows.length / state.pageSize));
    state.page = Math.min(state.page, pages);
    const start = (state.page - 1) * state.pageSize;
    const visible = rows.slice(start, start + state.pageSize);
    table.querySelector('tbody').innerHTML = visible.length
      ? visible.map(rowHtml).join('')
      : '<tr><td colspan="19"><div class="empty-state">По заданным условиям эмитенты не найдены.</div></td></tr>';
    document.getElementById('statementsMeta').innerHTML = `Показано <strong>${visible.length}</strong> из <strong>${rows.length}</strong> · ${esc(periodLabel(state.period))}`;
    document.getElementById('statementsSummary').textContent = `${rows.length} ${issuerWord(rows.length)}`;
    document.getElementById('statementsPageLabel').textContent = `Страница ${state.page} из ${pages}`;
    document.getElementById('statementsPrev').disabled = state.page <= 1;
    document.getElementById('statementsNext').disabled = state.page >= pages;
    updateSortHeaders();
  }

  function resetPageAndRender() {
    state.page = 1;
    render();
  }

  function bindChecks(selector, target) {
    document.querySelectorAll(selector).forEach(input => input.addEventListener('change', () => {
      input.checked ? target.add(input.value) : target.delete(input.value);
      resetPageAndRender();
    }));
  }

  document.getElementById('companySearch').addEventListener('input', event => {
    state.query = event.target.value;
    resetPageAndRender();
  });
  document.getElementById('reportingPeriod').addEventListener('change', event => {
    state.period = event.target.value;
    resetPageAndRender();
  });
  document.querySelector('[data-qn-reset]').addEventListener('click', () => {
    state.query = '';
    state.sectors.clear();
    state.standards.clear();
    state.period = payload.default_period || '2025';
    state.page = 1;
    document.getElementById('companySearch').value = '';
    document.getElementById('reportingPeriod').value = state.period;
    document.querySelectorAll('[data-sector-filter],[data-standard-filter]').forEach(input => { input.checked = false; });
    window.setTimeout(render, 0);
  });
  document.getElementById('statementsPageSize').addEventListener('change', event => {
    state.pageSize = Number(event.target.value) || 80;
    resetPageAndRender();
  });
  document.getElementById('statementsPrev').addEventListener('click', () => {
    state.page = Math.max(1, state.page - 1);
    render();
  });
  document.getElementById('statementsNext').addEventListener('click', () => {
    state.page += 1;
    render();
  });
  bindChecks('[data-sector-filter]', state.sectors);
  bindChecks('[data-standard-filter]', state.standards);
  setupSorting();
  render();
})();

/* statements-touch-drag-v68 · unified-table-v70 */
(() => {
  const install = () => {
    document.querySelectorAll('.qn-table-wrap,.table-scroll,.statement-table-scroll,.company-table-wrap').forEach(scroller => {
      if (scroller.dataset.qnTouchDrag === 'ready' || !scroller.querySelector('.financial-table,#statementsTable')) return;
      scroller.dataset.qnTouchDrag = 'ready';
      let startX = 0;
      let startY = 0;
      let startScrollLeft = 0;
      let dragging = false;
      let suppressClickUntil = 0;

      scroller.addEventListener('touchstart', event => {
        if (event.touches.length !== 1) return;
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        startScrollLeft = scroller.scrollLeft;
        dragging = false;
      }, { passive: true });

      scroller.addEventListener('touchmove', event => {
        if (event.touches.length !== 1) return;
        const touch = event.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        if (!dragging) dragging = Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15;
        if (!dragging) return;
        event.preventDefault();
        scroller.scrollLeft = startScrollLeft - deltaX;
      }, { passive: false });

      scroller.addEventListener('touchend', () => {
        if (dragging) suppressClickUntil = performance.now() + 300;
        dragging = false;
      }, { passive: true });

      scroller.addEventListener('click', event => {
        if (performance.now() >= suppressClickUntil) return;
        event.preventDefault();
        event.stopPropagation();
      }, true);
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
