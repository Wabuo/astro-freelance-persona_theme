---
# SPDX-FileCopyrightText: 2026 2026 The freelance-persona_theme Project Contributors
#
# SPDX-License-Identifier: MIT

order: 0
type: hero
title: "Freelance — Persona"
greeting: ""
hero_typing_text: "A modern, responsive and lightweight theme for resume, portfolio, and blog"
background_image: "@/assets/img/background.svg"
# img_license: Auto-links known licenses (CC0, CC BY, etc.) defined in licenseUtils.ts.
# To override/custom link, use object format:
# img_license:
#   license: "Custom"
#   url: "..."
img_credit: 
  name: "Your Photographers social"
  url: "https://instagram.com"
  icon: "bi bi-instagram"
img_copyright: "freelance-persona"
img_license: "CC BY-SA 4.0"
background_overlay_transparency: 35% # default 25% | given the muted colors of the sample image less was needed

#### RESTORE YOUR LAYOUT:
## how much to push away from the left
position_x: "left"
nudge_x: "4.5vw"

## how much to push away from the top
position_y: "middle"
nudge_y: "-9.5vh"
#nudge_y: "3vh"

#content_scale: 0.85

#title_font_size: "4rem"
typing_font_family: '"Courier New", Courier, monospace'
gap_title_to_typing: "0.1125rem"
gap_typing_to_socials: "1.5625rem"
---







```yaml
###############################################################################
##                          All posible settings                             ##
##               Needed ones are uncommented and have defaults               ##
##                                                                           ##
##          uncomment the other ones and customize to your liking            ##
###############################################################################

# -----------------------------------------------------------------------------
# CORE SETTINGS (Required)
# -----------------------------------------------------------------------------
#order: 0
#type: hero
#title: "Freelance — Persona"

# -----------------------------------------------------------------------------
# CONTENT (Optional)
# -----------------------------------------------------------------------------
#greeting: "I'm"
#hero_typing_text: "a Zola Theme, a Resume, a Portfolio, a Blog"

# background_image: "../../assets/img/background.jpg"  <-- Uncomment to use specific file and filetype.
# Right now it will take any background.suported_image_file_type it finds
# following this logic // Priority: JPG > PNG > WEBP > SVG > Others 

# -----------------------------------------------------------------------------
# LAYOUT & POSITION (Optional)
# -----------------------------------------------------------------------------
# Controls the coarse alignment of the content block.
# position_x: "center"  # Options: left, center, right
# position_y: "middle"  # Options: top, middle, bottom

# Controls the width of the content container (Bootstrap columns).
# size: "medium"        # Options: small, medium, large, full

# -----------------------------------------------------------------------------
# FINE TUNING (Optional)
# -----------------------------------------------------------------------------
# Move the content block pixel-perfectly from its base position.
# nudge_x: "0px"        # e.g., "9.5vw" (your confirmed horizontal shift)
# nudge_y: "0px"        # e.g., "-8vh" (your confirmed vertical shift)

# Scale the entire block (text, icons, gaps) up or down.
# content_scale: 1.0    # e.g., 0.9 (90% size)

# -----------------------------------------------------------------------------
# TYPOGRAPHY (Optional)
# -----------------------------------------------------------------------------
# title_font_size: "3.5rem"
# title_font_family: "Raleway"  # Requires @fontsource/raleway in your starter

# typing_font_size: "1.625rem"
# typing_font_family: '"Courier New", Courier, monospace'

# -----------------------------------------------------------------------------
# SPACING (Optional)
# -----------------------------------------------------------------------------
# gap_title_to_typing: "0.3125rem"    # Space between H2 and Paragraph
# gap_typing_to_socials: "1.5625rem"  # Space between Paragraph and Icons

# -----------------------------------------------------------------------------
# TYPING ANIMATION SPEEDS (Optional)
# -----------------------------------------------------------------------------
# typing_speed: 100
# deleting_speed: 50
# pause_duration: 2000
```
