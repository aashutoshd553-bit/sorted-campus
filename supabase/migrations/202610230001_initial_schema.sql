create extension if not exists "pgcrypto";

create type public.listing_condition as enum ('like_new', 'good', 'fair');
create type public.listing_status as enum ('active', 'sold', 'archived', 'removed');
create type public.report_reason as enum ('spam', 'prohibited_item', 'misleading', 'unsafe', 'harassment', 'other');

create table public.colleges (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  city text not null,
  state text,
  email_domains text[] not null default '{}',
  created_at timestamptz not null default now()
);
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 80),
  college_id uuid references public.colleges(id) on delete set null,
  city text,
  avatar_url text,
  is_student_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.user_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role text not null check (role in ('admin', 'moderator')),
  created_at timestamptz not null default now()
);
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  sort_order smallint not null default 0,
  is_active boolean not null default true
);
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  college_id uuid references public.colleges(id) on delete set null,
  title text not null check (char_length(title) between 3 and 120),
  description text not null check (char_length(description) between 10 and 5000),
  price_inr integer not null check (price_inr >= 0 and price_inr <= 10000000),
  condition public.listing_condition not null,
  city text not null check (char_length(city) between 2 and 80),
  status public.listing_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sold_at timestamptz
);
create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null unique,
  alt_text text,
  sort_order smallint not null default 0 check (sort_order between 0 and 9),
  created_at timestamptz not null default now(),
  unique (listing_id, sort_order)
);
create table public.wishlists (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz,
  primary key (conversation_id, user_id)
);
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete cascade,
  reason public.report_reason not null,
  details text check (char_length(details) <= 1000),
  created_at timestamptz not null default now(),
  check (num_nonnulls(listing_id, reported_user_id) = 1)
);
create unique index reports_one_per_listing on public.reports(reporter_id, listing_id) where listing_id is not null;
create unique index reports_one_per_user on public.reports(reporter_id, reported_user_id) where reported_user_id is not null;
create index listings_discovery_idx on public.listings(status, college_id, category_id, created_at desc);
create index listings_city_idx on public.listings(status, city, created_at desc);
create index listings_search_idx on public.listings using gin (to_tsvector('simple', title || ' ' || description));
create index messages_conversation_idx on public.messages(conversation_id, created_at);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin') $$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Student')); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger profiles_updated_at before update on public.profiles for each row execute procedure public.touch_updated_at();
create trigger listings_updated_at before update on public.listings for each row execute procedure public.touch_updated_at();
create trigger conversations_updated_at before update on public.conversations for each row execute procedure public.touch_updated_at();

alter table public.colleges enable row level security; alter table public.profiles enable row level security; alter table public.user_roles enable row level security; alter table public.categories enable row level security; alter table public.listings enable row level security; alter table public.listing_images enable row level security; alter table public.wishlists enable row level security; alter table public.conversations enable row level security; alter table public.conversation_participants enable row level security; alter table public.messages enable row level security; alter table public.reports enable row level security;
create policy "public college directory" on public.colleges for select using (true);
create policy "profile owners update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles visible to signed in users" on public.profiles for select to authenticated using (true);
create policy "categories are readable" on public.categories for select using (is_active or public.is_admin());
create policy "active listings are public" on public.listings for select using (status = 'active' or seller_id = auth.uid() or public.is_admin());
create policy "users create own listings" on public.listings for insert to authenticated with check (seller_id = auth.uid());
create policy "owners update listings" on public.listings for update using (seller_id = auth.uid() or public.is_admin()) with check (seller_id = auth.uid() or public.is_admin());
create policy "owners delete listings" on public.listings for delete using (seller_id = auth.uid() or public.is_admin());
create policy "listing images readable" on public.listing_images for select using (exists (select 1 from public.listings l where l.id = listing_id and (l.status = 'active' or l.seller_id = auth.uid() or public.is_admin())));
create policy "owners manage listing images" on public.listing_images for all using (exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid())) with check (exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid()));
create policy "users manage own wishlist" on public.wishlists for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "participants read conversations" on public.conversations for select using (exists (select 1 from public.conversation_participants cp where cp.conversation_id = id and cp.user_id = auth.uid()));
create policy "participants read participant list" on public.conversation_participants for select using (exists (select 1 from public.conversation_participants mine where mine.conversation_id = conversation_id and mine.user_id = auth.uid()));
create policy "participants read messages" on public.messages for select using (exists (select 1 from public.conversation_participants cp where cp.conversation_id = messages.conversation_id and cp.user_id = auth.uid()));
create policy "participants send messages" on public.messages for insert with check (sender_id = auth.uid() and exists (select 1 from public.conversation_participants cp where cp.conversation_id = messages.conversation_id and cp.user_id = auth.uid()));
create policy "users submit reports" on public.reports for insert with check (reporter_id = auth.uid());
create policy "admins review reports" on public.reports for select using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values ('listing-images', 'listing-images', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']) on conflict (id) do nothing;
create policy "listing image owners upload" on storage.objects for insert to authenticated with check (bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "listing image owners update" on storage.objects for update to authenticated using (bucket_id = 'listing-images' and owner_id = auth.uid()::text) with check (bucket_id = 'listing-images' and owner_id = auth.uid()::text);
create policy "listing image owners delete" on storage.objects for delete to authenticated using (bucket_id = 'listing-images' and owner_id = auth.uid()::text);
