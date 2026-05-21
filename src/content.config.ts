// src/content.config.ts  ← Astro 5 nueva ubicación del config de colecciones
import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    date:        z.coerce.date(),
    image:       z.string().default('/images/blog/como-destapar-canerias-en-casa.jpg'),
    imageAlt:    z.string().default('Plomeros SAOR'),
    keywords:    z.array(z.string()).default([]),
    author:      z.string().default('Plomeros SAOR'),
    draft:       z.boolean().default(false),
    tags:        z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
