/* ============================================================
   Engaging Markdown Viewer
   ============================================================ */

import * as theme from './modules/theme.js';
import { doc } from './state/document.js';
import * as fileLoader from './modules/fileLoader.js';
import * as toc from './modules/toc.js';
import * as codeBlocks from './modules/codeBlocks.js';
import * as renderer from './modules/renderer.js';

// --- DOM refs ---
const progressBar   = document.querySelector('.progress');
const sidebarResize = document.querySelector('[data-sidebar-resize]');
const html          = document.documentElement;

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
toc.init({ root: html });          // listener
codeBlocks.init({ root: html });   // listener
renderer.init({ root: html });     // publisher — subscribes to doc and fires synchronously on subscribe

doc.restore();
