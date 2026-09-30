# Arun Jamuna & Co. — CA Firm Website

A complete, static, premium Chartered Accountant firm website built with plain HTML5, CSS3 and vanilla JavaScript (ES6+). No frameworks, no build step, no backend — ready to upload directly to any static host, including GoDaddy shared hosting.

---

## 1. Folder Structure

```
ca-firm-website/
├── index.html
├── about.html
├── services.html
├── industries.html
├── team.html
├── insights.html
├── faq.html
├── contact.html
├── privacy-policy.html
├── terms.html
├── contact-handler.php   (makes the contact form actually send email — see Section 5)
│
├── css/
│   ├── style.css        (design system + components)
│   └── responsive.css   (breakpoints: 1440/1280/1024/768/425/375/320)
│
├── js/
│   └── script.js        (navigation, FAQ, counters, form validation, etc.)
│
├── images/
│   ├── logo.png
│   ├── hero.jpg
│   ├── about.jpg
│   ├── team/             (6 placeholder photos)
│   └── services/         (7 placeholder photos)
│
└── assets/
    └── icons/            (reserved for any custom icon assets)
```

Icons are loaded from the Font Awesome CDN, and fonts (Fraunces + Inter) from Google Fonts — both referenced with relative-safe absolute CDN URLs, so no local font/icon files are required.

---

## 2. Replacing Firm Information

Search each HTML file for these placeholder markers and replace them with real details:

The firm's real details (name, registration numbers, partners, offices, phone/email) have already
been filled in throughout this site from the firm's profile document. Only the items below are
still placeholders and need your input before go-live:

| Placeholder | Where it appears |
|---|---|
| `[LINKEDIN URL]` / `[INSTAGRAM URL]` / `[FACEBOOK URL]` | footer (all pages) — not provided in the firm profile |
| `[GOOGLE MAP EMBED]` | contact.html — replace with a real Google Maps iframe for the Head Office |
| `[DATE]` | privacy-policy.html, terms.html — set the actual "last updated" date |
| `https://www.yourdomain.com/` | `<link rel="canonical">` and Open Graph tags in every page `<head>` — set to the real live domain once purchased |
| Team photographs | `images/team/partner-1.jpg` through `partner-4.jpg` — currently placeholders |

Already filled in for you (no action needed unless something changes):

| Item | Value | Where it appears |
|---|---|---|
| Firm name | Arun Jamuna & Co. | every page, header, footer, titles |
| FRN | 130080W | about.html |
| RBI Empanelment (UCN) | 956471, Category II | about.html, index.html, services.html |
| CAG Empanelment | WR3995 | about.html, services.html |
| Peer Review Cert. No. | 016933 | about.html |
| Head Office phone | +91 98337 33433 | footer (all pages), contact.html |
| Head Office email | arun.maurya@icai.org | footer (all pages), contact.html, contact-handler.php |
| Head Office address | 715, 7th Floor, Vashi Infotech Park, Sector 30A, Vashi, Navi Mumbai, Maharashtra - 400703 | footer (all pages), contact.html |
| New Delhi branch | Plot No. 31/34/433, Shop No. 52, Agarwal Chamber, Veer Savarkar, Shakarpur, New Delhi – 110092 · +91 87086 53412 · caranveer007@gmail.com | contact.html |
| Thane (Mira Road) branch | Shop No. 08, Apurva Shanti Nagar CHS Ltd, B-12, Shanti Nagar, Sector 7, Mira Road East, Thane – 401107 · +91 90286 64117 · caanitaandcompany@gmail.com | contact.html |
| WhatsApp number | 91 98337 33433 | js/script.js `SITE_CONFIG.WHATSAPP_NUMBER` |
| Partners | CA Arun Kumar, CA Aakriti Choudhary, CA Randhir Singh, CA Anita Amit Maurya | team.html |

The firm name "ARUN JAMUNA & CO." and tagline "CHARTERED ACCOUNTANTS" appear in the header/footer brand block on every page (`.brand-name` / `.brand-sub`). Do a project-wide find-and-replace for "ARUN JAMUNA & CO." / "Arun Jamuna & Co." if renaming the firm — it appears in the visible brand, the page `<title>` tags, meta descriptions, and the footer copyright line.

---

## 3. Replacing Images

All images have been generated as branded navy/gold graphic placeholders that match the site's
design system — abstract compositions with a relevant icon (shield for audit, receipt for
tax/GST, book for accounting, building for corporate, pie chart for advisory, people for client
relationships) and a captioned label, sized correctly for each slot. The four team images are
monogram-avatar cards (initials in a gold ring) for the real partners rather than stock photos.
Replace all of them with real photography before launch.

| File | Recommended size | Used on |
|---|---|---|
| `images/logo.png` | 256×256px, transparent PNG | favicon, can also be swapped into `.brand-mark` |
| `images/hero.jpg` | ~1000×1250px (4:5) | Homepage hero |
| `images/about.jpg` | ~900×1125px (4:5) | Homepage & About page |
| `images/services/*.jpg` | ~900×650px (16:11) | Services page sections, homepage "Why Choose Us" |
| `images/team/partner-1.jpg` to `partner-4.jpg` | ~640×800px (4:5) | Team page — CA Arun Kumar, CA Aakriti Choudhary, CA Randhir Singh, CA Anita Amit Maurya, in that order |

To replace: keep the same filenames and aspect ratios for a clean drop-in, or update the filenames and adjust the `src` attributes across the HTML files. Always keep meaningful `alt` text describing the image content for SEO and accessibility — decorative-only images can use `alt=""`.

---

## 4. Configuring WhatsApp

Open `js/script.js` and edit the single configuration block near the top:

```js
const SITE_CONFIG = {
  WHATSAPP_NUMBER: "919833733433", // full number with country code, digits only
  WHATSAPP_DEFAULT_MESSAGE: "Hello Arun Jamuna & Co., I would like to book a consultation.",
  FORM_ENDPOINT: "FORM_ENDPOINT_HERE"
};
```

Replace `919833733433` with the real WhatsApp number (country code + number, no spaces or symbols). The floating WhatsApp button (bottom-left on every page) and the "WhatsApp Us" button on the Contact page both build their link automatically from this one value — no other file needs editing.

---

## 5. Configuring the Contact Form

The contact form on `contact.html` performs full client-side validation (required fields, email format, phone format, minimum message length) **and** now actually sends the enquiry — it works out of the box on GoDaddy with no third-party account, API key, or extra setup, using a small included PHP script.

### How it works
- The form posts to `contact-handler.php` (also included in this project, in the site root).
- GoDaddy's shared / cPanel hosting plans support PHP and PHP's `mail()` function by default, so as soon as you upload `contact-handler.php` alongside the HTML files, the form is live — nothing to install, no account to create.
- Submissions are sent by email to whatever address you set in the script.
- The form also re-validates everything server-side (never trust client-side validation alone), and includes a hidden honeypot field to quietly filter out basic spam bots.
- If JavaScript is disabled in the visitor's browser, the form still submits normally (a plain POST) and the PHP script redirects back to `contact.html?status=success` or `?status=error`, which the page detects and displays the right message for. With JavaScript enabled (the default), the form submits in the background via `fetch()` and shows the result instantly without a page reload.

### Setup — just one line to edit
Open `contact-handler.php` and set your real destination email address:

```php
const TO_EMAIL = "arun.maurya@icai.org"; // <-- change this to your real inbox
```

That's the only required change. Upload both `contact.html`/`js/script.js` (already configured) and `contact-handler.php` to `public_html/` on GoDaddy, and the form will deliver enquiries straight to that inbox.

> **Note:** Shared-hosting `mail()` delivery can occasionally land in spam folders depending on your domain's SPF/DKIM setup. If you notice enquiries not arriving, check your spam folder first, and consider asking GoDaddy support to confirm SPF/DKIM records are configured for your domain — this is a one-time DNS setting, not a code change.

### Alternative: if your GoDaddy plan doesn't support PHP
A small number of GoDaddy plans (e.g. very basic "website builder" style plans) don't allow custom PHP files. In that case, skip `contact-handler.php` entirely and instead:
1. Sign up for a free hosted form service (e.g. Formspree) and get your unique endpoint URL.
2. In `js/script.js`, change `FORM_ENDPOINT` in `SITE_CONFIG` to that URL.

No other code changes are needed — the same `fetch()` submission logic in `script.js` works with either option, since it simply posts the form data to whichever URL is configured.

Never hardcode API keys or credentials into `script.js` — client-side JavaScript is publicly visible.

---

## 6. Light / Dark Theme Toggle

The site includes a built-in light/dark theme switcher — a circular sun/moon button in the header (desktop) and a "Dark Mode" row in the mobile menu.

- The visitor's choice is remembered (via `localStorage`), so it persists across pages and future visits.
- If a visitor has never toggled it before, the site defaults to their operating system's light/dark preference automatically.
- A small inline script in each page's `<head>` applies the saved/preferred theme *before* the page renders, so there's no flash of the wrong theme on load.
- The brand navy and gold stay the same in both themes — only backgrounds, surfaces, borders and body text invert, so the firm's identity looks consistent either way.
- No configuration is required — it works immediately after upload. If you rebrand the color palette (Section 8 below), the dark-theme variable overrides are grouped together at the top of `css/style.css` under `html[data-theme="dark"]` for easy adjustment.

## 7. GoDaddy Deployment (Step-by-Step)

1. Log in to your GoDaddy hosting account and open **File Manager** (or connect via FTP/SFTP using an FTP client such as FileZilla).
2. Navigate to the `public_html/` directory (this is the web root for your primary domain).
3. Upload the **entire contents** of the `ca-firm-website/` folder (not the folder itself — its contents: `index.html`, `css/`, `js/`, `images/`, `assets/`, and the other HTML files) directly into `public_html/`.
4. Confirm the folder structure on the server matches:
   ```
   public_html/
   ├── index.html
   ├── about.html
   ├── ... (other pages)
   ├── css/
   ├── js/
   └── images/
   ```
5. Visit your domain in a browser — the homepage should load automatically from `index.html`.
6. No build command, no npm install, no Node.js server and no database are required — this is a fully static deployment.

---

## 8. Final Go-Live Checklist

- [ ] Replace all `[BRACKETED]` placeholders with real firm details
- [ ] Replace placeholder images with real, licensed photography
- [ ] Set the real `WHATSAPP_NUMBER` in `js/script.js`
- [ ] Set `TO_EMAIL` in `contact-handler.php` to your real inbox (this is the only step needed to make the contact form send email on GoDaddy)
- [ ] Send yourself a test enquiry after upload to confirm delivery (check spam folder too)
- [ ] Replace `[GOOGLE MAP EMBED]` in `contact.html` with a real Google Maps `<iframe>` embed
- [ ] Replace sample testimonials with real, verified client feedback
- [ ] Replace team names/photos/bios with accurate, verified information
- [ ] Update `<link rel="canonical">` and Open Graph URLs in every page `<head>` to your real domain
- [ ] Update social links (LinkedIn/Instagram/Facebook) in the footer
- [ ] Test every navigation link, the mobile menu, FAQ accordion, counters, and form validation after upload
- [ ] Check the site on a real mobile device for layout and touch-target sizing
- [ ] Submit the site to Google Search Console and add a real `sitemap.xml` / `robots.txt` if desired

---

## 9. Technical Notes

- Pure HTML5 / CSS3 / vanilla ES6+ JavaScript — no React, Vue, Angular, PHP, Node.js, or database.
- CSS variables define the entire design system in `css/style.css` (`:root`) — update `--primary`, `--secondary`, etc. to rebrand colors globally.
- All JavaScript is organized into named `init...()` functions called once on `DOMContentLoaded` (see `js/script.js`).
- Animations respect `prefers-reduced-motion`.
- All images use `loading="lazy"` except the hero image, which loads eagerly.
