---
# SPDX-FileCopyrightText: 2026 2026 The freelance-persona_theme Project Contributors
#
# SPDX-License-Identifier: MIT

title: "Card grid or sleek list"
date: 2026-01-11
description: "As you can see the theme offers multiple options to display blog posts in blog categories."
thumbnail: "@/assets/img/background_empty.svg"
img_credit: "hidden"
img_copyright: "freelance-persona"
# License auto-links: CC0, CC BY 4.0, MIT, Apache 2.0, GPL 3.0, etc.
# Use object {name, url} for custom license links.
# img_license: Auto-links known licenses (CC0, CC BY, etc.) defined in licenseUtils.ts.
# To override/custom link, use object format:
# img_license:
#   license: "Custom"
#   url: "..."
img_license: "CC0"
tags: ["design", "ux"]
---

This theme provides flexible options to present your content. You can configure each category independently in your `BlogCategories.md` file.

## Layout Styles

You can choose between two primary layouts for your category pages:

- **Cards** (`style: "cards"`): A responsive grid layout, perfect for visual content.
- **List** (`style: "list"`): A sleek, minimal vertical list, ideal for technical logs or changelogs.

## Visual Customization

Each category can be fine-tuned to match its content:

- **Overlays**: Toggle `overlay_title` to place text over images.
- **Title Styles**: Switch between `light` and `dark` text to ensure readability against any background.
- **Mix Accent**: Use `mix_accent` to blend the theme's accent color into your category images for a cohesive look.

## Tag Filtering

Categories are powered by tags. simply add `tags: ["dev", "astro"]` to your category definition, and any markdown file in `content/blog_posts` with those tags will automatically appear.

Code is configuration. Enjoy the flexibility.
