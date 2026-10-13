-- TechNest sample data: 6 categories, 11 brands, 20 products.
-- Run after the three migrations. Safe to re-run: every insert is idempotent.
--
-- Prices are in Sri Lankan Rupees and roughly reflect the local market, so the
-- design is reviewed against realistic numbers rather than round placeholders.
-- image_url is left null: ProductArt renders a placeholder until real photos
-- are uploaded through the admin product form.

-- ----------------------------------------------------------- categories ----

insert into public.categories (name, slug, sort_order) values
  ('Mobiles',       'mobiles',     1),
  ('Laptops',       'laptops',     2),
  ('Tablets',       'tablets',     3),
  ('Audio',         'audio',       4),
  ('Smart Watches', 'watches',     5),
  ('Accessories',   'accessories', 6)
on conflict (slug) do nothing;

-- --------------------------------------------------------------- brands ----

insert into public.brands (name, slug) values
  ('Apple',   'apple'),
  ('Samsung', 'samsung'),
  ('Xiaomi',  'xiaomi'),
  ('Google',  'google'),
  ('HP',      'hp'),
  ('Dell',    'dell'),
  ('Lenovo',  'lenovo'),
  ('Asus',    'asus'),
  ('Sony',    'sony'),
  ('JBL',     'jbl'),
  ('Anker',   'anker')
on conflict (slug) do nothing;

-- ------------------------------------------------------------- products ----

insert into public.products
  (name, slug, description, price, discount_price, stock, sku,
   brand_id, category_id, specs, is_active, is_featured)
select
  v.name, v.slug, v.description, v.price, v.discount_price, v.stock, v.sku,
  b.id, c.id, v.specs, true, v.is_featured
from (values
  -- Mobiles
  ('Galaxy S24 Ultra 5G', 'galaxy-s24-ultra-5g',
   'Titanium flagship with a built-in S Pen and a 200MP main camera.',
   389000.00, 352000.00, 7, 'TN-MOB-001', 'samsung', 'mobiles',
   '{"RAM":"12GB","Storage":"256GB","Screen":"6.8 inch QHD+ AMOLED","Battery":"5000mAh","Warranty":"1 year"}'::jsonb, true),

  ('iPhone 15 128GB', 'iphone-15-128gb',
   'A16 Bionic, USB-C and the 48MP Main camera with 2x Telephoto.',
   352000.00, null, 5, 'TN-MOB-002', 'apple', 'mobiles',
   '{"RAM":"6GB","Storage":"128GB","Screen":"6.1 inch Super Retina XDR","Battery":"3349mAh","Warranty":"1 year"}'::jsonb, true),

  ('Redmi Note 13 Pro', 'redmi-note-13-pro',
   'Best value all-rounder with a 200MP camera and 67W fast charging.',
   97500.00, 89900.00, 23, 'TN-MOB-003', 'xiaomi', 'mobiles',
   '{"RAM":"8GB","Storage":"256GB","Screen":"6.67 inch AMOLED 120Hz","Battery":"5100mAh","Warranty":"1 year"}'::jsonb, true),

  ('Galaxy A55 5G', 'galaxy-a55-5g',
   'Mid-range workhorse with a metal frame and four years of updates.',
   132000.00, 124000.00, 14, 'TN-MOB-004', 'samsung', 'mobiles',
   '{"RAM":"8GB","Storage":"128GB","Screen":"6.6 inch Super AMOLED","Battery":"5000mAh","Warranty":"1 year"}'::jsonb, false),

  ('Pixel 8', 'pixel-8',
   'Clean Android with seven years of OS updates and the best point-and-shoot camera.',
   268000.00, null, 3, 'TN-MOB-005', 'google', 'mobiles',
   '{"RAM":"8GB","Storage":"128GB","Screen":"6.2 inch Actua OLED","Battery":"4575mAh","Warranty":"1 year"}'::jsonb, false),

  ('iPhone 13 128GB', 'iphone-13-128gb',
   'Still fast, still supported, now at a far friendlier price.',
   215000.00, 199000.00, 9, 'TN-MOB-006', 'apple', 'mobiles',
   '{"RAM":"4GB","Storage":"128GB","Screen":"6.1 inch Super Retina XDR","Battery":"3240mAh","Warranty":"1 year"}'::jsonb, false),

  -- Laptops
  ('MacBook Air 13 M3', 'macbook-air-13-m3',
   'Fanless, silent, and good for about 18 hours of real work.',
   498000.00, null, 4, 'TN-LAP-001', 'apple', 'laptops',
   '{"CPU":"Apple M3","RAM":"8GB","Storage":"256GB SSD","Screen":"13.6 inch Liquid Retina","Warranty":"1 year"}'::jsonb, true),

  ('Pavilion 15 Core i5', 'pavilion-15-core-i5',
   'Dependable everyday laptop for study and office work.',
   268000.00, 254000.00, 2, 'TN-LAP-002', 'hp', 'laptops',
   '{"CPU":"Intel Core i5-1335U","RAM":"16GB","Storage":"512GB SSD","Screen":"15.6 inch FHD","Warranty":"1 year"}'::jsonb, false),

  ('Inspiron 15 3530', 'inspiron-15-3530',
   'Big-screen budget laptop with a full number pad.',
   232000.00, 218000.00, 11, 'TN-LAP-003', 'dell', 'laptops',
   '{"CPU":"Intel Core i5-1335U","RAM":"8GB","Storage":"512GB SSD","Screen":"15.6 inch FHD 120Hz","Warranty":"1 year"}'::jsonb, false),

  ('IdeaPad Slim 3', 'ideapad-slim-3',
   'Light, quiet and cheap enough to be a first laptop.',
   178000.00, null, 16, 'TN-LAP-004', 'lenovo', 'laptops',
   '{"CPU":"AMD Ryzen 5 7520U","RAM":"8GB","Storage":"512GB SSD","Screen":"15.6 inch FHD","Warranty":"1 year"}'::jsonb, false),

  ('TUF Gaming F15', 'tuf-gaming-f15',
   'RTX 4060 gaming laptop built to a military drop standard.',
   365000.00, 349000.00, 6, 'TN-LAP-005', 'asus', 'laptops',
   '{"CPU":"Intel Core i7-13620H","GPU":"RTX 4060 8GB","RAM":"16GB","Storage":"1TB SSD","Screen":"15.6 inch FHD 144Hz","Warranty":"1 year"}'::jsonb, true),

  -- Tablets
  ('iPad 10th Generation', 'ipad-10th-generation',
   'The everyday iPad, now with USB-C and a landscape camera.',
   165000.00, null, 8, 'TN-TAB-001', 'apple', 'tablets',
   '{"Storage":"64GB","Screen":"10.9 inch Liquid Retina","Battery":"28.6Wh","Warranty":"1 year"}'::jsonb, false),

  ('Galaxy Tab S9 FE', 'galaxy-tab-s9-fe',
   'Water resistant tablet that ships with the S Pen in the box.',
   172000.00, 159000.00, 9, 'TN-TAB-002', 'samsung', 'tablets',
   '{"RAM":"6GB","Storage":"128GB","Screen":"10.9 inch LCD 90Hz","Battery":"8000mAh","Warranty":"1 year"}'::jsonb, true),

  ('Tab M11', 'tab-m11',
   'Family tablet for video, reading and homework.',
   86000.00, 79900.00, 18, 'TN-TAB-003', 'lenovo', 'tablets',
   '{"RAM":"4GB","Storage":"128GB","Screen":"11 inch 2K 90Hz","Battery":"7040mAh","Warranty":"1 year"}'::jsonb, false),

  -- Audio
  ('WH-1000XM5 Headphones', 'wh-1000xm5-headphones',
   'The noise cancelling benchmark, with 30 hour battery life.',
   134000.00, null, 0, 'TN-AUD-001', 'sony', 'audio',
   '{"Type":"Over-ear","Battery":"30 hours","Noise cancelling":"Yes","Warranty":"1 year"}'::jsonb, true),

  ('Tune 770NC', 'tune-770nc',
   'Affordable adaptive noise cancelling with a huge 70 hour battery.',
   38500.00, 34900.00, 27, 'TN-AUD-002', 'jbl', 'audio',
   '{"Type":"Over-ear","Battery":"70 hours","Noise cancelling":"Yes","Warranty":"1 year"}'::jsonb, false),

  ('Galaxy Buds2 Pro', 'galaxy-buds2-pro',
   'Compact earbuds with 24bit audio and proper in-ear noise cancelling.',
   62000.00, 56500.00, 2, 'TN-AUD-003', 'samsung', 'audio',
   '{"Type":"In-ear","Battery":"5 hours + 18 in case","Noise cancelling":"Yes","Warranty":"1 year"}'::jsonb, false),

  -- Watches
  ('Watch Series 9 45mm', 'watch-series-9-45mm',
   'Brighter display, double tap gesture and full workout tracking.',
   186000.00, 174500.00, 11, 'TN-WAT-001', 'apple', 'watches',
   '{"Case":"45mm aluminium","Screen":"Always-On Retina","Battery":"18 hours","Warranty":"1 year"}'::jsonb, true),

  ('Galaxy Watch6 44mm', 'galaxy-watch6-44mm',
   'Sleep tracking and body composition on a bright AMOLED face.',
   98000.00, null, 13, 'TN-WAT-002', 'samsung', 'watches',
   '{"Case":"44mm aluminium","Screen":"1.5 inch AMOLED","Battery":"425mAh","Warranty":"1 year"}'::jsonb, false),

  -- Accessories
  ('65W GaN Fast Charger', '65w-gan-fast-charger',
   'One small charger that fills a phone, tablet and laptop.',
   12900.00, 9900.00, 46, 'TN-ACC-001', 'anker', 'accessories',
   '{"Output":"65W","Ports":"2x USB-C, 1x USB-A","Warranty":"18 months"}'::jsonb, false)
) as v(name, slug, description, price, discount_price, stock, sku,
       brand_slug, category_slug, specs, is_featured)
join public.brands     b on b.slug = v.brand_slug
join public.categories c on c.slug = v.category_slug
on conflict (slug) do nothing;

-- ------------------------------------------------------------- settings ----

insert into public.settings (key, value) values
  ('shop_name',          '"TechNest"'::jsonb),
  ('shop_phone',         '"+94 11 000 0000"'::jsonb),
  ('shop_email',         '"hello@technest.lk"'::jsonb),
  ('delivery_fee',       '450'::jsonb),
  ('free_delivery_from', '50000'::jsonb),
  ('payment_methods',    '{"cod": true, "payhere": false, "bank_transfer": false}'::jsonb)
on conflict (key) do nothing;
