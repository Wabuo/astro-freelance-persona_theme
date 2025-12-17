// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sections = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/sections" }),
  schema: z.object({
    title: z.string(),
    
    // --- 1. Standard Section Props ---
    // The small text below the main title (e.g. "Thoughts & Updates")
    subtitle: z.string().optional(),
    
    // --- 2. Hero Specific Props ---
    hero_typing_text: z.string().optional(),
    
    // The "I'm" or "Hello" text
    greeting: z.string().optional(),
    
    // --- 3. Blog/Category Props ---
    // Filter posts by this tag (e.g. "Beekeeping")
    blog_tag_filter: z.string().optional(),

    // --- 4. Technical Props ---
    order: z.number().default(100),
    icon_class: z.string().optional(),
    type: z.string().optional(),
    background_image: z.string().optional(),
  }).transform((data) => {
    return {
      ...data,
      // Ensure type is preserved, defaulting to 'plain' only if strictly missing
      type: data.type || 'plain',
      // Map hero_typing_text to subtitles to ensure backward compatibility with the Hero component
      subtitles: data.hero_typing_text,
    };
  }),
});
// 2. Blog Collection
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
