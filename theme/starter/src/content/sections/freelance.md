---
# SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
#
# SPDX-License-Identifier: MIT

type: "features"
title: "Freelance"
description: "Services offered"
order: 5
icon_class: "lance-icon"

features:
  # Each feature card supports: title, subtitle (optional sub-heading,
  # e.g. split "Permaculture" / "Ecosystem Restoration Consulting"),
  # desc, icon, secondary_icon, link, button_text, unavailable,
  # unavailable_button_text. Font sizes have tunable floors — see
  # --feature-*-floor vars in the theme's styles/features.css.
  # On phones the grid re-pairs automatically: cards are read from the
  # desktop 3-col matrix in 2-column bands (first two columns of every
  # row, then the last column). mobileOrder (optional, 1..n) pins a
  # card to an absolute phone position instead. Desktop keeps the
  # authored order.
  - title: "Blazing Fast"
    desc: "Built with Astro {{astro_major}} and zero-JS core. Degrades extremely gracefully in a no-JS environment."
    icon: "bi bi-lightning-charge"
    link: "/coming-soon"
    button_text: "Tell me More"
    
  - title: "SEO Optimized"
    desc: "Semantic HTML, meta tags, and Open Graph support out of the box."
    icon: "bi bi-search"
    link: "#contact"
    button_text: "Contact Form"

  - title: "Responsive Design"
    desc: "Mobile-first approach. Looks great on phones, tablets, and desktops."
    icon: "bi bi-phone"
    secondary_icon: "bi bi-laptop"
    link: "https://github.com/freelance-persona/astro-freelance-persona_theme"
    button_text: "Source Code"

  - title: "Static & Secure"
    desc: "No database, no backend to hack. Just pure, secure static HTML."
    icon: "bi bi-shield-check" 
    link: "/coming-soon"
    button_text: "Read More"

  - title: "Easy Configuration"
    desc: "Control colours, fonts, and settings via a single config file."
    icon: "bi bi-sliders"
    link: "/coming-soon"
    button_text: "Read More"

  - title: "User Analytics"
    desc: "Sorry, unavailable. We treasure our visitors' privacy (and yours)."
    icon: "bi bi-bar-chart" 
    link: "#"
    unavailable: true
    unavailable_button_text: "Sorry, currently unavailable"
---
