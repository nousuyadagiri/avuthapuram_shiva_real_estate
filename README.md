# AVUTHAPURAM SHIVA REAL ESTATE — Corporate Website

Corporate web platform for **AVUTHAPURAM SHIVA REAL ESTATE**, founded by **Avuthapuram Shiva**, specializing in open plot buying, open plot selling, and residential land properties in **Ibrahimpatnam, Janardhan, Telangana, India**.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React (`lucide-react`)
- **Database & Storage (Recommended)**: Supabase (PostgreSQL + Storage Bucket)
- **Deployment**: Vercel

---

## Routes Overview

| Route | Purpose |
| --- | --- |
| `/` | Home page — Hero, specializations, featured properties, Why Choose Us, Services, Location Highlights |
| `/about` | About AVUTHAPURAM SHIVA REAL ESTATE, founder Avuthapuram Shiva, vision, mission, accuracy standards |
| `/properties` | Searchable & filterable open plot catalog |
| `/properties/[slug]` | Individual plot detail page with gallery, specification table, documentation status, WhatsApp & enquiry form |
| `/services` | Open Plot Buying Assistance, Open Plot Selling Assistance, Property Information, Site Visit Coordination |
| `/contact` | Configurable contact details, click-to-call, WhatsApp integration, validated consultation form |
| `/admin/login` | Server-verified admin login (`noindex, nofollow`) |
| `/admin` | Protected admin dashboard for property CRUD, image upload, status/price updates, and enquiry management |
| `/sitemap.xml` | Dynamic XML sitemap |
| `/robots.txt` | Crawler directives (disallowing `/admin` and `/api/admin/`) |

---

## Environment Variables

Copy `.env.example` to `.env.local` for local development, or configure these in **Vercel Project Settings -> Environment Variables**:

### Public Configuration (`NEXT_PUBLIC_*`)
- `NEXT_PUBLIC_SITE_URL` — Canonical production URL (e.g., `https://www.avuthapuramshivarealestate.com`). Used for canonical links, Open Graph URLs, `sitemap.xml`, and `robots.txt`.
- `NEXT_PUBLIC_PHONE` — Verified business phone number for click-to-call (`tel:`).
- `NEXT_PUBLIC_WHATSAPP` — Digits-only WhatsApp number with country code (e.g., `919XXXXXXXXX`).
- `NEXT_PUBLIC_EMAIL` — Verified business email address.
- `NEXT_PUBLIC_OFFICE_ADDRESS` — Verified street address in Ibrahimpatnam, Janardhan, Telangana.
- `NEXT_PUBLIC_SOCIAL_INSTAGRAM`, `NEXT_PUBLIC_SOCIAL_LINKEDIN`, `NEXT_PUBLIC_SOCIAL_FACEBOOK`, `NEXT_PUBLIC_SOCIAL_YOUTUBE` — Optional social URLs (hidden automatically when blank).
- `GOOGLE_SITE_VERIFICATION` — Verification token for Google Search Console (`meta name="google-site-verification"`).

### Server-Only Variables (Never prefix with `NEXT_PUBLIC_`)
- `SUPABASE_URL` — Your Supabase project URL (`https://<project-ref>.supabase.co`).
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase Service Role key used strictly inside Server Components and API Route Handlers.
- `SUPABASE_STORAGE_BUCKET` — Storage bucket name for property images (defaults to `property-images`).
- `ADMIN_EMAIL` — Admin sign-in email.
- `ADMIN_PASSWORD` — Strong admin password.
- `ADMIN_SESSION_SECRET` — Random 32+ character hex secret for HMAC-SHA256 signing of `HttpOnly` session cookies (`openssl rand -hex 32`).

> **Preview Mode Behavior:** When `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are omitted, the public site renders clearly marked **Sample Development Listings** and validation/UI flows run in read-only preview mode without falsely claiming database persistence.

---

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and execute [`supabase/schema.sql`](./supabase/schema.sql). This creates:
   - `public.properties`
   - `public.enquiries`
   - `updated_at` triggers and Row Level Security policies
   - Public `property-images` storage bucket
3. Copy your **Project URL** and **Service Role Key** into `.env.local` (or Vercel Environment Variables).
4. Once connected, sign in at `/admin/login` to add real verified listings, upload plot images, and unpublish or replace sample entries.

---

## Local Development & Verification

```bash
npm install
npm run dev
```

Verify TypeScript, ESLint, and production build:

```bash
npx tsc --noEmit && npm run lint && npm run build
```

---

## Vercel Deployment & Custom Domain

1. Push the repository to GitHub / GitLab / Bitbucket.
2. Import the repository in **Vercel** (`Framework Preset: Next.js`).
3. Add all environment variables from `.env.example` in **Settings -> Environment Variables** (`Production` and `Preview`).
4. Deploy.
5. **Custom Domain Support**:
   - In Vercel **Settings -> Domains**, add your apex and `www` domain (e.g., `avuthapuramshivarealestate.com` and `www.avuthapuramshivarealestate.com`).
   - Update your DNS `A` / `CNAME` records as instructed by Vercel.
   - Set `NEXT_PUBLIC_SITE_URL` to your primary canonical HTTPS domain and redeploy so `sitemap.xml`, `robots.txt`, and canonical tags reflect it.
6. **Google Search Console Readiness**:
   - Set `GOOGLE_SITE_VERIFICATION` to the HTML meta tag token provided by Search Console.
   - Submit `https://<your-domain>/sitemap.xml` in Google Search Console.
