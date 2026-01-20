---
# SPDX-FileCopyrightText: 2026 2026 The freelance-persona_theme Project Contributors
#
# SPDX-License-Identifier: MIT

type: "blog_categories"
title: "Blogs"
custom_id: "blogs"
#subtitle: "Explore the documentation"
order: 25
icon_class: "bi bi-grid"
categories:
  - title: "Development"
    overlay_title: true
    overlay_style: "none"
    title_style: "light"
    background_color: "#333"
    tags: ["dev", "astro", "coding"]
    description: "Core features, API updates, and performance tuning. (Overlay Title) + (Grid example inside) "
    show_subtitle: false
    style: "cards"
  - title: "Design System"
    image: "@/assets/img/background.svg"
    img_credit: "hidden"
    img_copyright: "freelance-persona"
    img_license: "CC BY-SA 4.0"
    overlay_title: true
    overlay_style: "dark"
    mix_accent: 55
    overlay_opacity: 0.5
    title_style: "light"
    tags: ["design", "css"]
    description: "Layouts, components, and visual guidelines. (Overlay Title with ribbon) + (List example)"
  - title: "Community"
    background_color: "#f8cd20ff"
    overlay_title: false
    title_style: "dark"
    overlay_style: "none"
    tags: ["community"]
    description: "Showcases, tutorials, and success stories. (No Overlay) + (No posts yet example)"
mini_categories:
  - title: "Deprecated"
    description: "Old patterns."
    tags: ["legacy"]
  - title: "Experimental"
    description: "Beta features."
    tags: ["beta"]
  - title: "Changelog"
    description: "Release notes."
    tags: ["changelog"]
---