// src/freelance-persona/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 1. SECTIONS COLLECTION
const sections = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/sections" }),
  
  schema: z.discriminatedUnion('type', [
    
    // A. HERO SECTION
    z.object({
      type: z.literal('hero'),
      title: z.string(),
      greeting: z.string().optional(), 
      hero_typing_text: z.string().optional(), 
      order: z.number().default(0),
      background_image: z.string().optional(), 

      // Typing Config (Optional)
      typing_speed: z.number().optional(),
      deleting_speed: z.number().optional(),
      pause_duration: z.number().optional(),

      // Layout Config (Coarse)
      position_x: z.enum(['left', 'center', 'right']).optional(),
      position_y: z.enum(['top', 'middle', 'bottom']).optional(),
      size: z.enum(['small', 'medium', 'large', 'full']).optional(),

      // Fine Tuning (Nudging, Scaling, Font Overrides)
      nudge_x: z.string().optional(), 
      nudge_y: z.string().optional(),
      content_scale: z.number().optional(),
      base_font_size: z.string().optional(),
      title_font_size: z.string().optional(),
    }),

    // B. RECENT POSTS
    z.object({
      type: z.literal('recent_posts'),
      title: z.string(),
      subtitle: z.string().optional(),
      tags_to_filter_posts_by: z.string().optional(),
      order: z.number().default(100),
      icon_class: z.string(),
    }),

    // C. PLAIN & CONTACT
    z.object({
      type: z.enum(['plain', 'contact']), 
      title: z.string(),
      subtitle: z.string().optional(),
      order: z.number().default(100),
      icon_class: z.string(),
    }),
  ]),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    thumbnail: z.string().optional(),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  sections,
  blog,
};