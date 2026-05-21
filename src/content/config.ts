// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    date:        z.coerce.date(),
    image:       z.string().default('/images/blog/default.jpg'),
    imageAlt:    z.string().default('Plomeros SAOR'),
    keywords:    z.array(z.string()).default([]),
    author:      z.string().default('Plomeros SAOR'),
    draft:       z.boolean().default(false),
    tags:        z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
