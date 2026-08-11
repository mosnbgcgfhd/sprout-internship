# Sprout — internship finder & tracker

A student-facing internship search tool with a kanban board for tracking
applications. Built as a portfolio project: Next.js (App Router) + Supabase
(Postgres + Auth), with a small data pipeline that pulls real internship
listings from free, legal public APIs — no scraping.

## What's in the box

- **Browse & search** (`/`) — filter by keyword, remote/on-site, category.
- **My board** (`/board`) — kanban tracker: saved → applied → interview →
  offer/rejected, drag-and-drop on desktop, dropdown on mobile.
- **Auth** — email magic-link sign-in via Supabase.
- **Data pipeline** (`scripts/`) — pulls from the Adzuna API and any
  Greenhouse/Lever company boards you list, classifies internship-only
  postings, and upserts into Postgres. Meant to run daily via the included
  GitHub Actions workflow.

## Before you run it — things you need to fill in

This is a real, working scaffold, not a mockup, but three things are on
you to configure before it's fully live:

1. **A Supabase project.** Create one free at supabase.com, then run
   `supabase/schema.sql` in its SQL editor. Copy the project URL, anon key,
   and service role key into `.env.local` (see `.env.example`).
2. **An Adzuna account.** Free at developer.adzuna.com — gives you
   `ADZUNA_APP_ID` / `ADZUNA_APP_KEY`.
3. **`scripts/sources/companies.json`.** I seeded it with a handful of
   well-known companies as *examples* of the slug format, but I haven't
   verified each one still has a live Greenhouse/Lever board with
   internship listings today — company ATS setups change often. Swap in
   companies you actually want to track; find a slug from its careers page
   URL (`boards.greenhouse.io/<slug>` or `jobs.lever.co/<slug>`).

## Local setup

```bash
npm install
cp .env.example .env.local   # then fill in the values above
npm run dev                  # http://localhost:3000
```

To pull in real listings:

```bash
npm run fetch:listings
```

## Deploying

- **App:** push to GitHub, import into Vercel, add the same env vars from
  `.env.local` in the Vercel project settings (you don't need the Adzuna
  vars on Vercel itself — those are only used by the fetch script).
- **Daily data refresh:** the repo includes
  `.github/workflows/fetch-listings.yml`, which runs `npm run fetch:listings`
  once a day. Add `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
  `ADZUNA_APP_ID`, and `ADZUNA_APP_KEY` as repo secrets (Settings → Secrets
  and variables → Actions) and it'll run on its own. You can also trigger
  it manually from the Actions tab.

## Why this shape (design decisions worth knowing for an interview)

- **No scraping.** Adzuna and the Greenhouse/Lever public job-board APIs are
  free, documented, and don't violate anyone's ToS — unlike scraping
  LinkedIn/Indeed, which is both fragile and legally gray.
- **No employer self-serve posting in v1.** That's a two-sided marketplace
  problem (you'd need real employer signups to be useful) and was cut
  deliberately to ship something real with a single, working supply path.
  The `listings` table is source-agnostic, so adding an "employer submits a
  listing" form later is additive, not a rewrite.
- **Classification is regex, not ML.** `scripts/classify.mjs` filters for
  internship-shaped titles and excludes senior-sounding ones. It's crude on
  purpose — cheap, explainable, and good enough for a first version. A
  natural v2 upgrade path if you want to talk about it.

## Project structure

```
app/                Next.js App Router pages & API routes
  page.tsx           Browse/search
  board/page.tsx      Kanban board
  login/page.tsx       Magic-link sign in
  api/listings/         Public read API
  api/saved/             Save/update/remove applications
components/          UI components
lib/                 Supabase clients & shared types
scripts/             Data pipeline (Adzuna, Greenhouse, Lever, classifier)
supabase/schema.sql  Full DB schema + row-level security policies
```
