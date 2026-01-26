// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

/**
 * Content Parser Utility for Playwright Tests
 * 
 * Parses YAML frontmatter from content markdown files.
 * Uses relative paths from this file to src/content/.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { fileURLToPath } from 'url';

// ES Module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Content directory relative to this file (testing/utils/ -> src/content/)
const CONTENT_DIR = path.resolve(__dirname, '../../src/content');

interface ContentFrontmatter {
    [key: string]: unknown;
}

/**
 * Parse frontmatter from a markdown file
 */
function parseFrontmatter<T>(filePath: string): T {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
        throw new Error(`No frontmatter found in ${filePath}`);
    }

    return yaml.load(frontmatterMatch[1]) as T;
}

// -----------------------------------------------------------
// SECTION CONTENT
// -----------------------------------------------------------

export interface HeroContent {
    title: string;
    img_credit?: string | { name: string; url: string; icon?: string };
    img_copyright?: string;
    img_copyright?: string;
    img_license?: string | { license: string; url: string };

    // New Config Fields
    mobile_text_align?: string;
    background_image_anchor?: string;
}

export function getHeroContent(): HeroContent {
    return parseFrontmatter<HeroContent>(path.join(CONTENT_DIR, 'sections/hero.md'));
}

export interface AboutQualification {
    text: string;
    img_credit?: string | { name: string; url: string };
    img_copyright?: string;
    img_license?: string | { license: string; url: string };
}

export interface AboutContent {
    title: string;
    qualifications_sidebar?: AboutQualification[];
}

export function getAboutContent(): AboutContent {
    return parseFrontmatter<AboutContent>(path.join(CONTENT_DIR, 'sections/about.md'));
}

// -----------------------------------------------------------
// BLOG POST CONTENT
// -----------------------------------------------------------

export interface BlogPostContent {
    title: string;
    img_credit?: string | { name: string; url: string };
    img_copyright?: string;
    img_license?: string | { license: string; url: string };
}

/**
 * Get blog post content by slug.
 * Searches recursively in blog_posts directory to support nested organization.
 */
export function getBlogPostContent(slug: string): BlogPostContent {
    const blogDir = path.join(CONTENT_DIR, 'blog_posts');

    function findFile(dir: string, filename: string): string | null {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                const found = findFile(fullPath, filename);
                if (found) return found;
            } else if (entry.name === filename) {
                return fullPath;
            }
        }
        return null;
    }

    const filePath = findFile(blogDir, `${slug}.md`);
    if (!filePath) {
        throw new Error(`Blog post not found: ${slug}`);
    }

    return parseFrontmatter<BlogPostContent>(filePath);
}

// -----------------------------------------------------------
// ATTRIBUTION HELPERS
// -----------------------------------------------------------

/**
 * Get the expected credit display text.
 * If credit is "hidden", returns the copyright owner (promoted).
 */
export function getExpectedCreditText(
    credit: string | { name: string; url: string } | undefined,
    copyright: string | undefined
): string {
    if (credit === 'hidden' && copyright) {
        return copyright;
    }
    if (typeof credit === 'object' && credit.name) {
        return credit.name;
    }
    if (typeof credit === 'string' && credit !== 'hidden') {
        return credit;
    }
    return copyright || '';
}

/**
 * Get the expected copyright display text.
 */
export function getExpectedCopyrightText(copyright: string | undefined): string {
    return copyright || '';
}
