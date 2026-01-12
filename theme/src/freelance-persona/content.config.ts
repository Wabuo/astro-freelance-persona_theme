// src/freelance-persona/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 1. SECTIONS COLLECTION
const sections = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/sections" }),

  schema: ({ image }) => z.discriminatedUnion('type', [

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

    // B. FILTERED POSTS (Formerly Recent Posts)
    z.object({
      type: z.literal('filtered_posts'),
      title: z.string(),
      subtitle: z.string().optional(),
      tags_to_filter_posts_by: z.array(z.string()).optional(),
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



    // D. ABOUT SECTION (New)
    z.object({
      type: z.literal('about'),
      title: z.string(),
      subtitle: z.string().optional(),
      order: z.number().default(100),
      icon_class: z.string(),

      // Profile / Sidebar Elements
      avatar: image().optional(),
      qualifications_sidebar: z.array(z.object({
        text: z.string(),
        subtitle: z.union([z.string(), z.array(z.string())]).optional(),
        icon: z.string().optional(),

        image: image().optional(),
        link: z.string().optional(),
      })).optional(),

      avatar_styles: z.object({
        z_index: z.number().default(1),
        float_margin_top: z.string().optional(),
        float_margin_right: z.string().optional(),
        float_margin_left: z.string().optional(),
        grid_gap: z.string().optional(),
        shape_outside_circle: z.boolean().default(true),
      }).optional(),

      // Visual Overrides
      nudge_x: z.string().optional(),
      nudge_y: z.string().optional(),
      content_scale: z.number().optional(),
      delay: z.number().optional(),
    }),

    // E. CONTACT SECTION (New Schema)
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

    // F. BLOG CATEGORIES SECTION
    z.object({
      type: z.literal('blog_categories'),
      title: z.string(),
      subtitle: z.string().optional(),
      custom_id: z.string().optional(),
      order: z.number().default(100),
      icon_class: z.string(),
      categories: z.array(z.object({
        title: z.string(),
        image: image().optional(), // Path to image (now optional)
        background_color: z.string().optional(), // Solid color fallback
        tags: z.array(z.string()), // Array of tags to filter by
        description: z.string().optional(),
        show_subtitle: z.boolean().default(false),
        style: z.enum(['simple', 'cards']).default('simple'),

        // Overlay Configuration
        overlay_title: z.boolean().default(false),
        overlay_style: z.enum(['dark', 'light', 'accent', 'custom', 'none']).default('dark'),
        custom_overlay_color: z.string().optional(),
        mix_accent: z.number().optional(),
        overlay_opacity: z.number().optional(),
        title_style: z.enum(['dark', 'light', 'custom']).default(''),
        custom_title_color: z.string().optional(),
      })
        .refine((data) => {
          if (data.overlay_style === 'custom' && !data.custom_overlay_color) {
            return false;
          }
          return true;
        }, {
          message: "custom_overlay_color is required when overlay_style is 'custom'",
          path: ["custom_overlay_color"]
        })
        .refine((data) => {
          if (data.title_style === 'custom' && !data.custom_title_color) {
            return false;
          }
          return true;
        }, {
          message: "custom_title_color is required when title_style is 'custom'",
          path: ["custom_title_color"]
        })).default([]),

      mini_categories: z.array(z.object({
        title: z.string(),
        description: z.string().optional(),
        tags: z.array(z.string()),
        background_color: z.string().optional(),
        color: z.string().optional(),
      })).optional(),

      // Visual Overrides
      nudge_x: z.string().optional(),
      nudge_y: z.string().optional(),
      content_scale: z.number().optional(),
      delay: z.number().optional(),
    }),

    // E. FEATURES SECTION
    z.object({
      type: z.literal('features'),
      title: z.string(),
      description: z.string().optional(),
      order: z.number().default(100),
      icon_class: z.string().default('bi bi-card-list'),

      features: z.array(z.object({
        title: z.string(),
        desc: z.string(),
        icon: z.string().optional(),
        hover_icon: z.string().optional(),
        link: z.string().optional(),
        unavailable: z.boolean().optional(),
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
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog_posts" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    thumbnail: image().optional(),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  sections,
  blog_posts: blog,
};