import { doc } from './state/document.js';
import * as theme       from './modules/theme.js';
import * as fileLoader  from './modules/fileLoader.js';
import * as toc         from './modules/toc.js';
import * as codeBlocks  from './modules/codeBlocks.js';
import * as renderer    from './modules/renderer.js';
import * as sidebar     from './modules/sidebar.js';
import * as progress    from './modules/progress.js';

const root = window.document.documentElement;

// Boot order: listeners attach BEFORE the renderer (publisher) subscribes.
// createStore.subscribe fires synchronously on subscribe, so the renderer's
// first dispatch of 'rendered' needs toc + codeBlocks already listening.
theme.init({ root });
fileLoader.init({ root });
toc.init({ root });
codeBlocks.init({ root });
renderer.init({ root });
sidebar.init({ root });
progress.init({ root });

doc.restore();
