import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('随笔'),
    description: z.string(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};





