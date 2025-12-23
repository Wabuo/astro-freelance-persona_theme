# Astro freelance-persona theme

A modern, responsive, and lightweight theme for freelancing, portfolios, and blogs. Initially ported from Zola Persona, customized and expanded for the freelancing focus with elements from Zola Gouyu.
Modernized and adapted to Astro 5.

## 🚀 Quick Start (For Users)

To create a new website using this theme, simply run the following command. This will download the starter template and set everything up for you.

```bash
# Replace 'YourGitHubName' with your actual GitHub username
bun create astro -- --template YourGitHubName/astro-freelance-persona/starter
```

---

## 🛠️ Local Development Setup (For Contributors)

If you are developing the theme itself and want to test changes in real-time, follow this workflow.

We use **Bun** and `file:` dependencies to link local packages.

### Prerequisites

* **Node.js** (v18+)
* **Bun** (v1.0+)
* **Unix-like Shell** (bash, zsh, fish)

### Setup Steps

1. **Create a Test Site**
Run this command in the parent directory (sibling to your theme folder):
```fish
bun create astro --template minimal --no-git --install test_freelance-persona
cd test_freelance-persona
```


2. **Apply the Starter Template**
Manually copy the starter files into your test project. This simulates exactly what a user gets when they use the Quick Start command.
```fish
cp -r ../astro_freelance-persona_theme/starter/* ./
```


3. **Link the Theme**
This creates a live link to your local theme folder.
*(Note: Ensure the path points to your actual theme directory — where ever you git cloned to)*
```fish
bun add "file:../astro_freelance-persona_theme"
```


4. **Install Dependencies & Run**
Install the dependencies introduced by the starter (like Bootstrap/Sass) and start the dev server.
```fish
bun install; bun dev
```

5. **Before upstreaming/submitting any changes**
Please alsways run `bun run build; bun run preview` on your final code and see if anything comes up!
It can catch errors not exposed by `bun dev`, thanks.



### Workflow Tips

* **Hot Reloading:** Because of the `file:` link (and Bun's handling of it), edits to `../astro_freelance-persona_theme/src` will hot-reload in your browser.
* **Clean State:** If you mess up the configuration in `lets-freelance`, just delete the folder and repeat steps 1-4. It takes less than a minute.
* **Production Test:** Before committing major changes, run `bun run build` in your test site to ensure the production build passes.

---

*This Theme and aynthing attouched to it, comes with absolutly no warranty, I've got no idea what I'm doing!*<br>
*(and can't spell — shoutout to my fellow dyslexic)*

