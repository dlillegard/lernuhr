(() => {
  'use strict';

  const storageKey = 'dlillegard:theme';
  const root = document.documentElement;

  function readStoredTheme() {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored === 'dark' || stored === 'light' ? stored : null;
    } catch {
      return null;
    }
  }

  function applyTheme(theme, save = false) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    const button = document.getElementById('theme-toggle');
    if (button) {
      const dark = theme === 'dark';
      const label = dark ? 'Bruk lyst tema' : 'Bruk mørkt tema';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', label);
      button.title = label;
    }
    if (save) {
      try { localStorage.setItem(storageKey, theme); } catch { /* Temaet virker uten lagring. */ }
    }
  }

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  applyTheme(readStoredTheme() || (prefersDark ? 'dark' : 'light'));

  function connectToggle() {
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    applyTheme(root.dataset.theme);
    button.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
    window.addEventListener('storage', event => {
      if (event.key === storageKey && (event.newValue === 'dark' || event.newValue === 'light')) applyTheme(event.newValue);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', connectToggle, { once: true });
  else connectToggle();
})();
