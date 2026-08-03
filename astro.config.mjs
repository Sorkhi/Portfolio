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
});
