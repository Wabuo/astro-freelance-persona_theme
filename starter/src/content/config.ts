import { defineCollection, z } from 'astro:content';

const sectionsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    order: z.number().default(99),
    type: z.enum(['plain', 'category', 'blog']).optional().default('plain'),
    icon_class: z.string().optional(), 
    subtitle: z.string().optional(),
    subtitles: z.string().optional(),
    background_image: image().optional(), 
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    thumbnail: image().optional(),
    description: z.string().optional(),
  }),
});

export const collections = {
  'sections': sectionsCollection,
  'blog': blogCollection,
};
