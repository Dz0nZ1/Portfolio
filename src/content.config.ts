import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    github: z.string().url().optional(),
    live: z.string().url().optional(),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    lang: z.enum(['en', 'sr']),
    key: z.string(),
  }),
});

export const collections = { projects };
