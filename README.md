# Legacy Studio Rwanda

Full-stack website for **Legacy Studio**, a creative photography and media production company based in Kacyiru, Kigali, Rwanda.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **MongoDB (Mongoose)** and **Cloudinary**.

## Features

### Public site
- **Home** — hero, about, services, featured portfolio, process, why-us, CTA
- **Services** — all eight service types and the studio's working process
- **Packages** — Indoor, Outdoor and Wedding packages with full pricing (from the company profile)
- **Portfolio** — an immersive, full-bleed gallery experience: Lenis smooth scroll, GSAP parallax, Framer Motion reveals, and an editorial mix of grid layouts (full-bleed, panoramic, staggered duos/trios, asymmetric splits, masonry) with a keyboard-navigable lightbox. Images served responsively from Cloudinary (`f_auto,q_auto`, content-aware crops)
- **Booking** — booking request form saved to MongoDB
- **Contact** — contact form saved to MongoDB + studio details and map

### Admin dashboard (`/admin`)
- JWT cookie authentication (protected by middleware)
- **Overview** — booking / message / image counts and recent activity
- **Bookings** — view details, change status (pending → confirmed → completed / cancelled), delete
- **Messages** — read/unread, reply via email, delete
- **Gallery** — upload images to Cloudinary, assign to a collection, categorize, mark featured, filter by collection, delete
- **Collections** — create/rename albums, set category & display order, publish/unpublish

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your credentials
npm run seed                 # create the initial admin account
npm run dev                  # http://localhost:3000
```

### Environment variables

See [`.env.example`](.env.example). You need:

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB` | Database name (default `legacystudio`) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name exposed to the client |
| `JWT_SECRET` | Secret used to sign admin session tokens |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin credentials |

> ⚠️ `.env.local` is git-ignored. Never commit real secrets. If credentials were ever shared in plain text, rotate them.

### Admin login

After running `npm run seed`, sign in at `/admin/login` with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env.local`.

## Project structure

```
src/
  app/
    (site)/        Public pages (Navbar + Footer layout)
    admin/         Admin login + dashboard (route group (dash))
    api/           Route handlers (public + admin, auth)
  components/      UI + admin components
  lib/             db, cloudinary, auth, content (studio data)
  models/          Mongoose models: Booking, GalleryImage, ContactMessage, Admin
  middleware.ts    Protects /admin and /api/admin
scripts/
  seed-admin.mjs   Creates/updates the admin account
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run seed` | Create / update the admin account |
| `npm run upload-gallery` | Upload PDF-extracted photos to Cloudinary + MongoDB (resumable) |
| `npm run harvest` | Collect image URLs from external galleries (headless Chrome) |
| `npm run download-images` | Download gallery images via the browser session |
| `npm run import-collections` | Upload downloaded images to Cloudinary + MongoDB as collections |
| `npm run lint` | Run ESLint |

## Importing portfolio photos

**Studio Portfolio (125 photos)** was imported from the company-profile PDF:

```bash
python scripts/pdf_extract.py      # extracts + downscales photos to .extracted/ with a manifest
npm run upload-gallery             # uploads to Cloudinary and registers them in MongoDB
```

**Client collections** (e.g. Pre-Wedding, Fed Rwanda, Cainergy) were sourced from external
Pixieset galleries using headless Chrome (`puppeteer-core` + the installed Chrome):

```bash
npm run harvest            # collect image URLs per collection -> .extracted/harvest/*.json
npm run download-images    # download full-res images via the gallery's browser session
npm run import-collections # upload to Cloudinary + create Collection docs + tag images
```

Notes:
- Pixieset blocks server-side hotlinking, so images are captured by **intercepting the
  gallery's own image responses** (a high `deviceScaleFactor` forces the `xlarge` variants).
- `pdf_extract.py` needs `PyMuPDF` and `Pillow`. All uploaders are resumable via progress
  files under `.extracted/`.
- Google Photos shared albums don't expose stable image URLs this way and aren't supported.
- Collections, categories and covers can be refined in the admin **Collections** / **Gallery**.

## Print lookbook (PDF portfolio)

Generate a 16:9 print/share lookbook (`Legacy-Studio-Portfolio.pdf`) from the best
client-gallery photos — styled after the company-profile deck (charcoal + gold, outlined
display type, full-bleed photo spreads):

```bash
npm run lookbook
```

This runs `scripts/lookbook-select.mjs` → `-build.mjs` → `-render.mjs`: curate + download a
high-res subset from Cloudinary, generate the HTML, and render it to PDF with headless
Chrome. Output lands in `.pdfwork/` (git-ignored).

## Deployment

Deploys cleanly to **Vercel**. Add the environment variables from `.env.example` in the project settings, then run the seed script once (locally against the production database) to create the admin account.

---

© Legacy Studio. KG 3 AVE Kacyiru, Kigali · info@mylegacystudio.com · (250) 788 202 813
