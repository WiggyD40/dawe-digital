# Dawe Digital site

Astro static site, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Pages
- `/` homepage (`src/pages/index.astro`)
- `/blog/` blog index (`src/pages/blog/index.astro`)
- `/blog/batch-film-instagram-reels-medical-clinic/` first article
- `404.html`

The shared header, footer, fonts and Content-Security-Policy live in `src/layouts/Base.astro`. The light-ribbon effect is `src/scripts/ribbon.js`. Its source of truth is the Option B and Blog boards on the design canvas.

## Before indexing
Every page carries `<meta name="robots" content="noindex">` (see `Base.astro`). Remove it once every `[PLACEHOLDER]` is filled in. To find them all:

```bash
grep -rn '\[[A-Z]' src/
```

## Contact form
Not built yet, so the "Start a project" buttons point at the footer. When the Google Apps Script form ships, add `https://script.google.com https://script.googleusercontent.com` to `connect-src` and `form-action` in the CSP.

## Local
```bash
npm run dev       # http://localhost:4321
npm run build && npm run preview
```
