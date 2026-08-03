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
    primitives/          # Button, Marquee, Cursor, Rule
    motion/              # ScrollVideo, SplitHeading, ThemeToggle, Reveal
    layout/              # Header, Footer, Grid, Page shells
  styles/
    tokens.css           # SINGLE SOURCE OF TRUTH for design values
    base.css             # reset + element defaults
  lib/
    motion/              # gsap setup, lenis, reduced-motion guard
    utils/
  pages/
public/
  fonts/                 # woff2 only, subset
```

Rules:
- A component that animates lives in `components/motion/`, never inline in a page.
- Anything imported by more than two components moves to `primitives/`.
- Project media that is small and page-specific lives beside its MDX. Large video goes to R2.

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

---

## Theming

Themes are driven by a `data-theme` attribute on `<html>`. Token values are redefined per
theme in `tokens.css`. Transitions between themes use the View Transitions API with a
cross-fade; custom property colors animate because they are `@property`-registered.

Adding a theme = adding one block of token overrides. It must never require touching a component.

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

## Deferred ideas (not yet built — do not scaffold for these prematurely)

- **Scroll-scrubbed video.** When built: short clips (3–6s), all-keyframe encode
  (`ffmpeg -g 1`), served from R2, with a canvas frame-sequence fallback. Naive
  `video.currentTime` scrubbing is janky on Safari and mobile — do not ship it.
- Click-to-recolor headline interactions.
- WebGL / shader background. If this happens, use `ClientRouter` + `transition:persist`
  so the canvas survives navigation.
