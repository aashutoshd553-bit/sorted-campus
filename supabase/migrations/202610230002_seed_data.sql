-- Seed Initial Categories
insert into public.categories (name, slug, sort_order)
values
  ('Books & Notes', 'books-notes', 1),
  ('Electronics', 'electronics', 2),
  ('Bikes & Travel', 'bikes-travel', 3),
  ('Hostel Essentials', 'hostel-essentials', 4),
  ('Academic Tools', 'academic-tools', 5),
  ('Project Kits', 'project-kits', 6)
on conflict (slug) do nothing;

-- Seed Popular Indian Colleges & Campuses
insert into public.colleges (name, city, state, email_domains)
values
  ('IIT Delhi', 'New Delhi', 'Delhi', array['iitd.ac.in']),
  ('Delhi Technological University (DTU)', 'Delhi', 'Delhi', array['dtu.ac.in']),
  ('Netaji Subhas University of Technology (NSUT)', 'Delhi', 'Delhi', array['nsut.ac.in']),
  ('University of Delhi - North Campus', 'Delhi', 'Delhi', array['du.ac.in']),
  ('University of Delhi - South Campus', 'Delhi', 'Delhi', array['south.du.ac.in']),
  ('IIT Bombay', 'Mumbai', 'Maharashtra', array['iitb.ac.in']),
  ('BITS Pilani', 'Pilani', 'Rajasthan', array['pilani.bits-pilani.ac.in']),
  ('IIT Madras', 'Chennai', 'Tamil Nadu', array['iitm.ac.in']),
  ('IIT Kharagpur', 'Kharagpur', 'West Bengal', array['iitkgp.ac.in']),
  ('IIT Roorkee', 'Roorkee', 'Uttarakhand', array['iitr.ac.in']),
  ('NIT Trichy', 'Tiruchirappalli', 'Tamil Nadu', array['nitt.edu'])
on conflict (name) do nothing;

-- Make listing-images bucket public and readable so thumbnails load instantly
update storage.buckets set public = true where id = 'listing-images';

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'public read listing images'
  ) then
    create policy "public read listing images" on storage.objects for select using (bucket_id = 'listing-images');
  end if;
end $$;
