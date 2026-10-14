import { supabase } from "./supabase.js";
import { describeError } from "./supabaseErrors.js";

/**
 * Accounts and sessions. The only module that touches supabase.auth.
 *
 * Every function throws an Error with a sentence fit to show a customer, so
 * pages render `error.message` directly instead of each one re-interpreting
 * Supabase's codes. The original error is kept on `.cause` for the console.
 *
 * Nothing here decides what a signed-in person may *do* - that is Row Level
 * Security. `role` is written by a database trigger from an allowlist the
 * browser cannot read (supabase/migrations/20261014090300_admin_accounts.sql), so a
 * tampered client can claim to be an admin and still read nothing.
 */

const fail = (error, fallback) => {
  throw new Error(describeError(error, fallback), { cause: error });
};

/** The signed-in user, or null. Reads the stored session; no network call. */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getSession();
  if (error) fail(error, "Could not check whether you are signed in.");
  return data.session?.user ?? null;
}

/** The caller's own profile row, or null when signed out. */
export async function fetchMyProfile() {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, email, role, blocked, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) fail(error, "Could not load your account details.");

  // No row means the sign-up trigger has not run for this user - almost always
  // because 20261014090000_schema.sql was never applied to this project.
  return data;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) fail(error, "Could not sign you in.");

  // Loaded here so the caller can send an admin straight to /admin without a
  // second render pass deciding where to go.
  const profile = await fetchMyProfile();

  return { user: data.user, profile };
}

export async function signUp({ email, password, full_name }) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    // Read by the handle_new_user() trigger to fill profiles.full_name.
    options: { data: { full_name: full_name.trim() } },
  });

  if (error) fail(error, "Could not create your account.");

  // With "Confirm email" on in Supabase (the default) there is a user but no
  // session until the link is clicked. The caller needs to tell them that
  // rather than pretending they are signed in.
  return { user: data.user, session: data.session };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) fail(error, "Could not sign you out.");
}

export async function sendPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) fail(error, "Could not send the reset email.");
}

/**
 * Sets a new password for the recovery session Supabase created when the
 * emailed link was opened. Fails if there is no session, which is what happens
 * when someone visits /reset-password directly.
 */
export async function updatePassword(password) {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    throw new Error(
      "This reset link is no longer valid. Request a new one and open it from your email.",
    );
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) fail(error, "Could not change your password.");
}

export async function updateMyProfile({ full_name, phone }) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) throw new Error("Sign in first.");

  // Only these two columns are writable by their owner - `role` and `blocked`
  // are withheld at the grant level in 20261014090100_policies.sql, so adding them here
  // would fail rather than escalate.
  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: full_name.trim(), phone: phone.trim() })
    .eq("id", userId)
    .select("id, full_name, phone, email, role, blocked, created_at")
    .single();

  if (error) fail(error, "Could not save your details.");
  return data;
}

/**
 * Calls back on sign in, sign out and token refresh. Returns an unsubscribe
 * function. One subscription for the app, set up by useAuthSync().
 */
export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return () => data.subscription.unsubscribe();
}
