// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 1. SECTIONS COLLECTION (The Homepage Building Blocks)
const sections = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/sections" }),
  
  // Strict Discriminated Union
  schema: z.discriminatedUnion('type', [
    
    // A. HERO SECTION
    z.object({
      type: z.literal('hero'),
      title: z.string(),
      greeting: z.string(), 
      hero_typing_text: z.string(), 
      order: z.number().default(0),
      // Background image is optional for Hero
      background_image: z.string().optional(), 
    }),

    // B. RECENT POSTS SECTION (Formerly "category")
    z.object({
      type: z.literal('recent_posts'),
      title: z.string(),
      subtitle: z.string().optional(),
      blog_tag_filter: z.string(), // REQUIRED: Which tag to show?
      order: z.number().default(100),
    }),

    // C. PLAIN & CONTACT SECTIONS
    z.object({
      // These types share the same simple structure
      type: z.enum(['plain', 'contact']), 
      title: z.string(),
      subtitle: z.string().optional(),
      order: z.number().default(100),
      icon_class: z.string().optional(),
    }),
  ]),
});

// 2. BLOG COLLECTION (The Articles)
// This is separate because it doesn't "mix" with sections on the homepage directly.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    thumbnail: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  sections,
  blog,
};