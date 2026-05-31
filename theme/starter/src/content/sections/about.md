---
# SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
#
# SPDX-License-Identifier: MIT

title: "About"
type: "about"
icon_class: "bi bi-person-vcard"
subtitle: "Public Self & Private Soul"
order: 10
avatar: "@/assets/img/avatar.svg"
# img_license/avatar_license: Auto-links known licenses defined in licenseUtils.ts.
# To override/custom link, use object format:
# img_license:
#   license: "Custom"
#   url: "..."
avatar_credit: 
  name: "freelance-persona"
  url: "https://github.com/freelance-persona/astro-freelance-persona_theme"
avatar_license: "CC BY-SA 4.0"
avatar_styles:
  float_margin_top: "-5rem"
  float_margin_right: "18rem"    # 0 is the right screen edge
  float_margin_left: "clamp(2rem, 6%, 5rem)" # 6% of content width (Responsive)
  # Can also be set to something like 30rem, to ensure no text below it for the rest of the about page
  float_margin_bottom: "clamp(2rem, 2%, 5rem)"
qualifications_sidebar:
  - text: "Theme License"
    subtitle:
      - "MIT Open Source"
      - "2026"
      - "Lance Icon"
      - "OFL 1.1+"
    icon: "bi bi-award"
    image: "@/assets/img/theme_certificate.svg"
    img_credit: "hidden"
    img_copyright: "freelance-persona"
    img_license: "CC0"
    link: "https://github.com/freelance-persona/astro-freelance-persona_theme/blob/main/LICENSE"

  - text: "Tech Stack"
    subtitle: 
      - "Astro {{astro_minor}}"
      - "Bootstrap {{bootstrap_minor}}"
      - "TypeScript"
    icon: "bi bi-stack"
  
  - text: "Origin"
    subtitle:
      - "Ported from Zola Persona"
      - "Inspired by Zola Goyo"
    icon: "bi bi-git"

  - text: "Performance"
    subtitle: "100/100 Lighthouse"
    icon: "bi bi-speedometer2"
---

This is `Freelance Persona`, a modern, responsive, and lightweight theme for Astro.

Your online presence shouldn't be a trade-off between a stiff résumé and a chaotic blog.
I am the synthesis: a professional portfolio to win clients, showcase services and products, and a personal space to share your thoughts or drive client engagement.
Clean code, high performance, and zero bloat. Consider this the blueprint for your digital self.

## The Outer Space

I'm built as a static site generator theme, prioritizing speed, accessibility, and simplicity.
My structure is a journey of continuous refinement - a nicer way of saying I'm always open to Pull Requests.
I thrive on turning markdown content into beautiful HTML, whether that means shaping a simple resume or guiding a visitor through a complex portfolio.
The goal is always the same: to render work that is intelligent in its design, useful in its function, and elegant in its form.

## The Inner Compass

In the parallel world of code, I am a quiet composition of minimal Javascript, an avid consumer of structured data, and a dedicated believer in semantic HTML.
These technical pillars are my backbone, the source of my performance, and the wellspring of my reliability.
It's in the solitude of a build process or the logic of a type definition that I find the clarity needed for the web's bigger challenges.

## Get in Touch (Or Don't)

Whether you use me as is, or fork me into something new is an open question; perhaps that's fitting, as open source is all about collaboration.
Still, if your own path has led you here, and you've found a bug you really, really, really want to discuss, you can open an issue on GitHub.
Please do.
But you could also just star the repo.

Wishing you an amazing build, an awesome deploy, and an astonishing Lighthouse score!
