// src/types/index.ts

export interface SocialLink {
  name: string;
  url: string;
  icon_class: string; // e.g., "bi bi-github"
}

export interface ContactInfo {
  item: string;
  content: string;
  icon_class: string; // e.g., "bi bi-envelope"
}

export interface PersonaConfig {
  // Site metadata
  title: string;
  author: string;
  description: string;
  
  // Theme specific settings (formerly [extra.persona])
  social_links: SocialLink[];
  contact_infos: ContactInfo[];
  web3form_public_key?: string;
  quote: string;
  copyright: string;
  credits: string;
}

// Frontmatter types for Content Collections (Markdown files)
// This maps to the Zola 'extra' fields found in your markdown files
export interface SectionFrontmatter {
  title: string;
  order?: number;      // Used for sorting sections (Zola: extra.order)
  icon_class?: string; // Icon for the menu (Zola: extra.icon_class)
  subtitles?: string;  // Typed.js strings for the Hero (Zola: extra.subtitles)
  
  // LaTeX support flag
  tex?: boolean | { macros?: Record<string, string> };
}
