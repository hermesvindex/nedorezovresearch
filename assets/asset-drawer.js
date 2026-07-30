(() => {
  const closeSelector = '.asset-unified-close';
  const rootSelector = '.drawer, .sidepanel';
  const openerSelector = '[data-secid], .tile, .open-detail, [data-ticker]';
  let returnFocus = null;

  const rootFor = button => button?.closest(rootSelector);
  const isOpen = root => root?.classList.contains('open');

  function setDialogState(button, open) {
    const root = rootFor(button);
    if (!root) return;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Карточка актива');
    root.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  function initialize(button) {
    button.type = 'button';
    button.setAttribute('aria-label', 'Закрыть карточку актива');
    if (!button.querySelector('.asset-unified-close__icon')) {
      button.replaceChildren(Object.assign(document.createElement('span'), {
        className: 'asset-unified-close__icon',
      }));
      button.firstElementChild.setAttribute('aria-hidden', 'true');
    }

    const root = rootFor(button);
    if (!root) return;
    setDialogState(button, isOpen(root));
    const dialogObserver = new MutationObserver(() => {
      const open = isOpen(root);
      setDialogState(button, open);
      if (open) {
        requestAnimationFrame(() => button.focus({ preventScroll: true }));
      } else if (returnFocus?.isConnected) {
        const focusTarget = returnFocus;
        returnFocus = null;
        requestAnimationFrame(() => focusTarget.focus({ preventScroll: true }));
      }
    });
    if (root.nodeType === Node.ELEMENT_NODE) {
      dialogObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
    }
  }

  document.addEventListener('pointerdown', event => {
    const opener = event.target.closest?.(openerSelector);
    if (opener && !opener.closest(rootSelector)) returnFocus = opener;
  }, true);

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const button = [...document.querySelectorAll(closeSelector)]
      .find(candidate => isOpen(rootFor(candidate)));
    if (button) {
      event.preventDefault();
      button.click();
    }
  });

  const boot = () => document.querySelectorAll(closeSelector).forEach(initialize);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
