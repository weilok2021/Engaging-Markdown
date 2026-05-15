/* ============================================================
   Engaging Markdown Viewer
   ============================================================ */

import * as theme from './modules/theme.js';
import { doc } from './state/document.js';
import * as fileLoader from './modules/fileLoader.js';
import * as toc from './modules/toc.js';
import * as codeBlocks from './modules/codeBlocks.js';

// --- DOM refs ---
const article       = document.querySelector('.article');
const progressBar   = document.querySelector('.progress');
const sidebarResize = document.querySelector('[data-sidebar-resize]');
const fileNameEl    = document.querySelector('[data-file-name]');
const html          = document.documentElement;

// ============================================================
// Load & Render
// ============================================================

function renderMarkdown(mdText, fileName) {
  // Configure marked
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Render
  article.innerHTML = marked.parse(mdText);
  article.dataset.state = 'loaded';

  // Update file name
  fileNameEl.textContent = fileName || 'Untitled';

  // Scroll to top
  window.scrollTo({ top: 0 });

  // Notify listeners (toc.js + codeBlocks.js)
  article.dispatchEvent(new CustomEvent('rendered', { bubbles: true, detail: { content: mdText, filename: fileName } }));
}

// ============================================================
// Sidebar Drag-to-Resize
// ============================================================

const sidebar = document.querySelector('.sidebar');
let isResizing = false;

sidebarResize.addEventListener('mousedown', (e) => {
  if (window.innerWidth <= 900) return; // disable on mobile
  isResizing = true;
  sidebarResize.classList.add('active');
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isResizing) return;
  const newWidth = Math.min(Math.max(e.clientX, 220), 420);
  sidebar.style.width = newWidth + 'px';
});

document.addEventListener('mouseup', () => {
  if (!isResizing) return;
  isResizing = false;
  sidebarResize.classList.remove('active');
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
});

// ============================================================
// Reading Progress Bar
// ============================================================

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
});

// ============================================================
// Boot
// ============================================================

theme.init({ root: html });
fileLoader.init({ root: html });
toc.init({ root: html });        // listeners attach first
codeBlocks.init({ root: html }); // listeners attach first

// Bridge — fires renderMarkdown which dispatches 'rendered' event
doc.subscribe(({ content, filename }) => {
  if (content) renderMarkdown(content, filename);
});

doc.restore();
