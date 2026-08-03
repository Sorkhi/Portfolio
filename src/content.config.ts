import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/index.mdx", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      year: z.number(),
      role: z.string(),
      client: z.string(),
      summary: z.string(),
      cover: image(),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
