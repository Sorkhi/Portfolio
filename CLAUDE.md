# Sorkhi Portfolio

Personal portfolio for Saeid Sorkhi — Visual Designer / Researcher.
Design language: typographic, monospace, minimal. Grid, rules, negative space.
Motion and interaction are the "show off" layer — but never at the cost of the first paint.

---

## Stack (decided — do not change without discussion)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Astro 7 | Node 22+ required. Zero JS by default; islands for interactivity. |
| Package manager | pnpm | Never npm/yarn. Lockfile is committed. |
| Language | TypeScript, `strict: true` | |
| Hosting | Cloudflare Workers + static assets | NOT Pages. Deploy via `wrangler deploy`. |
| Adapter | `@astrojs/cloudflare` | Present from day one so adding server routes later needs no re-platform. |
| Styling | Plain modern CSS + design tokens | No Tailwind. Nesting, `@layer`, container queries, `@property`. |
| Animation | GSAP (free, all plugins) + Lenis | ScrollTrigger, SplitText, Flip, Observer. |
| Font | JetBrains Mono Variable, self-hosted | `@fontsource-variable/jetbrains-mono`. No Google Fonts CDN. |
| Content | Astro Content Collections (MDX) | |
| Linting | Biome | Replaces ESLint + Prettier. |
| Analytics | Cloudflare Web Analytics | Cookieless — no consent banner needed. |
| Large media | Cloudflare R2 | Video and heavy assets never live in the repo. |

---

## Commands

```
pnpm install
pnpm dev          # local dev server
pnpm build        # production build
pnpm preview      # preview the built Worker locally (wrangler dev)
pnpm check        # astro check — type errors
pnpm lint         # biome check
pnpm deploy       # wrangler deploy
```

---

## Directory structure

```
src/
  content/
    projects/<slug>/
      index.mdx          # frontmatter + case study body
      assets/            # images local to this project
  components/
    primitives/          # Button, Rule, Frame, Cursor, DiamondList, SectionHeading,
                          # RadarChart, AreaChart, SocialIcons — small, reused, mostly static
    motion/               # PortfolioMark, Reveal, ThemeToggle — anything that animates
    layout/               # Header, Footer, PageShell, CvGrid, CvColumns, cv-marks.ts
  styles/
    tokens.css           # SINGLE SOURCE OF TRUTH for design values
    base.css             # reset + element defaults
  lib/
    motion/              # gsap/Lenis setup, reduced-motion guard, onIdle/onPageReady
    cv-data.ts            # one-off page data (not a content collection — see below)
  pages/
    index.astro           # homepage
    cv.astro               # in-site Curriculum Vitae (built; see "registration-grid" below)
public/
  fonts/                 # woff2 only, subset
```

Rules:
- A component that animates lives in `components/motion/`, never inline in a page.
- Anything imported by more than two components moves to `primitives/`.
- Project media that is small and page-specific lives beside its MDX. Large video goes to R2.
- A page with fixed, one-off content (the CV) gets a plain `src/lib/<page>-data.ts` module, not a
  content collection — collections are for *repeatable* content types (projects). Don't reach for
  `content.config.ts` for a page that only ever has one instance of itself.

---

## Non-negotiable guardrails

### 1. Design tokens
Every color, spacing value, type size, and duration is a CSS custom property defined in
`src/styles/tokens.css`. **No hardcoded hex values, px sizes, or durations anywhere else.**
Color tokens must be registered with `@property` so they can be transitioned.

If a value is needed that does not exist as a token, add the token — do not inline it.

### 2. Reduced motion
All animation goes through the wrapper in `src/lib/motion/`. That wrapper checks
`prefers-reduced-motion` and `gsap.matchMedia()` centrally. Never call `gsap.to()` directly
from a component without going through it.

Reduced motion means: no scroll-jacking, no parallax, no scrub. Content still reaches its
final state — it just arrives instantly.

### 3. Performance budget
- LCP element must render with **zero JavaScript**. Hero text is server-rendered, always.
- GSAP, Lenis, and any video are lazy-initialised after the first fold.
- Fonts: woff2 only, subset, `font-display: swap`, `preload` on the display weight only.
- Images through `astro:assets` (AVIF + WebP). No raw `<img src>` for local assets.

### 4. Accessibility
- Theme switching respects `prefers-color-scheme` as the default; user choice persists in `localStorage`.
- Every interactive element is keyboard reachable and has a visible focus style.
- SplitText output must not break screen readers — use its built-in `aria` handling.
- Contrast is checked against WCAG AA for every theme variant, not just the default.

### 5. View Transitions (`ClientRouter`) — every client script must survive an SPA swap
`PageShell` renders `<ClientRouter />`, so **every internal navigation is a client-side swap, not
a full page load.** A `<script>` that wires up listeners with a plain top-level call (`onIdle(() =>
{...})`, or worse, no idle-guard at all) only ever runs once, the moment the browser first parses
that module — it does **not** re-run when the reader leaves the page and comes back via an in-app
link, because ClientRouter reuses already-loaded scripts instead of re-executing them.

**The fix, always:** wrap setup in `onPageReady` from `src/lib/motion/on-page-ready.ts` instead of
calling `onIdle` (or anything else) directly:

```ts
import { onPageReady } from "@/lib/motion/on-page-ready";

onPageReady(async () => {
  // query the DOM, attach listeners, create ScrollTriggers — this whole
  // block re-runs after every navigation, including the first
});
```

Two traps already hit and fixed once — don't reintroduce them:
- **Never** *also* call the setup function directly in addition to using `onPageReady`.
  `astro:page-load` (which `onPageReady` listens for) already fires on the *initial* page load,
  not just subsequent ones — pairing a direct call with the listener double-fires everything on
  first load, races `ScrollTrigger` creation, and silently produces duplicate triggers (confirmed:
  4 triggers became 8 after one navigation).
- **Listeners attached to `window`/`document`** (as opposed to a page-specific element) survive
  navigations even though the elements they reference don't — each `onPageReady` re-run must tear
  down its *own* previous listeners (an `AbortController` stored in module scope, `controller?.abort()`
  before creating a new one — see `Cursor.astro`) or they pile up across repeat visits. Listeners
  on page-specific elements don't need this — the swap already discards the old element.
- Anything driven by `ScrollTrigger` should call `ScrollTrigger.refresh()` after (re)creating
  triggers inside the same `onPageReady` run, and `.kill()` any triggers from the previous run
  first (track them in a module-scope array) — otherwise a second visit can measure stale
  geometry against elements that no longer exist.

---

## Theming

Themes are driven by a `data-theme` attribute on `<html>`. Token values are redefined per
theme in `tokens.css`. Transitions between themes use the View Transitions API with a
cross-fade; custom property colors animate because they are `@property`-registered.

Adding a theme = adding one block of token overrides. It must never require touching a component.

A page can also **lock** its theme regardless of stored preference or OS setting, via
`<PageShell theme="light">` (or `"dark"`) — for content that's only ever designed in one theme
(the homepage hero, the CV). This server-renders `data-theme` directly on `<html>` and guards the
inline bootstrap script from overwriting it. **Always use this** instead of only setting
`data-theme` on a page's own wrapper div when a page is theme-locked — without it, `<body>` keeps
following the OS/stored preference while the page's own content sits on top locked to the other
theme, and elastic/rubber-band overscroll on some browsers flashes the mismatched background past
the page's edges (this shipped once as a real bug on the CV page before being caught).

---

## The registration-grid system (CV page; reusable for any framed multi-column layout)

The CV page (`src/pages/cv.astro`, `src/components/layout/CvGrid.astro` +
`CvColumns.astro`) established a general pattern for laying out a page as boxes divided by
faint registration lines, with the *site's own* corner-bracket language (`Frame.astro`) reused
for the marks at every line intersection — not a separate decorative system bolted on top. Reach
for this same pattern (rather than reinventing it) for any future page that wants "print
crop-mark" framed content — the planned **Projects detail page** (see Deferred ideas) is the
next one that will need it.

**How it fits together:**
- `Frame.astro` takes two props for this use: `fixed={false}` makes it position itself against
  its nearest positioned ancestor's *actual content height* instead of the viewport — for a page
  taller than one screen (the CV), this is what makes the bottom corner marks sit at the page's
  true end, only reached once you've scrolled there, instead of hovering mid-content. `edgeTicks={false}`
  drops Frame's own mid-edge tick marks, for pages whose *own* internal grid already has marks
  along that same edge (so the two don't collide/duplicate).
- A content grid's own outer edges are set to land exactly on `var(--frame-margin)` (the same
  distance from the viewport edge Frame's corners use) — the site frame *is* the content grid's
  frame, not a second one drawn underneath it. Don't add a page's own corner marks; let Frame's
  real corners show through (give the content grid a higher `z-index` than `Frame`'s default if
  it would otherwise paint over the corners — see `.frame--absolute { z-index: 2; }` vs.
  `.cv__content { z-index: 1; }`).
- Internal dividers are plain `<div>`s positioned via CSS Grid with **zero-sized "seam" tracks**
  at every distinct boundary (column seams so a row can span whichever real columns it needs, row
  seams so marks/dividers land exactly between `auto`-height rows without knowing their rendered
  height ahead of time) — see the column/row line comments at the top of `CvGrid.astro` for the
  worked-out coordinate system. This is *not* a uniform N-column grid: measure the actual proportions
  wanted (from a reference design, print layout, etc.) and let each row use its own breakpoints —
  forcing every row onto the same shared column grid was tried and explicitly rejected by the user.
- **Junction marks are topology-driven, never a uniform "+".** `src/components/layout/cv-marks.ts`
  exports `markPath(dirs)` / `markMargin(justify, align)`: given which of `up`/`down`/`left`/`right`
  actually have a real connecting line at that point, it draws only those arms — a 2-line corner
  reads as an L (matching `Frame.astro`'s own corner-bracket path), a 3-line junction reads as a T,
  and a true 4-way crossing reads as a "+" *because it actually is one*. Work out the direction set
  for each intersection from the actual divider spans, the same way `CvGrid.astro`'s `junctions`
  array does — don't default every intersection to the same mark regardless of what really meets there.
- Multiple framed sections that sit directly adjacent (no gap) — like `CvGrid` feeding into
  `CvColumns` below it — read as one continuous frame as long as a shared vertical divider's x
  position matches across both and there's zero margin between them. Compute the second section's
  column breakpoints to *literally continue* the first section's still-open verticals, rather than
  using unrelated proportions (even column-thirds) that happen to sit nearby — see `CvColumns.astro`'s
  header comment for why its columns are 35.21% / 32.16% / 32.63%, not an even split.
- Every script this system needs (draw-in animation, etc.) **must** go through `onPageReady` (see
  guardrail 5 above) — the CV page's reveal animation shipped broken on second navigation before
  that was in place.

---

## Content model

Each project in `src/content/projects/` has this frontmatter. Treat the schema as expensive to
change — adding fields is cheap, renaming or removing them is not.

```yaml
title:
slug:
year:
role:          # e.g. Art Direction, Visual Identity
client:
summary:       # one or two sentences, used in listings and meta description
cover:         # image reference
tags: []
featured:      # boolean — controls homepage placement
draft:         # boolean — excluded from production builds
```

Schema is defined and validated in `src/content.config.ts`. Never read frontmatter without
going through the collection API.

---

## Bilingual note

JetBrains Mono has no Persian glyphs. If Farsi content is ever added, pair it with Vazirmatn
or Estedad and match x-height and line-height in `tokens.css`. Plan the `lang` / `dir`
attribute handling before writing the content, not after.

---

## Working rules for Claude

- Read `src/styles/tokens.css` before writing any CSS.
- Read `src/lib/motion/` before writing any animation.
- Prefer extending an existing component over creating a new one.
- Do not add a dependency without saying why a platform feature is insufficient.
- After any change touching layout or motion, run `pnpm build` and report the output size delta.
- Small, reviewable commits. Conventional Commits format.
- Never commit secrets. Cloudflare tokens go in `.dev.vars` (gitignored) and Worker secrets.

---

## Next up: Projects detail page (spec agreed, not built yet)

The user wants this prepped for a future session, following the CV page's established
conventions — **do not scaffold or build the actual page until asked.** This section is the
brief for when that session starts.

**Layout:** a single viewport-height page (`Frame` in its **default `fixed={true}` mode** — this
is not a tall scrolling page like the CV, so the site frame stays pinned to the viewport, same as
the homepage), split into two columns inside that frame:

- **Left column — fixed, narrower width, does not scroll.** Contains, top to bottom: project
  title, description (the case-study body/summary), tools used, client name, design year. Reuse
  `SectionHeading` for the sub-labels and `DiamondList` for enumerable bits (tools), matching the
  CV page's own chip/diamond-bullet treatment — don't invent a new heading style for this page.
- **Right column — scrollable, contained within the frame.** Project images stacked vertically,
  scrolling *inside* that column (`overflow-y: auto` on the column itself) while the left column
  and the outer frame stay fixed in place. This is the opposite of the CV page's own scroll model
  (there, the *whole page* scrolls and Frame follows via `fixed={false}`) — here Frame stays truly
  fixed and only the gallery column scrolls internally.
- Use the **registration-grid system** documented above for the frame/divider/junction-mark
  treatment between the two columns — a vertical divider at the column boundary, with junction
  marks (via `cv-marks.ts`) wherever it meets the top/bottom of the frame. This is a much simpler
  case than the CV grid (two columns, no internal row-splits), so it likely doesn't need its own
  `CvGrid`-style component — work out whether a small dedicated layout component or inline markup
  in the page itself is more appropriate once actually building it.

**Content model gap to close first:** the current `projects` collection schema
(`src/content.config.ts`) has `title`/`slug`/`year`/`role`/`client`/`summary`/`cover`/`tags` but
no explicit "tools used" field — add one (`tools: z.array(z.string()).default([])`, matching the
CV data's own `tools` list shape) rather than overloading `tags` for it. The right-column image
gallery will also need either a `gallery: z.array(image())` frontmatter field or to be sourced
from images referenced in the MDX body — decide which before building.

**Don't forget:** any interactive script this page needs goes through `onPageReady`, not raw
`onIdle` (guardrail 5) — this is now a site-wide requirement, not just a CV-page one.

---

## Deferred ideas (not yet built — do not scaffold for these prematurely)

- **Scroll-scrubbed video.** When built: short clips (3–6s), all-keyframe encode
  (`ffmpeg -g 1`), served from R2, with a canvas frame-sequence fallback. Naive
  `video.currentTime` scrubbing is janky on Safari and mobile — do not ship it.
- Click-to-recolor headline interactions.
- WebGL / shader background. If this happens, **do not** use `transition:persist` on the canvas
  element to survive navigation — tried exactly that for `Frame.astro` and it threw a native
  `InvalidStateError` ("Transition was aborted") on every ClientRouter navigation once the two
  pages sharing that persisted element had different enough layouts/positioning. A plain crossfade
  (ClientRouter's default) was the safe fix. If a persisted canvas is ever needed, budget time to
  verify it doesn't hit the same issue rather than assuming `transition:persist` is safe by default.
