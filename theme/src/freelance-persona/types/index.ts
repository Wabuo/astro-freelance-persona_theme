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
    stagger?: number;
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

  // Font Configuration
  fonts?: {
    headings?: string;
    body?: string;
    navigation?: string;
    monospace?: string;
  };

  // Legal / Impressum Configuration
  legal?: {
    enabled?: boolean;
    link_text?: string; // e.g., "Legal Notice" or "Impressum"
    legal_name?: string; // Full legal name if different from author
    legal_address?: string; // Specific legal address or "theme_address"
    legal_email?: string; // Specific legal email or "theme_email"
    legal_phone?: string; // Specific legal phone or "theme_phone"
    business_license?: string;
    vat_id?: string;
    jurisdiction?: string;
    disclaimer?: string; // Optional markdown for legal disclaimer
    legal_note?: string; // Optional unintrusive note
  };
}