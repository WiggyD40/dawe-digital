// One source for facts used on several pages. An empty string hides that element everywhere.
export const site = {
  name: 'Dawe Digital',
  url: 'https://dawedigital.com',
  /** Public contact address (a +site Gmail alias). Shown on /contact/ only. */
  email: 'daweboy4@gmail.com',
  /** Instagram handle without the @. */
  instagram: '',
  /** Google Apps Script web app URL ending in /exec. Empty = the contact page shows no form. */
  formUrl: '',
  replyTime: "I'll get back to you within 2 business days.",
};

export const ids = {
  business: `${site.url}/#business`,
  person: `${site.url}/#wyatt`,
};

export const services = [
  {
    tag: 'Video',
    name: 'Short-form video & Reels',
    what: 'We plan your Reels together. I film them in focused shoot days and edit them ready to post.',
    who: 'businesses that know they should be posting video and never get to it.',
    get: ['Ideas, hooks, and a shot list planned with you', 'Filming on site, around your schedule', 'Editing with captions, color, and sound', 'Vertical files ready for Reels, TikTok, and Shorts'],
  },
  {
    tag: 'Photo',
    name: 'Photography',
    what: 'Team, space, and product photos that look like your business, not stock.',
    who: 'new websites, menus, launches, and social.',
    get: ['Team and headshot photos', 'Your space, inside and out', 'Product and detail shots', 'Edited files sized for web and social'],
  },
  {
    tag: 'Social',
    name: 'Social content management',
    what: 'I handle the calendar, graphics, carousels, and posting, then send a short monthly report in plain English.',
    who: 'owners who want Instagram and Facebook handled.',
    get: ['A monthly content calendar', 'Graphics and carousels', 'Scheduling and posting to Instagram and Facebook', 'A short monthly report in plain English'],
  },
  {
    tag: 'Web',
    name: 'Website setup',
    what: "No website yet, or one that doesn't look like you anymore? I build a new one or refresh what you have, using the photos and videos I shoot of your business.",
    who: "businesses without a website, or with one that's out of date.",
    get: ['A new site, or a refresh of the one you have', 'Your own photos and videos built in', 'Pages for your services, location, and contact', 'Shaped around what you ask for'],
  },
];

export const steps = [
  { n: 1, name: 'Plan', body: 'We talk goals, pick ideas, and map out the month.' },
  { n: 2, name: 'Shoot day', body: 'I film and photograph on site, around your schedule.' },
  { n: 3, name: 'Edit', body: 'I cut, caption, and color it all. You review it before anything goes live.' },
  { n: 4, name: 'Post & review', body: 'Posts go out on schedule. We look at what worked and plan the next month.' },
];

export const article = {
  path: '/blog/batch-film-instagram-reels-medical-clinic/',
  title: 'How to Batch-Film Instagram Reels for a Medical Clinic',
  description: 'How medical clinics can prepare, organize, and batch-film Instagram Reels that are educational and engaging, without disrupting busy providers.',
  date: '2026-11-20',
  dateLabel: 'November 20, 2026',
};
