# Dawe Digital site

Astro static site, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Pages
- `/` homepage (`src/pages/index.astro`)
- `/services/` (cards have anchors: `#video`, `#photo`, `#social`, `#web`), `/about/`, `/contact/`, `/contact/thanks/` (noindex)
- `/privacy/`: describes the real setup. The contact-form paragraph and the "Google Sheet" clause under Deleting your information only show when `formUrl` is set. Update it if hosting, email, or the form provider changes.
- `/blog/` blog index and `/blog/batch-film-instagram-reels-medical-clinic/` (article text is Wyatt's, verbatim; hand-written HTML, not Markdown, so quotes stay as written)
- `404.html` (noindex)

`/work/` doesn't exist yet. Add it (and a nav link and a sitemap entry) once there's real, approved media.

## Where things live
- Facts used on several pages (email, Instagram, form URL, services, steps, article meta): `src/data/site.ts`. An empty value hides that element everywhere.
- Header, footer, meta tags, OG image, JSON-LD slot: `src/layouts/Base.astro`.
- Content-Security-Policy: `security.csp` in `astro.config.mjs`. Astro writes the `<meta>` tag and hashes its own scripts and styles. CSP doesn't run under `npm run dev`; check it with `npm run build && npm run preview`. Known limit: browsers without `style-src-attr` (Safari before 15.4, Firefox before 108) block the inline `style=""` layout. Accepted for launch.
- Light ribbon: `src/scripts/ribbon.js`. Add `?motion=on` to a URL to preview it with Reduce Motion on.
- Sitemap: `public/sitemap.xml` is hand-written. Add every new indexable page to it.
- Brand kit (official, 2026-11-24) lives in `brand/logos/` (gitignored). Its pink was shifted from the kit's magenta to `#EB0352` with a hue/value remap that only touches magenta pixels; the untouched originals are in `brand/logos/original-kit/`. The kit notes are in `brand/BRAND_REFERENCE.txt`. Palette: pink `#EB0352`, off-white `#FAF9F6`, silver `#D9D9D9`, charcoal `#332F30`, black; no gold or blue. Header logo `src/assets/logo.png` is `logo-primary-dark.png` trimmed to its edges (opaque black background, so it only sits on black). `public/og.png` (1200×630, logo 780px wide on black) comes from the same file; `public/favicon.png` (96px) and `public/apple-touch-icon.png` (180px) are `logo-monogram-dark.png` padded square on black. All were made with `sharp`, which strips metadata. Strip EXIF from any new photo before committing: the repo is public.

## Contact form (Google Apps Script)
The form posts to a web app bound to a Google Sheet in Wyatt's **personal** Google account. Source: `apps-script/Code.gs`.

Until `formUrl` is set, `/contact/` is email-first (an "Email me" button and a what-to-include list).

First deploy, in an incognito window signed in to the personal Gmail only. Never the arcmedicalcenter.com account: the repo sits in that Workspace Drive, but leads must not, and `/privacy/` says they go to the personal account.
1. Create a Sheet ("Dawe Digital leads"). Put this header row in row 1: Date, Name, Email, Business, Message, Flag, Service, Timing. Select columns B to H and choose Format → Number → Plain text, so a budget like "$500" or a date like "3/15" stays as typed. Then Extensions → Apps Script. Paste `Code.gs`. Save.
2. Run `authorize` once and approve the "unverified app" warning.
3. Deploy → New deployment → type **Web app**. Execute as **Me**, Who has access **Anyone**. Deploy.
4. Copy the URL ending in `/exec` into `formUrl` in `src/data/site.ts`. Deploy the script first, then set `formUrl`. An older deployment silently drops `service` and `timing`.
5. Send two test inquiries, one with Timing `=1+1` and one with `+500`. Both should arrive by email and appear in the Sheet. If the Plain-text cells show a leading `'`, that's the formula guard in `sheetSafe_` and it's harmless.

The `service` value is checked against `SERVICES` in `Code.gs`, which must match the `<select>` options on `/contact/`. Anything else is saved as blank. `service` and `timing` are not required on the server, so a submission without them still saves.

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
