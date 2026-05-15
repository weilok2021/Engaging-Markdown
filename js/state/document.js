import { createStore } from './store.js';
import { storage } from '../services/storage.js';

/**
 * Document model — single source of truth for "what is the user reading."
 * Exported as `doc` (NOT `document`) to avoid shadowing window.document
 * in importing modules.
 */
const inner = createStore({
  content: '',
  filename: '',
  lastOpened: null,
  dirty: false,
});

export const doc = {
  subscribe: inner.subscribe,
  get: inner.get,

  load(content, filename) {
    const lastOpened = new Date().toISOString();
    inner.set({ content, filename, lastOpened, dirty: false });
    storage.session.set('em.doc', { content, filename, lastOpened });
  },

  restore() {
    const saved = storage.session.get('em.doc');
    if (saved) inner.set(saved);
  },

  clear() {
    inner.set({ content: '', filename: '', lastOpened: null, dirty: false });
    storage.session.remove('em.doc');
  },

  // ── Future, additive ─────────────────────────────────
  // save()                → services/api.js
  // applyRemoteUpdate(op) → services/sync.js
};
