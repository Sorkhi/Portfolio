import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://sorkhi.com",
  output: "server",
  adapter: cloudflare({
    imageService: "compile",
  }),
  integrations: [mdx()],
  // ClientRouter's default hover-prefetch races its own in-flight fetch
  // against a real click's startViewTransition() and throws an uncaught
  // InvalidStateError ("Transition was aborted") — harmless (navigation
  // still completes) but noisy. This is a two-page site; prefetching saves
  // nothing worth that tradeoff.
  prefetch: false,
});
