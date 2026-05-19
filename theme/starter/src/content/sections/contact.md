---
# SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
#
# SPDX-License-Identifier: MIT

type: contact
title: Contact
#subtitle: Get in Touch
order: 1000
icon_class: bi bi-envelope-open

# Note: Form provider settings (Web3Forms/Formspark/Ntfy) are configured in src/freelance-persona.config.ts
contact_items:
  - label: Name
    value: theme_author
    icon: bi bi-person
    type: text

  - label: Email
    value: theme_email
    icon: bi bi-envelope
    type: email

  - label: Address
    value: theme_address
    icon: bi bi-geo-alt
    type: address

# If you dont want a section, just delete it.
  - label: Phone
    value: theme_phone
    icon: bi bi-phone
    type: phone
---
