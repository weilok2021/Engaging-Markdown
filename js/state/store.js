/**
 * Tiny reactive store. Subscribers receive the current state synchronously
 * on subscribe, and on every set() call. Returns an unsubscribe function.
 *
 * Contract: subscribers fire SYNCHRONOUSLY on subscribe. Modules whose init()
 * subscribes must already have any event listeners attached for events they
 * dispatch from their subscriber callback — otherwise listeners attached later
 * will miss the first fire. See app.js boot order.
 */
export function createStore(initial) {
  let state = { ...initial };
  const subs = new Set();
  return {
    get: () => state,
    set: (patch) => {
      state = { ...state, ...patch };
      subs.forEach((fn) => fn(state));
    },
    subscribe: (fn) => {
      subs.add(fn);
      fn(state);
      return () => subs.delete(fn);
    },
  };
}
