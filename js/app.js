/* ============================================================
   Engaging Markdown Viewer
   ============================================================ */

import * as theme from './modules/theme.js';
import { doc } from './state/document.js';
import * as fileLoader from './modules/fileLoader.js';
import * as toc from './modules/toc.js';
import * as codeBlocks from './modules/codeBlocks.js';
import * as renderer from './modules/renderer.js';
import * as sidebar from './modules/sidebar.js';

// --- DOM refs ---
const progressBar = document.querySelector('.progress');
const html        = document.documentElement;

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
sidebar.init({ root: html });

doc.restore();
