import { storage } from '../services/storage.js';

const HLJS_LIGHT = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github.min.css';
const HLJS_DARK  = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github-dark.min.css';

export function init({ root }) {
  const hljsLink = window.document.getElementById('hljs-theme');
  const toggle   = root.querySelector('[data-theme-toggle]');
  const label    = toggle.querySelector('.label');

  const apply = (theme) => {
    root.dataset.theme = theme;
    hljsLink.href = theme === 'dark' ? HLJS_DARK : HLJS_LIGHT;
    label.textContent = theme === 'dark' ? 'Dark' : 'Light';
    storage.local.set('em.theme', theme);
  };

  // Initial theme: persisted → system pref → light fallback
  const saved = storage.local.get('em.theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  apply(saved ?? (prefersDark ? 'dark' : 'light'));

  toggle.addEventListener('click', () => {
    apply(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
}
