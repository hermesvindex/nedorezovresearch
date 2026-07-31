/* Quantis header component system */

(() => {
  'use strict';

  document.querySelectorAll('.header-liquid-glass').forEach((control) => {
    const buttons = [...control.querySelectorAll('button')];
    const glider = control.querySelector('.header-liquid-glass__glider');

    function updateGlider(immediate = false) {
      const active = control.querySelector('button[aria-selected="true"]');
      if (!active || !glider) return;

      if (immediate) glider.style.transition = 'none';
      glider.style.width = `${active.offsetWidth}px`;
      glider.style.transform = `translateX(${active.offsetLeft}px)`;

      if (immediate) {
        requestAnimationFrame(() => glider.style.removeProperty('transition'));
      }
    }

    function select(button, emit = true) {
      buttons.forEach((item) => {
        const selected = item === button;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });

      updateGlider();

      if (emit) {
        control.dispatchEvent(new CustomEvent('header-liquid-glass:change', {
          bubbles: true,
          detail: { value: button.dataset.value }
        }));
      }
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => select(button));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();

        const current = buttons.indexOf(button);
        const next = event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? buttons.length - 1
            : (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;

        buttons[next].focus();
        select(buttons[next]);
      });
    });

    updateGlider(true);
    new ResizeObserver(() => updateGlider(true)).observe(control);
  });
})();

function renderHeaderSparkline(card) {
  const target = card.querySelector('.market-indicator__chart');
  const values = (card.dataset.points || '').split(',').map(Number).filter(Number.isFinite);
  if (!target || values.length < 2) return;
  const width = 400;
  const height = 100;
  const inset = 8;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(max - min, 1e-9);
  const points = values.map((value, index) => {
    const x = index * width / (values.length - 1);
    const y = height - inset - ((value - min) / spread) * (height - inset * 2);
    return [x, y];
  });
  const line = points.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  target.innerHTML = `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path class="market-indicator__area" d="${area}" fill="currentColor"></path><path class="market-indicator__line" d="${line}"></path></svg>`;
}

document.querySelectorAll('.header-block--market').forEach(renderHeaderSparkline);

document.addEventListener('header-liquid-glass:change', event => {
  const control = event.target.closest('.header-liquid-glass');
  const output = document.getElementById(control?.dataset.output || '');
  if (output) output.textContent = event.detail.value;
});

