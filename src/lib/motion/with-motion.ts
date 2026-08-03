import { gsap } from "./gsap";

type MotionContext = { gsap: typeof gsap; reduced: boolean };
type MotionSetup = (ctx: MotionContext) => void;

/**
 * The only sanctioned entry point for animation code. Wraps
 * gsap.matchMedia() so prefers-reduced-motion is centrally enforced —
 * components must never call gsap.to()/timeline() directly.
 *
 * Under reduced motion, `setup` still runs (so elements can be set to
 * their final state instantly) but `reduced` is true.
 */
export function withMotion(setup: MotionSetup): gsap.MatchMedia {
  const mm = gsap.matchMedia();

  mm.add(
    {
      reduced: "(prefers-reduced-motion: reduce)",
      full: "(prefers-reduced-motion: no-preference)",
    },
    (context) => setup({ gsap, reduced: context.conditions?.reduced === true }),
  );

  return mm;
}
