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
import * as progress from './modules/progress.js';

// --- DOM refs ---
const html = document.documentElement;

// ============================================================
// Boot
// ============================================================

theme.init({ root: html });
fileLoader.init({ root: html });
toc.init({ root: html });          // listener
codeBlocks.init({ root: html });   // listener
renderer.init({ root: html });     // publisher — subscribes to doc and fires synchronously on subscribe
sidebar.init({ root: html });
progress.init({ root: html });

doc.restore();
