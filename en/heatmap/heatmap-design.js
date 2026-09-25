(() => {
  'use strict';

  const periodSelect = document.getElementById('periodSelect');
  const periodOutput = document.getElementById('heatmapPeriodOutput');

  document.addEventListener('header-liquid-glass:change', (event) => {
    if (event.target?.id !== 'heatmapPeriodTabs' || !periodSelect) return;
    const value = event.detail?.value;
    if (!value || periodSelect.value === value) return;
    periodSelect.value = value;
    if (periodOutput) periodOutput.textContent = value;
    periodSelect.dispatchEvent(new Event('change', { bubbles: true }));
  });

  periodSelect?.addEventListener('change', () => {
    if (periodOutput) periodOutput.textContent = periodSelect.value;
  });
})();
