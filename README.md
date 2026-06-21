# Legacy Studio Rwanda

Full-stack website for **Legacy Studio**, a creative photography and media production company based in Kacyiru, Kigali, Rwanda.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **MongoDB (Mongoose)** and **Cloudinary**.

## Features

### Public site
- **Home** — hero, about, services, featured portfolio, process, why-us, CTA
- **Services** — all eight service types and the studio's working process
- **Packages** — Indoor, Outdoor and Wedding packages with full pricing (from the company profile)
- **Portfolio** — filterable image gallery with lightbox (images served from Cloudinary)
- **Booking** — booking request form saved to MongoDB
- **Contact** — contact form saved to MongoDB + studio details and map

### Admin dashboard (`/admin`)
- JWT cookie authentication (protected by middleware)
- **Overview** — booking / message / image counts and recent activity
- **Bookings** — view details, change status (pending → confirmed → completed / cancelled), delete
- **Messages** — read/unread, reply via email, delete
- **Gallery** — upload images to Cloudinary, categorize, mark featured, delete

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
| `npm run upload-gallery` | Upload extracted photos to Cloudinary + MongoDB (resumable) |
| `npm run lint` | Run ESLint |

## Importing portfolio photos

The initial portfolio (125 photos) was imported from the company-profile PDF:

```bash
python scripts/pdf_extract.py      # extracts + downscales photos to .extracted/ with a manifest
npm run upload-gallery             # uploads to Cloudinary and registers them in MongoDB
```

`pdf_extract.py` needs `PyMuPDF` and `Pillow`. The uploader is resumable — progress is
saved to `.extracted/uploaded.json`, so re-running after a network drop won't re-upload.
Categories are inferred from page text and can be refined in the admin Gallery.

## Deployment

Deploys cleanly to **Vercel**. Add the environment variables from `.env.example` in the project settings, then run the seed script once (locally against the production database) to create the admin account.

---

© Legacy Studio. KG 3 AVE Kacyiru, Kigali · info@mylegacystudio.com · (250) 788 202 813
