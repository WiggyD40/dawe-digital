// @ts-check
import { defineConfig } from 'astro/config';

// The contact form posts to Google Apps Script, which redirects to googleusercontent.com.
const formHosts = 'https://script.google.com https://script.googleusercontent.com';

export default defineConfig({
  site: 'https://dawedigital.com',
  trailingSlash: 'always',
  security: {
    // Astro emits the CSP <meta> and hashes the scripts and styles it bundles.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "media-src 'self'",
        `connect-src 'self' ${formHosts}`,
        `form-action ${formHosts}`,
        "base-uri 'self'",
        "object-src 'none'",
        'upgrade-insecure-requests',
      ],
      // Hashes make browsers ignore 'unsafe-inline', so allow it for style="" attributes only.
      styleDirective: { resources: [{ resource: "'unsafe-inline'", kind: 'attribute' }] },
    },
  },
});
