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

      // Typing Config
      typing_speed: z.number().optional(),
      deleting_speed: z.number().optional(),
      pause_duration: z.number().optional(),

      // Layout Config
      position_x: z.enum(['left', 'center', 'right']).optional(),
      position_y: z.enum(['top', 'middle', 'bottom']).optional(),
      size: z.enum(['small', 'medium', 'large', 'full']).optional(),

      // Fine Tuning
      nudge_x: z.string().optional(),
      nudge_y: z.string().optional(),
      content_scale: z.number().optional(),

      // Typography & Gaps
      title_font_size: z.string().optional(),
      title_font_family: z.string().optional(),
      typing_font_size: z.string().optional(),
      typing_font_family: z.string().optional(),

      gap_title_to_typing: z.string().optional(),
      gap_typing_to_socials: z.string().optional(),
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

    // C. PLAIN SECTION
    z.object({
      type: z.literal('plain'),
      title: z.string(),
      subtitle: z.string().optional(),
      order: z.number().default(100),
      icon_class: z.string(),

      // Visual Overrides
      nudge_x: z.string().optional(),
      nudge_y: z.string().optional(),
      content_scale: z.number().optional(),
      delay: z.number().optional(),
    }),

    // D. CONTACT SECTION (New Schema)
    z.object({
      type: z.literal('contact'),
      title: z.string(),
      subtitle: z.string().optional(),
      order: z.number().default(100),
      icon_class: z.string().default('bi bi-envelope'),

      // Contact Items
      contact_items: z.array(z.object({
        label: z.string(),
        value: z.string(), // Can be 'theme_email', 'theme_phone', 'theme_address' or raw string
        icon: z.string(),
        type: z.enum(['email', 'phone', 'address', 'text']).optional(), // Helper for formatting
      })).default([]),

      // Visual Overrides
      nudge_x: z.string().optional(),
      nudge_y: z.string().optional(),
      content_scale: z.number().optional(),
      delay: z.number().optional(),
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