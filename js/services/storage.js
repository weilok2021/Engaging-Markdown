/**
 * Storage service — wraps localStorage and sessionStorage with JSON
 * (de)serialization and quota-error swallowing.
 *
 * Keyspace: `em.*` (e.g., em.theme, em.doc). Pre-refactor keys
 * (md-viewer-theme, md-viewer-content, md-viewer-filename) are orphaned
 * deliberately — see spec for the accept-and-document decision.
 */
const wrap = (store) => ({
  get(key) {
    try {
      return JSON.parse(store.getItem(key));
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      store.setItem(key, JSON.stringify(value));
    } catch {
      // quota errors swallowed silently — persistence is best-effort
    }
  },
  remove(key) {
    store.removeItem(key);
  },
});

export const storage = {
  local: wrap(localStorage),
  session: wrap(sessionStorage),
};
