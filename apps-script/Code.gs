/** @OnlyCurrentDoc */
// Contact form handler for dawedigital.com. Bound to the leads Google Sheet.
// Deploy: Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone.
// Update: Manage deployments > pencil > Version: New version. A new deployment changes the URL.

var REQUIRED = ['name', 'email', 'message'];
var FIELDS = ['name', 'email', 'business', 'message', 'service', 'timing'];
// Must match the <select> options on /contact/. Anything else is stored as ''.
var SERVICES = ['Video', 'Photography', 'Social management', 'Website', 'Not sure yet'];
var HONEYPOT = 'contact_me_by_fax_only';
var MIN_MS = 3000; // faster than this (JS path) is a bot
var THANKS_URL = 'https://dawedigital.com/contact/thanks/';

function doPost(e) {
  var p = (e && e.parameter) || {};
  var isJs = p.js === '1';

  if (!isSpam_(p)) {
    var v = {};
    FIELDS.forEach(function (k) { v[k] = clean_(p[k], k === 'message' ? 5000 : k === 'email' ? 320 : 200); });
    // Single-line fields: a newline could fake an extra line (e.g. "Email: ...") in the lead email.
    ['name', 'business', 'timing'].forEach(function (k) { v[k] = v[k].replace(/[\r\n]+/g, ' '); });
    if (SERVICES.indexOf(v.service) < 0) v.service = '';
    // A very fast JS submit is probably a bot but might be autofill: keep it, flagged, without an email.
    var fast = isJs && !(Number(p.elapsed) >= MIN_MS);
    // Save first, so the lead survives even if email fails (quota is 100/day).
    SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
      .appendRow([new Date(), v.name, v.email, v.business, v.message, fast ? 'fast' : '', v.service, v.timing].map(sheetSafe_));
    if (!fast && !flooded_()) {
      try {
        var opts = {};
        if (isEmail_(v.email)) opts.replyTo = v.email;
        MailApp.sendEmail(
          Session.getEffectiveUser().getEmail(),
          ('New lead: ' + (v.name || 'website')).replace(/[\r\n]+/g, ' ').slice(0, 200),
          'Name: ' + v.name + '\nEmail: ' + v.email + '\nBusiness: ' + v.business +
            '\nNeeds: ' + v.service + '\nTiming/budget: ' + v.timing + '\n\n' + v.message,
          opts
        );
      } catch (err) {
        console.error(err);
      }
    }
  }

  // Spam gets the same answer as a real lead, so bots learn nothing. Nothing typed is echoed back.
  if (isJs) {
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  }
  return HtmlService.createHtmlOutput(
    '<p style="font:18px system-ui,sans-serif">Thanks, your message is in. ' +
    '<a href="' + THANKS_URL + '" target="_top">Back to Dawe Digital</a></p>'
  ).setTitle('Message sent');
}

function isSpam_(p) {
  if (p[HONEYPOT]) return true;
  return REQUIRED.some(function (k) { return !clean_(p[k]); });
}

// More than 20 posts in 10 minutes = a flood: rows still save, emails stop, so the daily quota survives.
function flooded_() {
  var cache = CacheService.getScriptCache();
  var n = Number(cache.get('posts') || 0) + 1;
  cache.put('posts', String(n), 600); // shortcut: window restarts on each write, fine at this volume
  return n > 20;
}

function clean_(s, max) {
  return String(s == null ? '' : s).trim().slice(0, max || 5000);
}

// A leading = + - @ tab or CR would run as a formula in the Sheet.
function sheetSafe_(x) {
  return typeof x === 'string' && /^[=+\-@\t\r]/.test(x) ? "'" + x : x;
}

function isEmail_(s) {
  return /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[A-Za-z]{2,}$/.test(s) && s.length <= 320;
}

// Run once from the editor to approve permissions (Sheet + email).
function authorize() {
  SpreadsheetApp.getActiveSpreadsheet();
  MailApp.getRemainingDailyQuota();
}
