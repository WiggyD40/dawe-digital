# Dawe Digital site

Astro static site, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Pages
- `/` homepage (`src/pages/index.astro`)
- `/services/`, `/about/`, `/contact/`, `/contact/thanks/` (noindex)
- `/blog/` blog index and `/blog/batch-film-instagram-reels-medical-clinic/` (article text is Wyatt's, verbatim; hand-written HTML, not Markdown, so quotes stay as written)
- `404.html` (noindex)

`/work/` doesn't exist yet. Add it (and a nav link and a sitemap entry) once there's real, approved media.

## Where things live
- Facts used on several pages (email, Instagram, form URL, services, steps, article meta): `src/data/site.ts`. An empty value hides that element everywhere.
- Header, footer, meta tags, OG image, JSON-LD slot: `src/layouts/Base.astro`.
- Content-Security-Policy: `security.csp` in `astro.config.mjs`. Astro writes the `<meta>` tag and hashes its own scripts and styles. CSP doesn't run under `npm run dev`; check it with `npm run build && npm run preview`. Known limit: browsers without `style-src-attr` (Safari before 15.4, Firefox before 108) block the inline `style=""` layout. Accepted for launch.
- Light ribbon: `src/scripts/ribbon.js`. Add `?motion=on` to a URL to preview it with Reduce Motion on.
- Sitemap: `public/sitemap.xml` is hand-written. Add every new indexable page to it.
- `public/og.png` (1200×630) and the favicons were made from the logo with `sharp`, which strips metadata. Strip EXIF from any new photo before committing: the repo is public.

## Contact form (Google Apps Script)
The form posts to a web app bound to a Google Sheet in Wyatt's **personal** Google account. Source: `apps-script/Code.gs`.

First deploy, in an incognito window signed in to the personal Gmail only:
1. Create a Sheet ("Dawe Digital leads"). Extensions → Apps Script. Paste `Code.gs`. Save.
2. Run `authorize` once and approve the "unverified app" warning.
3. Deploy → New deployment → type **Web app**. Execute as **Me**, Who has access **Anyone**. Deploy.
4. Copy the URL ending in `/exec` into `formUrl` in `src/data/site.ts`.

Lead emails go to the account that owns the script (`Session.getEffectiveUser()`), so no address is in this repo. Every valid submission is saved as a Sheet row. Rows marked `fast` (sent in under 3 seconds) and anything past 20 posts in 10 minutes are saved without an email, so check the Sheet now and then.

Updating the script: Deploy → Manage deployments → pencil → Version **New version**. Never "New deployment": that makes a new URL and breaks the live form.

If spam gets through: archive the deployment, make a new one, and update `formUrl`.

## Before merging to main
```bash
npm run build && npm run check
grep -rnE '\[[A-Z]' dist/                # must print nothing
grep -rl noindex dist                   # only contact/thanks and 404
```

## Local
```bash
npm run dev       # http://localhost:4321
npm run build && npm run preview
```
