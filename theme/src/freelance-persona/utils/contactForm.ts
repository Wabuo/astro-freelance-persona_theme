// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// src/freelance-persona/utils/contactForm.ts

export interface ContactFormConfig {
  provider: "formspark" | "web3forms" | "ntfy" | "netlify" | "mailto" | "custom";
  action?: string;
  access_key?: string;
  ntfy_topic?: string;
  ntfy_server?: string;
  checkboxes?: Array<{
    id: string;
    label: string;
    required: boolean;
  }>;
}

export interface ResolvedContactForm {
  action: string;
  method: string;
  enctype?: string;
  hiddenInputs: Record<string, string>;
  provider: string;
}

/**
 * Resolve contact form configuration to action URL and hidden inputs
 */
export function resolveContactForm(
  config: ContactFormConfig,
  themeConfig: {
    email?: string;
    phone?: string;
    address?: string;
    author?: string;
  }
): ResolvedContactForm {
  const provider = config.provider || "formspark";
  let action = config.action || "";
  const method = "POST";
  const hiddenInputs: Record<string, string> = {};

  // Provider Specific Setup
  switch (provider) {
    case "formspark":
      if (!action && config.access_key) {
        action = `https://submit-form.com/${config.access_key}`;
      }
      hiddenInputs["_gotcha"] = ""; // honeypot
      break;
      
    case "web3forms":
      if (!action) {
        action = "https://api.web3forms.com/submit";
      }
      if (config.access_key) {
        hiddenInputs["access_key"] = config.access_key;
      }
      hiddenInputs["botcheck"] = ""; // honeypot
      break;
      
    case "ntfy":
      if (!action) {
        const server = config.ntfy_server || "https://ntfy.sh";
        const topic = config.ntfy_topic;
        if (!server.startsWith("http")) {
          action = `https://${server}/${topic}`;
        } else {
          action = `${server}/${topic}`;
        }
      }
      break;
      
    case "netlify":
      action = "/"; // Netlify handles submission on same-page POST
      hiddenInputs["bot-field"] = ""; // honeypot
      hiddenInputs["form-name"] = "contact";
      break;
      
    case "mailto":
      action = `mailto:${themeConfig.email || ""}`;
      break;
      
    case "custom":
      // action must be provided in config
      break;
  }

  return {
    action,
    method,
    enctype: provider === "mailto" ? "text/plain" : undefined,
    hiddenInputs,
    provider
  };
}

/**
 * Generate hidden input HTML for contact form
 */
export function generateHiddenInputs(inputs: Record<string, string>): string {
  return Object.entries(inputs)
    .map(([name, value]) => `<input type="hidden" name="${name}" value="${value}" />`)
    .join("\n");
}