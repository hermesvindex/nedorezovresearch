/* Interactions for Quantis product component samples. */

(() => {
  'use strict';

  function updateEnumSummary(details) {
    const summary = details.querySelector(':scope > summary');
    const checked = details.querySelectorAll('input[type="checkbox"]:checked').length;
    if (summary) summary.textContent = checked ? `Выбрано: ${checked}` : 'Выбрать';
  }

  document.querySelectorAll('.qn-select').forEach(details => {
    details.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', () => updateEnumSummary(details));
    });
    updateEnumSummary(details);
  });

  document.querySelectorAll('[data-qn-reset]').forEach(button => {
    button.addEventListener('click', () => {
      const shell = button.closest('.qn-filter-shell') || document;
      shell.querySelectorAll('input').forEach(input => {
        if (input.type === 'checkbox') input.checked = false;
        else input.value = '';
      });
      shell.querySelectorAll('.qn-select').forEach(updateEnumSummary);
      shell.dispatchEvent(new CustomEvent('qn:filters-reset', { bubbles: true }));
    });
  });

  document.querySelectorAll('[data-qn-collapse]').forEach(button => {
    button.addEventListener('click', () => {
      const shell = button.closest('.qn-filter-shell');
      if (!shell) return;
      const collapsed = shell.classList.toggle('is-collapsed');
      button.textContent = collapsed ? 'Показать фильтры' : 'Скрыть фильтры';
    });
  });

  document.addEventListener('click', event => {
    const remove = event.target.closest('[data-qn-remove]');
    if (remove) {
      remove.closest('.qn-filter-card')?.remove();
      return;
    }

    const add = event.target.closest('[data-qn-add]');
    if (!add) return;
    const shell = add.closest('.qn-filter-shell');
    const grid = shell?.querySelector('.qn-filter-grid');
    const key = add.dataset.qnAdd;
    if (!grid || grid.querySelector(`[data-qn-filter="${CSS.escape(key)}"]`)) return;

    const card = document.createElement('article');
    card.className = 'qn-filter-card';
    card.dataset.qnFilter = key;
    card.innerHTML = `<div class="qn-filter-card__head"><p class="qn-filter-label">${add.textContent.trim()}</p><button class="qn-filter-remove" type="button" data-qn-remove aria-label="Убрать фильтр">×</button></div><input class="qn-field" type="text" placeholder="">`;
    grid.append(card);
    add.closest('.qn-add-menu')?.removeAttribute('open');
  });

  document.querySelectorAll('[data-qn-table-search]').forEach(input => {
    const table = document.querySelector(input.dataset.qnTableSearch);
    if (!table) return;
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      table.querySelectorAll('tbody tr').forEach(row => {
        row.hidden = Boolean(query && !row.textContent.toLowerCase().includes(query));
      });
    });
  });
})();

