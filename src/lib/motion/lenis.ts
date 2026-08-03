import Lenis from "lenis";
import { ScrollTrigger, gsap } from "./gsap";
import { prefersReducedMotion } from "./reduced-motion";

let lenis: Lenis | null = null;

/**
 * Smooth scroll is skipped entirely under reduced motion — native scroll
 * stays instant rather than being eased. Standard Lenis + ScrollTrigger
 * wiring otherwise: Lenis drives the GSAP ticker and notifies
 * ScrollTrigger on every scroll frame.
 */
export function initLenis(): Lenis | null {
  if (typeof window === "undefined" || prefersReducedMotion()) return null;
  if (lenis) return lenis;

  lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}
