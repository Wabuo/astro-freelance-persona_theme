export interface SocialLink {
  name: string;
  url: string;
  icon_class: string;
}

export interface ContactInfo {
  item: string;
  content: string;
  icon_class: string;
}

// Visuals Engine Configuration
export interface VisualsConfig {
  scroll_animations?: {
    enabled?: boolean;
    duration?: number;
    threshold?: number;
    root_margin?: string;
  };
  delays?: {
    heading?: number;
    content?: number;
    grid_stagger?: number;
  };
  layout?: {
    page_margin_left?: string;
    page_margin_right?: string;
  };
}

export interface PersonaConfig {
  title: string;
  author: string;
  description: string;

  social_links: SocialLink[];

  // Contact Data (Source of Truth)
  email?: string;
  phone?: string;
  address?: string;

  // Legacy Contact Structure (Deprecated - prefer contact.md + theme_* vars)
  contact_infos?: ContactInfo[];

  web3form_public_key?: string;

  quote: string;
  copyright: string;
  credits: string;

  // New Visuals Config
  visuals?: VisualsConfig;
}