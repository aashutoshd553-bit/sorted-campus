# SORTED | Campus Marketplace

SORTED is a direct student-to-student peer marketplace designed for college communities to buy and sell textbooks, electronics, academic equipment, and hostel essentials safely on campus.

## Features

- Student Authentication: Email and password authentication with institutional campus credentials powered by Supabase.
- Marketplace Catalog: Search items by keyword, filter by categories, and browse campus listings.
- Item Listings: Create listings with title, condition, category, description, price (INR), campus location, and photo upload.
- Seller Management: Mark items as sold, relist active items, or permanently delete listings from the account dashboard.
- Safe Handover Protocol: Built for in-person campus handovers with built-in safety guidelines.
- Compliance: Privacy Policy and Terms and Conditions pages included.

## Local Setup

1. Install dependencies:
   `npm install`
2. Create environment variables file `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL=your-supabase-url`
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key`
3. Execute SQL migrations in the Supabase SQL Editor:
   - Run `supabase/migrations/202610230001_initial_schema.sql` (Tables, RLS policies, storage bucket)
   - Run `supabase/migrations/202610230002_seed_data.sql` (Categories, colleges seed, storage public read access)
4. Start the development server:
   `npm run dev`
5. Open `http://localhost:3000` in your web browser.

## Commands

- `npm run dev`: Start the Next.js development server
- `npm run build`: Build optimized production bundle
- `npm run start`: Run production server
- `npm run lint`: Run ESLint check

## Custom Domain and Production Deployment Guide

When launching the website with a custom domain (e.g. `sortedcampus.com`):

1. **Deploy to Vercel or Hosting Platform:**
   - Connect your GitHub repository to Vercel (or preferred host).
   - In Project Settings -> Environment Variables, add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

2. **Connect Custom Domain:**
   - In Vercel -> Project Settings -> Domains:
     - Add your apex domain (e.g. `yourdomain.com`) and `www.yourdomain.com`.
   - In your DNS provider (Cloudflare, Namecheap, GoDaddy):
     - Add an `A` record pointing `@` to `76.76.21.21` (or provider IP).
     - Add a `CNAME` record pointing `www` to `cname.vercel-dns.com`.

3. **Update Supabase Authentication Settings:**
   - In Supabase Dashboard -> Authentication -> URL Configuration:
     - Update **Site URL** from `http://localhost:3000` to your production domain: `https://yourdomain.com`.
     - In **Redirect URLs**, add: `https://yourdomain.com/**` and `https://yourdomain.com/auth/callback`.
