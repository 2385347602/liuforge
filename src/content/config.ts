import { defineCollection, z } from 'astro:content';

// 博客文章集合
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    description: z.string(),
    cover: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
