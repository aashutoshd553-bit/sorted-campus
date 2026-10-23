# SORTED

SORTED is a campus marketplace for students to buy and sell useful pre-loved items within their college communities.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Add your Supabase project URL and publishable key to `.env.local`.
4. Run `npm run dev`, then open `http://localhost:3000`.

## Supabase setup

1. Create a new Supabase project.
2. In the Supabase SQL Editor, run `supabase/migrations/202610230001_initial_schema.sql` once.
3. In Authentication settings, configure the Site URL for local development as `http://localhost:3000` and add appropriate redirect URLs for production later.
4. Copy the project URL and publishable key from Supabase's API settings into `.env.local`.

The migration creates the initial database, indexes, image bucket, and Row Level Security policies. Never place a Supabase service-role key in browser-accessible environment variables.

## Commands

- `npm run dev` — start the development server
- `npm run lint` — run ESLint
- `npm run build` — make a production build

## Current scope

Implemented: visual homepage, Supabase session helpers, email/password sign-up and login screens, database foundation, RLS policies, and protected account route.

Next: profile completion, college selection, listing creation/image uploads, browse/search powered by the database, wishlist, messaging, reports, and moderation.
