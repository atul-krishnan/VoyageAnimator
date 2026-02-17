# Voyagraph

Voyagraph is a Next.js + TypeScript web product for cinematic travel route storytelling.
Phase 1 includes:

- Extended marketing site (`/`, `/maps`, `/models`, `/plans`, `/about`, `/hub`, legal pages)
- Interactive studio demo (`/studio`) with Mapbox route editing and deck.gl 3D playback
- Waitlist funnel with Supabase storage
- Google auth via Supabase OAuth for cloud route saves
- Consent-aware PostHog analytics
- Unit/component/E2E test scaffolding

## Tech Stack

- Next.js App Router
- Tailwind CSS v4
- GSAP
- Mapbox GL JS + deck.gl `ScenegraphLayer`
- Supabase (`@supabase/supabase-js`)
- Local MDX hub content
- Vitest + Testing Library + Playwright

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- optional PostHog keys

3. Run development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Database Setup (Supabase)

Run the SQL in `supabase/schema.sql` in your Supabase project SQL editor.

## Scripts

- `npm run lint`
- `npm run test`
- `npm run test:coverage`
- `npm run test:e2e`

## Notes

- Studio demo is interactive playback only (no production video export in phase 1).
- 3D assets and licenses are documented in `docs/assets/LICENSES.md`.
# VoyageAnimator
