-- TechNest storage
-- Run after 0002_policies.sql.

-- Product photos are public to read: they appear on the storefront for guests,
-- and signed URLs for every tile would be slow and pointless. Writes are
-- admin-only, so nobody can upload into the shop's bucket.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Anyone reads product images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');

create policy "Admins upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins replace product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
