import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 1. SECTIONS COLLECTION
const sections = defineCollection({
  // The 'base' is relative to the User's Project Root (e.g., starter/)
  loader: glob({ pattern: "**/*.md", base: "./src/content/sections" }),
  
  // Strict Discriminated Union
  schema: z.discriminatedUnion('type', [
    
    // A. HERO SECTION
    z.object({
      type: z.literal('hero'),
      title: z.string(),
      greeting: z.string().optional(), 
      hero_typing_text: z.string().optional(), 
      order: z.number().default(0),
      background_image: z.string().optional(), 
    }),

    // B. RECENT POSTS SECTION
    z.object({
      type: z.literal('recent_posts'),
      title: z.string(),
      subtitle: z.string().optional(),
      tags_to_filter_posts_by: z.string().optional(),
      order: z.number().default(100),
      // Icon class is optional in your previous files, but required here? 
      // Making it optional is safer to prevent crashes.
      icon_class: z.string().optional(), 
    }),

    // C. PLAIN & CONTACT SECTIONS
    z.object({
      type: z.enum(['plain', 'contact']), 
      title: z.string(),
      subtitle: z.string().optional(),
      order: z.number().default(100),
      icon_class: z.string().optional(),
    }),
  ]),
});

// 2. BLOG COLLECTION
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
  }),
});

export const collections = {
  sections,
  blog,
};