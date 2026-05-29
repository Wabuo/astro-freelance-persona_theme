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
# To use the template from the official repository:
bun create astro@latest -- --template freelance-persona/astro-freelance-persona_theme/theme/starter
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
6. **We dont care about backward compatibility:** If something breaks, there will be a new major release. No such thing as LTS! This is a rolling release kinda model.

## Configuration

The Main configuration file is `src/freelance-persona.config.ts`.<br>
This file is mainly for theme/web page wide settings.<br>
Each markdown file defining a page can override these settings and will often also offer page/section specific settings.

### 🧪 Math, Chemistry & Figure Layouts

This theme includes built-in support for mathematical formatting, chemical equations, theme-adaptive vector drawings, and advanced figure layouts.

1. **Math & Chemical Equations**:
   Enable LaTeX math and chemical reactions by setting `tex: true` in your post frontmatter.
   - **Math**: Use standard delimiters like `$E = mc^2$` (inline) or `$$a^2 + b^2 = c^2$$` (block).
   - **Chemical Formulas**: Use the `mhchem` syntax `$\ce{C8H10N4O2}$` or `$$\ce{CO2 + H2O -> H2CO3}$$`.

2. **Theme-Aware Chemical Diagrams**:
   To include skeletal formulas or structures (e.g. from ChemDraw or MarvinSketch) that automatically adapt their stroke and fill colors to Light/Dark modes:
   - Save your unedited SVG in your content folder.
   - Reference it in Markdown using the `?inline` parameter. Sizing, text wrapping, and alignment parameters are supported (see below).
   - The build pipeline will inline the SVG and map all black/dark colors to `currentColor`, making them responsive to theme toggles.

3. **Figure Card Layouts (All Formats)**:
   Any image link in a blog post (PNG, JPG, SVG) referenced with query parameters (e.g. `?width=12rem&float=right`) will be wrapped in an editorial-style `.post-figure` card:
   - **Sizing (`width`)**: Sets custom widths. An explicit relative CSS unit (e.g. `width=14rem`, `width=8em`, or `width=50%`) is **required** (unitless numbers and `px` are rejected).
   - **Float (Text Wrap)**: Float the graphic so paragraph text wraps around it using `float=left` or `float=right`. Floats are automatically cleared on mobile viewports (`< 576px`) to prevent text squishing.
   - **Alignment (Block)**: Align the graphic block using `align=left`, `align=center` (default), or `align=right` (for block layouts where text does not wrap alongside it).
   - **Descriptions & Captions**: Setting an alt text (e.g. `![Caffeine Molecule]`) or a `desc` parameter (e.g. `?desc=Some+description`) automatically creates a `<figcaption>` card section at the bottom.
   - **Image Attributions**: Provide image attribution using `credit`, `credit_url` (or `credit_url`), `license`, and `copyright` query parameters. If a caption is present, the attribution displays inline at the bottom of the caption. If no caption is present, it renders as a subtle theme-wide absolute overlay at the bottom-right.
   - **Path Resolution**: You can reference images relatively inside the content folder (e.g., `./caffeine.svg`) or use the global `@/` alias (e.g., `@/assets/img/avatar.svg`).

   ```markdown
   <!-- Left-floated inline SVG card with description and attribution in the caption -->
   ![Caffeine Molecule](./caffeine.svg?inline&width=14rem&float=left&desc=Caffeine+is+a+stimulant.&credit=Wikimedia&license=Public+Domain)

   <!-- Right-floated avatar image with absolute attribution overlay (no caption) -->
   ![](@/assets/img/avatar.svg?width=12rem&float=right&credit=Freelance+Persona&license=MIT)
   ```

4. **Asset Optimization & Sizing Limitations**:
   - **Vite Asset Pipeline**: Local images inside your content directories alongside your markdown files are copied, optimized, and hashed by Vite into the output `dist/_astro/` assets folder at build time.
   - **Sizing Limitation**: The `width` parameter scales the figure container card dynamically in the browser using CSS container rules. It does not resize the source file dimensions or generate fluid responsive `srcset`s at build time. For heavy photography or image galleries requiring deep source-level dimension optimization, use Astro's native `<Image>` or `<Picture>` components in a `.astro` template rather than raw Markdown images.


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

- **Root**: Contains the Theme package (`astro-freelance-persona_theme`).
- **`starter/`**: Contains a clean sample template for the theme.
- **`playground/`**: An initially empty folder, to be used as a local development and testing environment, copy the content of starter here.

### Prerequisites

- **Node.js** (v18+)
- **Bun** (v1.0+)

### Setup Steps

1. #### Clone the Repository

    ```fish
    git clone https://github.com/freelance-persona/astro-freelance-persona_theme.git
    cd astro-freelance-persona_theme
    ```

2. #### Install Dependencies

   Run this in the root directory. It installs dependencies for the theme and the starter template.

   ```fish
   bun install
   ```

3. #### Setup the Playground

   Run the setup script from the root directory. This will copy the starter template into a git-ignored `playground` directory and automatically link the local theme for you.

   ```sh
   bun run playground:setup
   ```

   You can now edit the files in the `playground` directory to test the theme.

   - ##### Reset playground

      To reset the playground to its original state, simply run `bun run playground:setup` again.

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

#### 📸 Visual Regression Testing & Snapshots

The test suite includes visual regression tests that verify UI consistency using Playwright screenshots.

*   **Intentionally Git-Ignored:** To prevent bloating the repository with large binary files, all `*.png` snapshot references are git-ignored. Snapshots only live locally and on CI environments.
*   **Generating Baseline Snapshots:** Because snapshots are not committed to Git, you must generate the initial baseline screenshots on your local environment before running tests:
    ```fish
    # Navigate to the playground and update snapshots
    cd playground
    bun run test --update-snapshots
    ```
*   **Syncing Snapshots (For Theme/Starter Developers):** Tests run in the ephemeral `playground` workspace. To ensure updated snapshots persist across playground resets (`bun run playground:setup`), copy the updated snapshots back to the starter source folder:
    ```fish
    cp -r playground/testing/tests/*-snapshots/ theme/starter/testing/tests/
    ```

### Architecture Notes

- **`playground/package.json`**: During local development, this uses the local version of the theme. When published as a template, it uses the version from the npm registry.
- **Imports**: The starter imports components from the theme package (e.g., `astro-freelance-persona_theme/components/...`) just like a real user would.

### Custom services/products pages

Linked to by freelance features should follow the following setup:
"Create a new file at `src/pages/services/your-service-name.astro` and then link to it in your `freelance.md` config."

## 🔒 Security & Local Hooks

To ensure commits remain secure, release-ready, and free of accidental secrets, you can install the repository's git and Jujutsu hooks:

### Git Hooks Installation
Run the following command from the repository root:
```bash
git config core.hooksPath .githooks
```

### Jujutsu (jj) Hooks Installation (outdated !FixMe!)
Add the following alias to your global `~/.config/jj/config.toml` configuration:
```toml
[aliases]
push-safe = ["util", "exec", "--", "/home/fabio/Documents/Programming/Website/Astro/astro_freelance-persona_theme/.jj-hooks/pre-push.sh"]
```
Then use `jj push-safe` instead of `jj git push` to push bookmarks.

<br>
<br>
<br>
<br>

— *This theme, and anything attached to it, comes with absolutely no warranty, I've got no idea what I'm doing!*<br>
*(and can't spell — shoutout to my fellow dyslexics)*

