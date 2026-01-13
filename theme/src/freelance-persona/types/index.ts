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

  // Contact Form Configuration
  contact_form?: {
    provider:
    | "formspark"
    | "web3forms"
    | "ntfy"
    | "netlify"
    | "mailto"
    | "custom";
    action?: string; // For explicit URLs or custom endpoints
    access_key?: string; // For Web3/Formspark
    ntfy_topic?: string;
    ntfy_server?: string; // Default: https://ntfy.sh
  };

  /**
   * @deprecated Use theme_* vars in contact.md instead
   */
  contact_infos?: ContactInfo[];


  quote: string;
  copyright: string;
  credits: string | string[];

  // Color Configuration (Overrides base.scss)
  colors?: {
    primary?: string; // (Unused in base, but common alias)
    secondary?: string; // --default-color (Text)

    // Core Colors
    background?: string; // --background-color
    text?: string; // --default-color
    heading?: string; // --heading-color
    accent?: string; // --accent-color
    surface?: string; // --surface-color
    contrast?: string; // --contrast-color
    muted?: string; // --text-muted

    transparency?: string; // --transparency (e.g. "25%")

    // Navigation Colors
    nav?: {
      link?: string; // --nav-color
      hover?: string; // --nav-hover-color
      mobile_background?: string; // --nav-mobile-background-color
      dropdown_background?: string; // --nav-dropdown-background-color
      dropdown_link?: string; // --nav-dropdown-color
      dropdown_hover?: string; // --nav-dropdown-hover-color
      header_background?: string; // --header-background-color
      header_color?: string; // --header-color
    };
  };

  // New Visuals Config
  visuals?: VisualsConfig;

  // Font Configuration
  fonts?: {
    headings?: string;
    body?: string;
    navigation?: string;
    monospace?: string;

    // Font Sizes (Overrides base.scss)
    sizes?: {
      normal?: string; // --normal-font-size
      footer?: string; // --footer-font-size
      heading?: string; // --heading-font-size
      subtitle?: string; // --subtitle-font-size
      title?: string; // --title-font-size
      nav_icon?: string; // --nav-icon-size
    };
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