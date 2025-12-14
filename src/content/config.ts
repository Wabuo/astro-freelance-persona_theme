import { defineCollection, z } from 'astro:content';

const sectionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number().default(99),
    // specific fields
    type: z.enum(['plain', 'category', 'blog']).optional().default('plain'),
    icon_class: z.string().optional(), 
    subtitle: z.string().optional(), // For section subtitles
    subtitles: z.string().optional(), // For Hero typed.js
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
    description: z.string().optional(), // Used for excerpt
  }),
});

export const collections = {
  'sections': sectionsCollection,
  'blog': blogCollection,
};