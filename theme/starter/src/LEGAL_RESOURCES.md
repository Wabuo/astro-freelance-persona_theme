<!--
SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors

SPDX-License-Identifier: MIT
-->

# Legal Disclaimer

This ***theme demo*** page and **demo** content are controlled by its Git repository. If you have any issues or concerns, please reach out by opening a [GitHub issue](https://github.com/freelance-persona/astro-freelance-persona_theme/issues).

<br>
<br>
<br>

## Legal Disclaimer & Impressum Resources

Finding high-quality, legally sound text for your "Impressum", "Privacy Policy" (Datenschutz), and "Disclaimer" is critical. Do not just copy-paste from random sites. Use reputable generators or templates from rights organizations.

## 🇪🇺 DACH Region (Germany, Austria, Switzerland)

The "Impressum" is mandatory.

* **[e-recht24.de](https://www.e-recht24.de/impressum-generator.html)**: The standard for many German websites. Offers free Impressum and Privacy Policy generators.
* **[Datenschutz-Generator.de](https://datenschutz-generator.de/)** (Dr. Thomas Schwenke): Highly respected legal generator for GDPR/DSGVO compliance. Very detailed configuration options.

## 🌍 International & Civil Rights Focused

For robust protection and rights-focused language:

* **[Electronic Frontier Foundation (EFF)](https://www.eff.org/issues/bloggers/legal)**: The EFF provides excellent legal guides for bloggers and digital citizens. While they don't have a "generator", their "Legal Guide for Bloggers" covers liability, copyright, and Section 230 (US).
* **[Wicked Terms (opensource.guide)](https://opensource.guide/legal/)**: Good overview for open source projects.
* **[Cooley GO](https://www.cooleygo.com/documents/)**: Generates Privacy Policies and Terms of Use for startups (US/UK focus).

## 🛡️ Digital Rights Organizations

Consider supporting or referencing these organizations in your legal/about pages:

* **[European Digital Rights (EDRi)](https://edri.org/)**: An association of civil and human rights organisations from across Europe defending rights and freedoms in the digital environment.
* **[Chaos Computer Club (CCC)](https://www.ccc.de/)**: Europe's largest association of hackers.
* **[Bits of Freedom](https://www.bitsoffreedom.nl/)** (Netherlands)
* **[La Quadrature du Net](https://www.laquadrature.net/)** (France)

## ⚖️ How to use a Disclaimer File

1. Create a markdown file (e.g., `src/content/disclaimer.md`).
2. Paste your generated legal text into it.
3. Update your `freelance-persona.config.ts`:

    ```typescript
    legal: {
      // ...
      disclaimer: "src/content/disclaimer.md" // Path relative to project root
    }
    ```
