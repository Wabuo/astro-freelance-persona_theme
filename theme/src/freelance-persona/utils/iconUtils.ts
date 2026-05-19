// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

/**
 * Utility to transform legacy icon-font classes (Bootstrap, Academicons)
 * to the astro-icon format (provider:name).
 * 
 * Example:
 * "bi bi-github" -> "bi:github"
 * "ai ai-google-scholar" -> "academicons:google-scholar"
 * "bi-instagram" -> "bi:instagram"
 */
export function transformIcon(iconClass: string): string {
  if (!iconClass) return "";

  // 1. Split by space and find the relevant part
  const parts = iconClass.split(" ");
  
  // Find the part that actually contains the icon name (usually the second one like 'bi-github')
  // or the only one if it's just 'bi-github'
  const namePart = parts.find(p => p.includes("-")) || parts[0];

  if (namePart.startsWith("bi-")) {
    return `bi:${namePart.replace("bi-", "")}`;
  }
  if (namePart.startsWith("ai-")) {
    return `academicons:${namePart.replace("ai-", "")}`;
  }
  
  // Fallback: If it's already in 'provider:name' format
  if (namePart.includes(":")) {
    return namePart;
  }

  // Final fallback (clean up common prefixes if found)
  return namePart.replace(/^bi-/, "bi:").replace(/^ai-/, "academicons:");
}
