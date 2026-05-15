const MIN_WIDTH = 220;
const MAX_WIDTH = 420;

export function init({ root }) {
  const sidebar = root.querySelector('.sidebar');
  const handle  = root.querySelector('[data-sidebar-resize]');

  let resizing = false;

  handle.addEventListener('mousedown', (e) => {
    if (window.innerWidth <= 900) return; // no resize on mobile
    resizing = true;
    handle.classList.add('active');
    window.document.body.style.cursor = 'col-resize';
    window.document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  window.document.addEventListener('mousemove', (e) => {
    if (!resizing) return;
    const width = Math.min(Math.max(e.clientX, MIN_WIDTH), MAX_WIDTH);
    sidebar.style.width = `${width}px`;
  });

  window.document.addEventListener('mouseup', () => {
    if (!resizing) return;
    resizing = false;
    handle.classList.remove('active');
    window.document.body.style.cursor = '';
    window.document.body.style.userSelect = '';
  });
}
