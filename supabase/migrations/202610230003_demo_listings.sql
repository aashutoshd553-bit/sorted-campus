-- ============================================================
-- SORTED Demo Listings Seed
-- Run this in Supabase SQL Editor AFTER you have created
-- at least one real account and run the initial schema.
-- ============================================================

-- Step 1: Ensure categories exist
INSERT INTO public.categories (name, slug, sort_order)
VALUES
  ('Books & Notes',      'books-notes',       1),
  ('Electronics',        'electronics',        2),
  ('Bikes & Travel',     'bikes-travel',       3),
  ('Hostel Essentials',  'hostel-essentials',  4),
  ('Academic Tools',     'academic-tools',     5),
  ('Project Kits',       'project-kits',       6)
ON CONFLICT (slug) DO NOTHING;

-- Step 2: Seed demo listings using the first registered user account
DO $$
DECLARE
  demo_seller_id uuid;
  books_id        uuid;
  electronics_id  uuid;
  bikes_id        uuid;
  hostel_id       uuid;
  academic_id     uuid;
  project_id      uuid;
  listing_id      uuid;
BEGIN
  -- Pick the first available user as demo seller
  SELECT id INTO demo_seller_id FROM auth.users ORDER BY created_at LIMIT 1;

  IF demo_seller_id IS NULL THEN
    RAISE EXCEPTION 'No user account found. Please create an account first, then re-run this seed.';
  END IF;

  -- Get category IDs
  SELECT id INTO books_id       FROM public.categories WHERE slug = 'books-notes';
  SELECT id INTO electronics_id FROM public.categories WHERE slug = 'electronics';
  SELECT id INTO bikes_id       FROM public.categories WHERE slug = 'bikes-travel';
  SELECT id INTO hostel_id      FROM public.categories WHERE slug = 'hostel-essentials';
  SELECT id INTO academic_id    FROM public.categories WHERE slug = 'academic-tools';
  SELECT id INTO project_id     FROM public.categories WHERE slug = 'project-kits';

  -- ================================================
  -- BOOKS & NOTES (5 items)
  -- ================================================
  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, books_id,
    'Engineering Mathematics by R.K. Jain (3rd Edition)',
    'Covers Calculus, Linear Algebra, Differential Equations, and Probability. Used for 1 semester only. No torn pages, minor pencil underlines on 20 pages which can be erased. All chapters intact. Suitable for B.Tech 1st and 2nd year across all branches.',
    380, 'good', 'New Delhi')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80', 'Engineering Mathematics textbook', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, books_id,
    'Operating Systems – Silberschatz, Galvin & Gagne (10th Edition)',
    'Classic OS textbook in excellent condition. Covers process management, memory management, file systems, and security. No writing or highlighting inside. Original price Rs 750. Selling because course is complete.',
    420, 'like_new', 'New Delhi')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=80', 'Operating Systems textbook', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, books_id,
    'Complete UPSC GS Notes (Handwritten) – Geography + Polity',
    'Well-organized handwritten notes for UPSC Prelims and Mains. Covers Indian Geography (physical, economic, human) and Indian Polity (Constitution, Parliament, Judiciary). Around 300 pages. Clear handwriting, diagrams included.',
    650, 'good', 'Delhi')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80', 'Handwritten study notes', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, books_id,
    'Chemistry NCERT Class 11 & 12 (Set of 4 books)',
    'All four NCERT Chemistry books (Part I and II for both Class 11 and 12). Essential for JEE and NEET preparation. Books are clean, no annotations. Ideal for students appearing for board exams or competitive exams.',
    220, 'like_new', 'Bengaluru')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80', 'NCERT textbook set', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, books_id,
    'Data Structures and Algorithms – Narasimha Karumanchi',
    'Comprehensive DSA book covering arrays, linked lists, trees, graphs, dynamic programming, and sorting algorithms. Includes interview questions. Minor spine wear, content fully intact. Great for placements prep.',
    310, 'fair', 'Pune')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80', 'DSA textbook', 0);

  -- ================================================
  -- ELECTRONICS (5 items)
  -- ================================================
  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, electronics_id,
    'Logitech MK275 Wireless Keyboard and Mouse Combo',
    'Full-size wireless keyboard with silent mouse. Uses single USB nano receiver. Battery life excellent — used only 6 months. Includes original USB receiver and both batteries. Works on Windows and Mac. Quiet keys, ideal for hostel use.',
    900, 'good', 'Mumbai')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80', 'Wireless keyboard and mouse', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, electronics_id,
    'Sony MDR-ZX110 Over-Ear Wired Headphones',
    'Lightweight, foldable headphones with 30mm driver units. Good bass and clear audio for music and online lectures. 3.5mm jack, works with laptop, phone, and tablet. Minor scratch on headband, audio quality unaffected.',
    480, 'good', 'Chennai')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', 'Wired over-ear headphones', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, electronics_id,
    'Dell 22-inch Full HD Monitor (1920x1080, VGA+HDMI)',
    '22-inch LED monitor in working condition. Supports VGA and HDMI input. Brightness and contrast controls on side panel. Minor dust marks on rear panel, screen itself is clean with no dead pixels. Ideal for dual-screen setup during exams.',
    4500, 'fair', 'Hyderabad')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80', 'Dell full HD monitor', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, electronics_id,
    'TP-Link 5-Port Ethernet Switch (100 Mbps)',
    'Compact 5-port wired network switch. Plug and play, no configuration required. Ideal for hostel rooms where multiple devices need a wired connection. All 5 ports tested and working. Power adapter included.',
    350, 'like_new', 'Pune')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', 'Ethernet network switch', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, electronics_id,
    'SanDisk 64GB USB 3.0 Pendrive',
    'High-speed USB 3.0 flash drive with read speeds up to 130 MB/s. 64GB storage. Used to transfer project files and assignment documents. Currently empty and ready to use. Cap included. Compatible with all operating systems.',
    420, 'good', 'Bengaluru')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=600&q=80', 'USB flash drive', 0);

  -- ================================================
  -- BIKES & TRAVEL (5 items)
  -- ================================================
  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, bikes_id,
    'Hero Lectro E3 Electric Cycle (Single Speed)',
    'Electric bicycle with pedal assist. Battery lasts around 25 km on full charge. Tyre pressure and brakes recently serviced. Minor paint scuffs on frame. Ideal for short campus commutes. Charger and key included.',
    9500, 'fair', 'New Delhi')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=600&q=80', 'Electric bicycle on campus', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, bikes_id,
    'Hercules Roadeo A50 MTB Bicycle (21-Speed)',
    '21-speed mountain bike with front suspension fork. Alloy frame and disc brakes. Chain recently lubricated. Tyres in good condition. Suitable for campus roads and light offroad tracks. Height adjustable seat included.',
    4200, 'good', 'Pune')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', 'Mountain bike', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, bikes_id,
    'Wildcraft 30L Backpack (Teal Blue)',
    'Durable 30-litre backpack with laptop compartment (fits up to 15.6 inch), front organizer pocket, and side water bottle holders. Padded shoulder straps. Used for one year. No tears, zippers work smoothly.',
    750, 'good', 'Bengaluru')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', 'Student backpack', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, bikes_id,
    'Steelbird SB-50 Full-Face Bicycle Helmet (Size M)',
    'ISI-certified bicycle helmet with ventilation channels and adjustable retention system. Size medium (fits head circumference 55–58 cm). Minor scuff on visor, structural integrity fully intact. Black colour.',
    520, 'good', 'Chennai')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1604537466158-719b1972feb8?w=600&q=80', 'Bicycle helmet', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, bikes_id,
    'U-Lock Bicycle Lock with 2 Keys',
    'Heavy-duty U-shaped bicycle lock with hardened steel shackle. Resistant to bolt cutters. 2 keys provided. Compatible with most campus bicycle stands. No rust, mechanism operates smoothly.',
    280, 'like_new', 'Delhi')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=600&q=80', 'Bicycle lock', 0);

  -- ================================================
  -- HOSTEL ESSENTIALS (5 items)
  -- ================================================
  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, hostel_id,
    'Philips LED Desk Lamp with USB Charging Port',
    'Eye-care LED desk lamp with 5 brightness levels and 3 colour temperatures. Built-in USB-A port for phone charging. Flexible gooseneck arm. Energy efficient. Used for one academic year. Works perfectly.',
    650, 'good', 'Hyderabad')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', 'LED study lamp', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, hostel_id,
    'Pigeon 1.2L Electric Kettle',
    '1.2 litre stainless steel electric kettle. Auto shut-off when water boils. 1500W for fast boiling. Used daily for 8 months. Heating element in perfect condition. Ideal for making tea, Maggi, or hot water. Cord length 1 metre.',
    420, 'good', 'Mumbai')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1594995846645-2e5e14ada6ef?w=600&q=80', 'Electric kettle', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, hostel_id,
    'Folding Study Table (60x40 cm) with Cup Holder',
    'Portable folding wooden study table. Folds flat for storage under the bed. Cup holder and small storage tray on side. Weight capacity 15 kg. Light scuff on surface, structure solid. Suitable for studying on bed.',
    890, 'fair', 'Pune')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', 'Folding study table', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, hostel_id,
    'Plastic 3-Tier Shelf Storage Rack (Freestanding)',
    'Freestanding 3-tier plastic shelving unit. Each shelf holds up to 10 kg. Dimensions: 60cm wide, 30cm deep, 90cm tall. Easy to assemble without tools. Ideal for clothes, books, or kitchen storage in hostel rooms.',
    580, 'good', 'New Delhi')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', 'Storage shelf rack', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, hostel_id,
    'Extension Board – 5 Sockets + 2 USB Ports (2m cord)',
    'Surge-protected power extension board with 5 universal sockets and 2 USB ports. 2-metre cable. Designed for Indian plugs (3-pin). ISI marked. Ideal for charging laptop, phone, lamp, and fan simultaneously.',
    320, 'like_new', 'Chennai')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', 'Extension power board', 0);

  -- ================================================
  -- ACADEMIC TOOLS (5 items)
  -- ================================================
  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, academic_id,
    'Casio fx-991CW Scientific Calculator',
    'Latest Casio scientific calculator with 570+ functions including spreadsheet, QR code generation, and equation solving. Clear display. Used for 2 semesters. No scratches on screen. Permitted in most university examinations.',
    1100, 'good', 'New Delhi')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=600&q=80', 'Scientific calculator', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, academic_id,
    'Staedtler Mars 964 Geometry Box Set',
    'Complete technical drawing set: compass, divider, ruler, set squares (30/60 and 45 degrees), protractor, and mechanical pencil. Stored in original metal tin. Ideal for Engineering Drawing and Mathematics courses.',
    380, 'like_new', 'Bengaluru')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80', 'Geometry box and tools', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, academic_id,
    'Helix Technical Drawing Board (A2 Size)',
    'A2-size technical drawing board with T-square track and parallel motion bar. Smooth drawing surface. Portable with carry handle. Used for Engineering Graphics course (one semester). Surface clean and unscratched.',
    1400, 'good', 'Hyderabad')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', 'Technical drawing board', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, academic_id,
    'Rotring 500 0.5mm Mechanical Pencil',
    'Professional drafting pencil with knurled metal grip and lead indicator window. 0.5mm lead size. Comes with one spare eraser and extra leads. Preferred by Engineering Drawing and Architecture students.',
    480, 'like_new', 'Chennai')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80', 'Drafting mechanical pencil', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, academic_id,
    'Vernier Caliper – 150mm Digital (0.01mm resolution)',
    'Digital vernier caliper with LCD display. Measures OD, ID, depth, and step. Metric and imperial units. Battery (LR44) included. Used for Metrology lab practicals. Calibrated and measuring accurately.',
    620, 'good', 'Pune')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80', 'Digital vernier caliper', 0);

  -- ================================================
  -- PROJECT KITS (5 items)
  -- ================================================
  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, project_id,
    'Arduino Uno R3 Starter Kit with Breadboard & Components',
    'Includes: Arduino Uno R3 board, 400-point breadboard, USB cable, LEDs (assorted), resistors, push buttons, LDR, temperature sensor (LM35), 9V battery connector, and 30-piece jumper wire set. All components functional. Ideal for first-year embedded systems projects.',
    1200, 'good', 'Bengaluru')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&q=80', 'Arduino starter kit', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, project_id,
    'Raspberry Pi 4 Model B (4GB RAM) with Power Supply',
    'Raspberry Pi 4 Model B with 4GB RAM. Includes official 5V/3A USB-C power supply and 32GB microSD card with Raspberry Pi OS pre-installed. HDMI micro cable not included. Perfect for final year IoT and machine learning projects.',
    5800, 'like_new', 'Mumbai')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&q=80', 'Raspberry Pi 4 single board computer', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, project_id,
    'Soldering Iron 25W with Stand, Solder Wire & Flux',
    '25W soldering iron with temperature-stable tip. Includes: iron stand with sponge, 0.8mm rosin-core solder wire (50g), and paste flux. Used for PCB work in 2nd and 3rd year labs. Tip replaced once, works cleanly.',
    480, 'good', 'Chennai')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80', 'Soldering iron kit', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, project_id,
    'NodeMCU ESP8266 Wi-Fi Module (Pack of 2)',
    'Two ESP8266 NodeMCU v3 development boards with CH340 USB chip. Compatible with Arduino IDE. Built-in Wi-Fi for IoT projects. Suitable for home automation, sensor data logging, and cloud connectivity projects. Both boards tested and working.',
    340, 'like_new', 'Hyderabad')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&q=80', 'NodeMCU ESP8266 modules', 0);

  INSERT INTO public.listings (id, seller_id, category_id, title, description, price_inr, condition, city, status)
  VALUES (gen_random_uuid(), demo_seller_id, project_id,
    'Assorted Electronic Components Kit – 500+ Pieces',
    'Bulk component kit: resistors (10 values × 20 each), capacitors (electrolytic and ceramic), transistors (BC547, 2N2222), diodes (1N4007), voltage regulators (7805, 7812), LEDs, and IC sockets. Sorted in labelled compartment box.',
    680, 'good', 'New Delhi')
  RETURNING id INTO listing_id;
  INSERT INTO public.listing_images (listing_id, storage_path, alt_text, sort_order)
  VALUES (listing_id, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80', 'Assorted electronic components', 0);

  RAISE NOTICE 'Demo listings seeded successfully. 30 listings inserted for user %.', demo_seller_id;
END $$;
