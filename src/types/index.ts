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

// UPDATED: Layout Configuration
export interface LayoutConfig {
  // User defined margins (e.g., "5em", "140px", "5vw"). 
  // If margin_right is omitted, it defaults to matching margin_left.
  margin_left?: string;  
  margin_right?: string;
}

export interface PersonaConfig {
  title: string;
  author: string;
  description: string;
  
  social_links: SocialLink[];
  contact_infos: ContactInfo[];
  
  web3form_public_key?: string;
  
  quote: string;
  copyright: string;
  credits: string;

  layout?: LayoutConfig; 
}