// Shared junction-mark geometry for CvGrid and CvColumns — every internal
// intersection in the CV's registration grid draws only the line segments
// that actually meet there (a T-junction reads as a T, a real 4-way
// crossing reads as a "+"), matching Frame.astro's corner-bracket language
// instead of stamping a uniform "+" glyph everywhere regardless of topology.
export type Dir = "up" | "down" | "left" | "right";

// A 0-sized seam track already centers its item exactly on the line, so
// "center" needs no correction. A real track boundary ("start"/"end") only
// gets one edge of the mark's own box onto the line — the other half still
// needs pulling back by a negative margin to land the mark's true junction
// point (not its box center) exactly on the line.
const MARK_HALF = "0.75rem";

export function markMargin(justify: string, align: string): string {
  const parts: string[] = [];
  if (align === "start") parts.push(`margin-top: -${MARK_HALF};`);
  if (align === "end") parts.push(`margin-bottom: -${MARK_HALF};`);
  if (justify === "start") parts.push(`margin-left: -${MARK_HALF};`);
  if (justify === "end") parts.push(`margin-right: -${MARK_HALF};`);
  return parts.join(" ");
}

// Draws only the arms that have a real connecting line — collinear arms
// (up+down, left+right) merge into one stroke through the center instead of
// two stubs, so a straight-through point doesn't show a seam. Sized to
// match Frame.astro's own corner-bracket proportions (28-unit box, arms
// nearly full length) rather than a small generic tick.
export function markPath(dirs: Dir[]): string {
  const c = 14;
  const len = 12;
  const has = (d: Dir) => dirs.includes(d);
  const segments: string[] = [];

  if (has("up") && has("down")) segments.push(`M${c} ${c - len} V${c + len}`);
  else if (has("up")) segments.push(`M${c} ${c} V${c - len}`);
  else if (has("down")) segments.push(`M${c} ${c} V${c + len}`);

  if (has("left") && has("right")) segments.push(`M${c - len} ${c} H${c + len}`);
  else if (has("left")) segments.push(`M${c} ${c} H${c - len}`);
  else if (has("right")) segments.push(`M${c} ${c} H${c + len}`);

  return segments.join(" ");
}
