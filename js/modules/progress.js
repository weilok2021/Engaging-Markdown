export function init({ root }) {
  const progress = root.querySelector('.progress');
  if (!progress) return;

  const update = () => {
    const html = window.document.documentElement;
    const max = html.scrollHeight - html.clientHeight;
    const p = max > 0 ? html.scrollTop / max : 0;
    progress.style.setProperty('--p', p);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}
