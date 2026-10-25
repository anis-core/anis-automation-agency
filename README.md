# anis-automation-agency
"AI &amp; Automation Consultant helping businesses scale efficiently by building custom autonomous AI agents, streamlining complex workflows, and deploying smart web solutions tailored for growth."

## Project structure

```
public/                 ← the website (the only folder that gets deployed)
  index.html            page shell (no inline scripts or styles)
  config.json           all site text and data
  assets/app.js         renders the site from config.json
  assets/styles.css     built Tailwind CSS (generated — do not edit by hand)
  _headers              security headers for Cloudflare Pages
  *.png / *.jpg         images
src/input.css           source for assets/styles.css (custom CSS + Tailwind)
tailwind.config.js      Tailwind theme (colors, fonts) and content paths
package.json            Tailwind build scripts
serve.py, start-site.bat  local preview server (serves public/ only, on 127.0.0.1)
design-assets/          original design screenshots (not deployed)
```

## Local development

1. `npm install` (first time only)
2. `npm run build:css` after changing classes in `public/index.html` / `public/assets/app.js` or `src/input.css`
   (or `npm run watch:css` while editing)
3. Double-click `start-site.bat`, or run `python serve.py`, then open http://localhost:8080

Commit the rebuilt `public/assets/styles.css` together with your changes.

## Deploying to Cloudflare Pages

- Build command: *(leave empty — the CSS is pre-built and committed)*
- Build output directory: `public`
