(function () {
  'use strict';

  const initialized = new WeakSet();
  const focusable = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';

  function updateGlider(root, immediate = false) {
    const active = root.querySelector('button[aria-selected="true"]');
    const glider = root.querySelector('.lg-segmented__glider');
    if (!active || !glider) return;
    if (immediate) glider.style.transition = 'none';
    glider.style.width = `${active.offsetWidth}px`;
    glider.style.transform = `translateX(${active.offsetLeft}px)`;
    if (immediate) requestAnimationFrame(() => { glider.style.removeProperty('transition'); });
  }

  function selectSegment(root, button, emit = true) {
    const allButtons = [...root.querySelectorAll('button')];
    const previous = allButtons.findIndex((item) => item.getAttribute('aria-selected') === 'true');
    const next = allButtons.indexOf(button);
    root.dataset.lgMoving = next >= previous ? 'right' : 'left';
    window.clearTimeout(root._lgMotionTimer);
    root._lgMotionTimer = window.setTimeout(() => delete root.dataset.lgMoving, 580);
    root.querySelectorAll('button').forEach((item) => {
      const selected = item === button;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    updateGlider(root);
    if (emit) root.dispatchEvent(new CustomEvent('lg:change', { bubbles: true, detail: { value: button.dataset.value || button.textContent.trim() } }));
  }

  function initSegmented(root) {
    if (initialized.has(root)) return;
    initialized.add(root);
    root.setAttribute('role', 'tablist');
    let glider = root.querySelector('.lg-segmented__glider');
    if (!glider) {
      glider = document.createElement('span');
      glider.className = 'lg-segmented__glider';
      glider.setAttribute('aria-hidden', 'true');
      root.prepend(glider);
    }
    const buttons = [...root.querySelectorAll('button')];
    if (!buttons.some((button) => button.getAttribute('aria-selected') === 'true') && buttons[0]) buttons[0].setAttribute('aria-selected', 'true');
    buttons.forEach((button) => {
      button.setAttribute('role', 'tab');
      button.addEventListener('click', () => selectSegment(root, button));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const current = buttons.indexOf(button);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
        buttons[next].focus();
        selectSegment(root, buttons[next]);
      });
    });
    updateGlider(root, true);
    new ResizeObserver(() => updateGlider(root, true)).observe(root);
  }

  function closeOverlay(overlay) {
    if (!overlay?.hasAttribute('open')) return;
    overlay.removeAttribute('open');
    document.documentElement.style.removeProperty('overflow');
    overlay._lgTrigger?.focus?.();
    overlay.dispatchEvent(new CustomEvent('lg:close', { bubbles: true }));
  }

  function openOverlay(overlay, trigger) {
    if (!overlay) return;
    overlay._lgTrigger = trigger || document.activeElement;
    overlay.setAttribute('open', '');
    document.documentElement.style.overflow = 'hidden';
    const target = overlay.querySelector('[autofocus]') || overlay.querySelector(focusable);
    requestAnimationFrame(() => target?.focus());
    overlay.dispatchEvent(new CustomEvent('lg:open', { bubbles: true }));
  }

  function initOverlay(overlay) {
    if (initialized.has(overlay)) return;
    initialized.add(overlay);
    overlay.setAttribute('aria-hidden', overlay.hasAttribute('open') ? 'false' : 'true');
    new MutationObserver(() => overlay.setAttribute('aria-hidden', overlay.hasAttribute('open') ? 'false' : 'true')).observe(overlay, { attributes: true, attributeFilter: ['open'] });
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay || event.target.closest('[data-lg-close]')) closeOverlay(overlay);
    });
    overlay.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeOverlay(overlay);
      if (event.key !== 'Tab') return;
      const items = [...overlay.querySelectorAll(focusable)].filter((item) => !item.disabled && item.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }

  function initTriggers(scope) {
    scope.querySelectorAll('[data-lg-open]').forEach((trigger) => {
      if (initialized.has(trigger)) return;
      initialized.add(trigger);
      trigger.addEventListener('click', () => openOverlay(document.querySelector(trigger.dataset.lgOpen), trigger));
    });
  }

  function init(scope = document) {
    scope.querySelectorAll('.lg-segmented').forEach(initSegmented);
    scope.querySelectorAll('.lg-drawer,.lg-modal').forEach(initOverlay);
    initTriggers(scope);
  }

  function toast({ title, body = '', tone = 'neutral', duration = 4000 } = {}) {
    let region = document.querySelector('.lg-toast-region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'lg-toast-region lg-root';
      region.setAttribute('aria-live', 'polite');
      document.body.append(region);
    }
    const node = document.createElement('div');
    node.className = 'lg-toast';
    node.dataset.tone = tone;
    const heading = document.createElement('div');
    heading.className = 'lg-toast__title';
    heading.textContent = title || 'Уведомление';
    node.append(heading);
    if (body) { const text = document.createElement('div'); text.className = 'lg-toast__body'; text.textContent = body; node.append(text); }
    region.append(node);
    window.setTimeout(() => node.remove(), duration);
    return node;
  }

  window.LiquidGlass = { init, toast, openDrawer: (selector, trigger) => openOverlay(document.querySelector(selector), trigger), closeDrawer: (selector) => closeOverlay(document.querySelector(selector)) };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init()); else init();
})();
