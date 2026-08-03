# Sorkhi Portfolio

Personal site for **Saeid Sorkhi** — Researcher & Digital Designer.

**Live:** [sorkhi.com](https://sorkhi.com) · also served at `www.sorkhi.com` and
`sorkhi-portfolio.sorkhi.workers.dev`.

Typographic, monospace, minimal design language — a grid of rules and negative space, with the
print-registration-mark motif from the studio's CV/portfolio identity carried onto the web
(corner brackets, edge ticks, a red accent used sparingly). See [`CLAUDE.md`](./CLAUDE.md) for
the full set of working conventions this repo is built against.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | [Astro 7](https://astro.build) — SSR output, pages prerendered at build time |
| Hosting | Cloudflare Workers (not Pages), via [`@astrojs/cloudflare`](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) |
| Package manager | pnpm |
| Language | TypeScript, `strict: true` |
| Styling | Plain modern CSS + design tokens — no Tailwind |
| Animation | GSAP + Lenis, centralized in `src/lib/motion/` |
| Font | JetBrains Mono Variable, self-hosted (`@fontsource-variable/jetbrains-mono`) |
| Content | Astro Content Collections (MDX) |
| Linting | [Biome](https://biomejs.dev) |

## Getting started

Requires Node.js 22+ and pnpm.

```bash
pnpm install
pnpm dev        # local dev server at http://localhost:4321
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the Astro dev server |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Preview the built Worker locally via `wrangler dev` (run `pnpm build` first) |
| `pnpm check` | Type-check with `astro check` |
| `pnpm lint` / `pnpm lint:fix` | Biome lint/format check (`:fix` writes changes) |
| `pnpm deploy` | Build, then `wrangler deploy` to Cloudflare Workers |

## Project structure

```
src/
  content/
    projects/<slug>/        # case studies — index.mdx + local assets/
  components/
    primitives/              # Button, Rule, Frame, Cursor — small, reused, mostly static
    motion/                  # PortfolioMark, Reveal, ThemeToggle — anything that animates
    layout/                  # Header, Footer, PageShell (document shell)
  styles/
    tokens.css                # single source of truth for color/spacing/type/duration
    base.css                  # reset + element defaults
  lib/
    motion/                   # gsap/Lenis setup + the withMotion() reduced-motion wrapper
  pages/
public/
  fonts/                     # (reserved) subset woff2, if manual subsetting is added later
legacy/                       # the pre-rebuild static HTML/CSS/JS site, kept for reference only
```

Every color, spacing value, type size, and animation duration used anywhere in the codebase is a
CSS custom property defined in `src/styles/tokens.css` — components should never hardcode a hex
value, px size, or duration.

All GSAP/Lenis usage goes through `withMotion()` in `src/lib/motion/`, which centralizes the
`prefers-reduced-motion` check so no component has to handle it individually.

## Content collections

Each case study lives in `src/content/projects/<slug>/index.mdx` with frontmatter validated
against the schema in `src/content.config.ts`:

```yaml
title:
slug:
year:
role:        # e.g. Art Direction, Visual Identity
client:
summary:     # one or two sentences, used in listings and meta description
cover:       # image, resolved through astro:assets
tags: []
featured:    # boolean — controls homepage placement
draft:       # boolean — excluded from production builds
```

## Deployment

The site deploys to Cloudflare Workers, not Cloudflare Pages. `wrangler.jsonc` defines:

- `assets` — serves the static build output (`dist/`) directly from the Worker.
- `workers_dev: true` — keeps the `*.workers.dev` fallback URL active. **Don't remove this** —
  adding a bare `routes` array without it implicitly disables that fallback.
- `routes` — `sorkhi.com` and `www.sorkhi.com`, both `custom_domain: true`, pointing the apex and
  `www` at this Worker with a Cloudflare-managed certificate.

To ship a change:

```bash
pnpm deploy
```

This runs `astro build` then `wrangler deploy`. It requires `wrangler login` to have been run
once on the deploying machine (credentials are cached locally, not stored in this repo).

## Working conventions

See [`CLAUDE.md`](./CLAUDE.md) for the non-negotiable guardrails this project is built to:
design tokens, reduced motion, performance budget (zero-JS hero, lazy-loaded motion), and
accessibility requirements.
