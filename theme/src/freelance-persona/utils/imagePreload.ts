// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// src/freelance-persona/utils/imagePreload.ts
import { getImage, ImageMetadata } from "astro:assets";

/**
 * Result of image preload optimization
 */
export interface PreloadResult {
  src: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Optimize an image for preloading in <head>
 * Uses Astro's getImage to generate optimized version at build time
 */
export async function optimizeForPreload(
  image: ImageMetadata | undefined,
  options: {
    width?: number;
    height?: number;
    quality?: number | string;
    format?: string;
  } = {}
): Promise<PreloadResult | null> {
  if (!image) return null;

  const format = options.format || (image.format === 'svg' ? 'svg' : 'webp');
  const width = options.width || 1920;
  const height = options.height || 1080;
  const quality = options.quality || "high";

  const optimized = await getImage({
    src: image,
    format: format as any,
    width,
    height,
    quality,
  });

  return {
    src: optimized.src,
    width: optimized.width,
    height: optimized.height,
    format: optimized.format,
  };
}

/**
 * Generate preload link HTML for an image
 */
export function generatePreloadLink(result: PreloadResult | null): string {
  if (!result) return "";
  
  return `<link rel="preload" href="${result.src}" as="image" type="image/${result.format}" />`;
}

/**
 * Hero background preload
 */
export async function getHeroPreload(
  image: ImageMetadata | undefined
): Promise<PreloadResult | null> {
  return optimizeForPreload(image, {
    width: 1920,
    height: 1080,
    format: 'webp',
  });
}

/**
 * Blog post thumbnail preload
 */
export async function getThumbnailPreload(
  image: ImageMetadata | undefined
): Promise<PreloadResult | null> {
  return optimizeForPreload(image, {
    width: 1100,
    quality: "high",
  });
}