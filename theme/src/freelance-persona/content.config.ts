// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// src/freelance-persona/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared Attribution Schemas (AGENT.md Rule 9)
const creditSchema = z.union([
  z.object({
    name: z.string(), // MANDATORY name
    url: z.string().optional(), // OPTIONAL link to creator
    icon: z.string().optional(), // OPTIONAL icon class
  }),
  z.literal('hidden'),
]);

const copyrightSchema = z.string().optional(); // OPTIONAL owner

const licenseSchema = z.union([
  z.string(), // Auto-linked known license string
  z.object({ // Custom license
    license: z.string(),
    url: z.string(),
  }),
  z.literal('hidden'),
]);

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
      background_image: image().optional(),
      // Hero Config
      img_credit: creditSchema.optional(), // Required check done in superRefine
      img_copyright: copyrightSchema,
      img_license: licenseSchema.optional(), // Required check done in superRefine
      background_overlay_transparency: z.string().optional(),
      background_image_anchor: z.string().optional(),

      // Typing Config
      typing_speed: z.number().optional(),
      deleting_speed: z.number().optional(),
      pause_duration: z.number().optional(),

      // Layout Config
      position_x: z.enum(['left', 'center', 'right']).optional(),
      position_y: z.enum(['top', 'middle', 'bottom']).optional(),
      size: z.enum(['small', 'medium', 'large', 'full']).optional(),

      // Mobile Overrides
      mobile_position_y: z.enum(['top', 'middle', 'bottom']).optional(),
      mobile_text_align: z.enum(['left', 'center', 'right']).optional(),
      mobile_padding_bottom: z.string().optional(),
      mobile_image_object_position: z.string().optional(),

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
      avatar_credit: creditSchema.optional(), // Required when avatar is present
      avatar_copyright: copyrightSchema,
      avatar_license: licenseSchema.optional(), // Required when avatar is present
      qualifications_sidebar: z.array(z.object({
        text: z.string(),
        subtitle: z.union([z.string(), z.array(z.string())]).optional(),
        icon: z.string().optional(),
        image: image().optional(),
        img_credit: creditSchema.optional(), // Required when image is present
        img_copyright: copyrightSchema,
        img_license: licenseSchema.optional(), // Required when image is present
        link: z.string().optional(),
      })).optional(),

      avatar_styles: z.object({
        z_index: z.number().default(10),
        float_margin_top: z.string().optional(),
        float_margin_right: z.string().optional(),
        float_margin_left: z.string().optional(),
        float_margin_bottom: z.string().optional(),
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
        img_credit: creditSchema.optional(), // Image attribution (required when image is present)
        img_copyright: copyrightSchema,
        img_license: licenseSchema.optional(), // Image license (required when image is present)
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
        title_style: z.enum(['dark', 'light', 'custom', '']).default(''),
        custom_title_color: z.string().optional(),
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

    // G. FEATURES SECTION
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
        secondary_icon: z.string().optional(),
        link: z.string().optional(),
        unavailable: z.boolean().optional(),
        button_text: z.string().optional(),
        unavailable_button_text: z.string().default("Sorry, currently unavailable"),
      })).default([]),

      // Visual Overrides
      nudge_x: z.string().optional(),
      nudge_y: z.string().optional(),
      content_scale: z.number().optional(),
      delay: z.number().optional(),
    }),

  ]).superRefine((data, ctx) => {
    // Global image attribution enforcement
    // Hero: background_image requires attribution
    if (data.type === 'hero' && data.background_image) {
      if (!data.img_credit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "img_credit is required when background_image is present",
          path: ["img_credit"],
        });
      }
      if (!data.img_license) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "img_license is required when background_image is present",
          path: ["img_license"],
        });
      }
    }

    // About: avatar requires attribution
    if (data.type === 'about') {
      if (data.avatar) {
        if (!data.avatar_credit) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "avatar_credit is required when avatar is present",
            path: ["avatar_credit"],
          });
        }
        if (!data.avatar_license) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "avatar_license is required when avatar is present",
            path: ["avatar_license"],
          });
        }
      }

      // About: qualifications sidebar images require attribution
      if (data.qualifications_sidebar) {
        data.qualifications_sidebar.forEach((item, index) => {
          if (item.image) {
            if (!item.img_credit) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `qualifications_sidebar[${index}].img_credit is required when image is present`,
                path: ["qualifications_sidebar", index, "img_credit"],
              });
            }
            if (!item.img_license) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `qualifications_sidebar[${index}].img_license is required when image is present`,
                path: ["qualifications_sidebar", index, "img_license"],
              });
            }
          }
        });
      }
    }

    // Blog Categories: each category image requires attribution
    if (data.type === 'blog_categories' && data.categories) {
      data.categories.forEach((cat, index) => {
        if (cat.image) {
          if (!cat.img_credit) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `categories[${index}].img_credit is required when image is present`,
              path: ["categories", index, "img_credit"],
            });
          }
          if (!cat.img_license) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `categories[${index}].img_license is required when image is present`,
              path: ["categories", index, "img_license"],
            });
          }
        }
      });
    }
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog_posts" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    thumbnail: image().optional(),

    // Image Attribution
    // Optional fields, but REQUIRED when thumbnail is present
    img_credit: z.union([
      z.string(),  // Name/Pseudonym or URL
      z.object({   // Social link (icon+name)
        name: z.string(),
        url: z.string().optional(),
        icon: z.string().optional(),
      }),
      z.literal('hidden'),
    ]).optional(),

    img_copyright: z.string().optional(),

    img_license: z.union([
      z.string(),  // License name (e.g., "CC-BY-4.0", "Unsplash", "All Rights Reserved")
      z.literal('hidden'),
      z.object({
        name: z.string(),
        url: z.string(),
      }),
    ]).optional(),

    tags: z.array(z.string()),
    tex: z.boolean().optional(),
    layout_style: z.enum(['standard', 'science']).optional(),
  }).superRefine((data, ctx) => {
    // If thumbnail is present, require attribution fields
    if (data.thumbnail) {
      if (!data.img_credit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "img_credit is required when thumbnail is provided. Use a name, URL, or 'hidden'.",
          path: ["img_credit"],
        });
      }
      if (!data.img_license) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "img_license is required when thumbnail is provided. Use a license name or 'hidden'.",
          path: ["img_license"],
        });
      }
    }
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string().optional(),
  }),
});

export const collections = {
  sections,
  blog_posts: blog,
  legal,
};