> While it works great for a single static theme, it creates a specificity nightmare the moment you introduce a dynamic Dark Mode toggle, because inline styles (1,0,0,0) will always win against external CSS classes (0,1,0). The "cleaner" architectural way to do this would be to generate a <style id="theme-config"> :root { ... } </style> block in the <head> instead of using the style="..." attribute, so the specificities match. However, since the template is already built this way, using !important for your dark mode SCSS overrides is the standard, accepted workaround!

We should fix this, when we migrate the css to more modern imports! !FixMe!



Ok the lance icon is back to normal, thx

continue fising the codbeblock stuff, dont redesign the genneral codeblocks they where nice, same for the syntax highlighting the only thing that needs fixing is the collor sheme of the syntax highlighting switching from night/day aka dark/light mode with the theme when the theme switches or we will always have issues ither with contrast in the dark or in the light theme ... this should be controled by our brothers native theme switcher

continue