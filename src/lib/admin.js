import { supabase } from "./supabase.js";
import { describeError } from "./supabaseErrors.js";

/**
 * Data access for the /admin screens.
 *
 * Every query here is also gated in the database by an is_admin() policy, so
 * these functions do not check the role themselves - if a non-admin somehow
 * ran one, Postgres returns nothing rather than trusting the caller. The
 * React guard in RequireAdmin is there so the screens are not *shown*, not to
 * keep the data safe.
 *
 * Only the tables that are genuinely admin-owned live here. The catalogue and
 * orders still come from src/lib/products.js and src/lib/orders.js, which read
 * the sample arrays until roadmap step 5 moves them to Supabase.
 */

const fail = (error, fallback) => {
  throw new Error(describeError(error, fallback), { cause: error });
};

// ------------------------------------------------------------- customers ----

export async function fetchCustomers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, role, blocked, created_at")
    .order("created_at", { ascending: false });

  if (error) fail(error, "Could not load customers.");
  return data ?? [];
}

/**
 * Goes through a database function, not a plain update: `blocked` is withheld
 * at the column-grant level in 20261014090100_policies.sql (that is what stops a
 * customer writing their own `role`), so the API cannot update it directly.
 * admin_set_blocked re-checks is_admin() inside the database.
 */
export async function setCustomerBlocked({ id, blocked }) {
  const { error } = await supabase.rpc("admin_set_blocked", {
    target: id,
    value: blocked,
  });

  if (error) fail(error, "Could not change that account.");
}

export async function setCustomerRole({ id, role }) {
  const { error } = await supabase.rpc("admin_set_role", {
    target: id,
    value: role,
  });

  if (error) fail(error, "Could not change that role.");
}

// -------------------------------------------------------------- messages ----

export async function fetchMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("id, name, email, message, is_read, created_at")
    .order("created_at", { ascending: false });

  if (error) fail(error, "Could not load messages.");
  return data ?? [];
}

export async function setMessageRead({ id, is_read }) {
  const { error } = await supabase
    .from("messages")
    .update({ is_read })
    .eq("id", id);

  if (error) fail(error, "Could not update that message.");
}

export async function deleteMessage(id) {
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) fail(error, "Could not delete that message.");
}

// --------------------------------------------------------------- coupons ----

export async function fetchCoupons() {
  const { data, error } = await supabase
    .from("coupons")
    .select("id, code, type, value, expires_at, usage_limit, used_count, is_active")
    .order("is_active", { ascending: false })
    .order("code");

  if (error) fail(error, "Could not load coupons.");
  return data ?? [];
}

/** Shapes a form's values for the table: blanks become null, not empty text. */
const couponRow = (values) => ({
  code: values.code.trim().toUpperCase(),
  type: values.type,
  value: Number(values.value),
  expires_at: values.expires_at ? new Date(values.expires_at).toISOString() : null,
  usage_limit: values.usage_limit === "" || values.usage_limit == null
    ? null
    : Number(values.usage_limit),
  is_active: Boolean(values.is_active),
});

export async function createCoupon(values) {
  const { data, error } = await supabase
    .from("coupons")
    .insert(couponRow(values))
    .select()
    .single();

  // 23505 is a unique violation: the code already exists. Worth naming,
  // because "duplicate key value violates unique constraint" is not an
  // explanation anyone can act on.
  if (error?.code === "23505") {
    throw new Error(`There is already a coupon with the code ${values.code.toUpperCase()}.`, {
      cause: error,
    });
  }
  if (error) fail(error, "Could not create that coupon.");

  return data;
}

export async function updateCoupon({ id, ...values }) {
  const { data, error } = await supabase
    .from("coupons")
    .update(couponRow(values))
    .eq("id", id)
    .select()
    .single();

  if (error?.code === "23505") {
    throw new Error(`There is already a coupon with the code ${values.code.toUpperCase()}.`, {
      cause: error,
    });
  }
  if (error) fail(error, "Could not save that coupon.");

  return data;
}

export async function deleteCoupon(id) {
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) fail(error, "Could not delete that coupon.");
}

// --------------------------------------------------------------- banners ----

export async function fetchBanners() {
  const { data, error } = await supabase
    .from("banners")
    .select("id, image_url, link, headline, sort_order, is_active")
    .order("sort_order");

  if (error) fail(error, "Could not load banners.");
  return data ?? [];
}

const bannerRow = (values) => ({
  headline: values.headline.trim(),
  image_url: values.image_url.trim(),
  link: values.link?.trim() || null,
  sort_order: Number(values.sort_order) || 0,
  is_active: Boolean(values.is_active),
});

export async function createBanner(values) {
  const { data, error } = await supabase
    .from("banners")
    .insert(bannerRow(values))
    .select()
    .single();

  if (error) fail(error, "Could not create that banner.");
  return data;
}

export async function updateBanner({ id, ...values }) {
  const { data, error } = await supabase
    .from("banners")
    .update(bannerRow(values))
    .eq("id", id)
    .select()
    .single();

  if (error) fail(error, "Could not save that banner.");
  return data;
}

export async function deleteBanner(id) {
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) fail(error, "Could not delete that banner.");
}

// -------------------------------------------------------------- settings ----

/**
 * `settings` is one row per key with a jsonb value, which is right for the
 * database (add a setting without a migration) but wrong for a form. These two
 * functions are the only place that translation lives.
 */
export async function fetchSettings() {
  const { data, error } = await supabase.from("settings").select("key, value");

  if (error) fail(error, "Could not load the shop settings.");

  const byKey = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
  const methods = byKey.payment_methods ?? {};

  return {
    shop_name: byKey.shop_name ?? "",
    shop_phone: byKey.shop_phone ?? "",
    shop_email: byKey.shop_email ?? "",
    shop_address: byKey.shop_address ?? "",
    delivery_fee: byKey.delivery_fee ?? 0,
    free_delivery_from: byKey.free_delivery_from ?? 0,
    cod_enabled: methods.cod ?? true,
    payhere_enabled: methods.payhere ?? false,
    bank_transfer_enabled: methods.bank_transfer ?? false,
  };
}

export async function saveSettings(values) {
  const rows = [
    { key: "shop_name", value: values.shop_name.trim() },
    { key: "shop_phone", value: values.shop_phone.trim() },
    { key: "shop_email", value: values.shop_email.trim() },
    { key: "shop_address", value: values.shop_address.trim() },
    { key: "delivery_fee", value: Number(values.delivery_fee) },
    { key: "free_delivery_from", value: Number(values.free_delivery_from) },
    {
      key: "payment_methods",
      value: {
        cod: Boolean(values.cod_enabled),
        payhere: Boolean(values.payhere_enabled),
        bank_transfer: Boolean(values.bank_transfer_enabled),
      },
    },
  ];

  // One upsert rather than seven updates: all of it lands or none of it does,
  // so the shop is never left with a new free-delivery threshold and the old
  // delivery fee.
  const { error } = await supabase.from("settings").upsert(rows, { onConflict: "key" });

  if (error) fail(error, "Could not save the settings.");
  return values;
}
