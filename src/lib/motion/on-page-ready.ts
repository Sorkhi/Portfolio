import { onIdle } from "./on-idle";

/**
 * Runs `callback` on every ClientRouter (view transitions) navigation swap
 * — including the very first page load, not just ones after it. A plain
 * onIdle() call only ever fires once, the moment its module first loads —
 * fine for a page that's never navigated away from, but ClientRouter reuses
 * already-loaded scripts instead of re-running them on subsequent
 * navigations, so any DOM queries/listeners set up that way silently stop
 * working the first time a reader leaves the page and comes back via an
 * in-app link.
 *
 * `astro:page-load` already fires for the initial load *and* every swap
 * after it — do not also call the callback directly. Astro's own docs undersell
 * this: pairing a direct call with the listener double-fires everything on
 * first load (confirmed empirically — two "onIdle ran" logs and two full
 * ScrollTrigger sets from one page open), the exact bug this helper exists
 * to prevent, just moved earlier.
 */
export function onPageReady(callback: () => void): void {
  document.addEventListener("astro:page-load", () => onIdle(callback));
}
