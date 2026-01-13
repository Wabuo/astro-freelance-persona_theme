---
title: "Card grid or sleek list"
date: 2026-01-11
description: "As you can see the theme offers multiple options to display blog posts in blog categories."
thumbnail: "/src/assets/img/background_empty.svg"
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
