/**
 * requestIdleCallback with no `timeout` option can simply never fire if the
 * browser never finds a genuine idle period (observed in at least one
 * automated/headless context) — always pass a timeout so it's guaranteed to
 * run within a bounded window either way.
 */
export function onIdle(callback: () => void): void {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: 1500 });
  } else {
    setTimeout(callback, 200);
  }
}
