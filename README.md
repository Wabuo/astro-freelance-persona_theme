<!--
SPDX-FileCopyrightText: 2026 2026 The freelance-persona_theme Project Contributors

SPDX-License-Identifier: MIT
-->

# Astro freelance-persona theme

A modern, responsive, and lightweight theme for freelancing, portfolios, and blogs. Initially ported from Zola Persona, customized and expanded for the freelancing focus with elements from Zola Gouyu.
Modernized and adapted to Astro 5.

## 🚀 Quick Start (For Users)

To create a new website using this theme, simply run the following command. This will download the starter template and set everything up for you.

```bash
# Replace 'YourGitHubName' with the actual GitHub username where the theme is hosted
npm create astro@latest -- --template YourGitHubName/astro-freelance-persona/starter
```

## 📜 The "Manifesto" (Agreed Design Rules)

1. **No Hardcoded Pixels:** Use relative units or CSS variables wherever possible.
2. **4-Level Hierarchy:** Settings are resolved in this strict order:
    - Level 1: Frontmatter (Targeted Override)
    - Level 2: Component Role (Context: Title vs Content)
    - Level 3: User Config (Theme-wide Preference)
    - Level 4: Code Fallback (sensible defaults, allows for easy code portability)
3. **Privacy First:** No external CDNs, minimal JS bloat.
4. **Configuration, Not Prescription:** The `starter` config file should be minimal. Defaults live in the lowest sensible level of code/logic that consumes the value, not in the user's config file or a theme wide shadow config file.
5. **We are pre alpha:** There is no such thing as backward compatibility.
6. **We dont care about backward compatibility:** If something breaks, there will be a new major release. No such thing as LTS! This is a roaling release kinda model.

## Configuration

The Main configuration file is `src/freelance-persona.config.ts`.<br>
This file is mainly for theme/web page wide sttings.<br>
Each markdown file defining a page can override these settings and will often also offer page/section specific settings.

### 🎨 Font Configuration

This theme uses a configurable font system. The starter template comes with **Poppins**, **Raleway**, and **Roboto** pre-configured.

To change fonts:

1. **Install the font package**: e.g., `bun add @fontsource/inter`
2. **Import the CSS**: Add the import to `src/fonts.ts`.
3. **Update Config**: Update the `fonts` section in `src/freelance-persona.config.ts`.
4. **Don't Forget**: to uninstall unneeded font package(s).

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## 🛠️ Local Development Setup (For Contributors)

This repository is set up as a **Monorepo** using **Bun Workspaces**.

- **Root**: Contains the Theme package (`astro-freelance-persona`).
- **`starter/`**: Contains a clean sample template for the theme.
- **`playground/`**: An initially empty folder, to be used as a local development and testing environment, copy the content of starter here.

### Prerequisites

- **Node.js** (v18+)
- **Bun** (v1.0+)

### Setup Steps

1. #### Clone the Repository

   ```fish
   git clone [https://github.com/YourGitHubName/astro-freelance-persona.git](https://github.com/YourGitHubName/astro-freelance-persona.git)
   cd astro-freelance-persona
   ```

2. #### Copy files from starter to playground

   Copy all files from the `starter` directory to the `playground` directory.

   ```fish
   cp -r theme/starter/* playground/
   ```

   You can now edit the files in the `playground` directory to test the theme.

   - ##### Reset playground

      To reset the playground to the original state, delete the `playground` directory and run `cp -r theme/starter/* playground/` again, then run `bun install` in the root directory.

3. #### Install Dependencies

   Run this in the root directory. It installs dependencies for **both** the theme and the starter, and links them together automatically.

   ```fish
   bun install
   ```

4. #### Start Development Server

   This starts the `playground` site in development mode.

   ```fish
   bun run dev
   ```

   - Open <http://localhost:4321> in your browser.
   - Any changes you make to the theme files (`src/freelance-persona/...`) will **instantly hot-reload** in the browser.

### Building & Testing

Before submitting changes, ensure the production build works:<br>
`astro build` can and will catch some things that `bun run dev` won't.

```fish
# Runs astro check 
bun run check

# Build the playground site using the local theme
bun run build

# Preview the built site
bun run preview
```

### Running Tests

The starter template includes a Playwright test suite that validates your content and theme functionality. Tests automatically parse your content files, so they work with your customized content.

```fish
# Install Playwright browsers (first time only)
bunx playwright install

# Run all tests
bun run test

# Run tests with verbose output
bunx playwright test --reporter=list
```

Tests are located in `testing/tests/` and use the `testing/utils/content-parser.ts` utility to dynamically read expected values from your content files.

### Architecture Notes

- **`playground/package.json`**: During local development, this uses the local version of the theme. When published as a template, it uses the version from the npm registry.
- **Imports**: The starter imports components from the theme package (e.g., `astro-freelance-persona/components/...`) just like a real user would.

### Custom services/products pages

Linked to by freelance features should follow the following setup:
"Create a new file at `src/pages/services/your-service-name.astro` and then link to it in your `freelance.md` config."

<br>
<br>
<br>
<br>

— *This Theme and anything attached to it, comes with absolutely no warranty, I've got no idea what I'm doing!*<br>
*(and can't spell — shoutout to my fellow dyslexic)*
