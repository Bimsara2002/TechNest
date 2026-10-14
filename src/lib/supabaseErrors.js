/**
 * Turns Supabase errors into something a shopkeeper can act on.
 *
 * Raw messages leak implementation ("relation public.profiles does not
 * exist", "JWT expired") or say nothing useful ("Invalid login credentials"
 * for a blocked account). Every error shown to a person goes through here so
 * the wording is consistent and the *actionable* cases - the database not
 * being set up, an address already registered - are named rather than hidden
 * behind "something went wrong".
 */

/** PostgREST cannot find a table or function: the migrations have not been run. */
export function isSetupError(error) {
  if (!error) return false;

  const code = error.code ?? "";
  // 42P01 undefined_table, 42883 undefined_function come from Postgres;
  // PGRST202/205 are PostgREST's own "not in the schema cache".
  if (["42P01", "42883", "PGRST202", "PGRST205"].includes(code)) return true;

  const message = String(error.message ?? "").toLowerCase();
  return (
    message.includes("does not exist") ||
    message.includes("could not find the table") ||
    message.includes("could not find the function") ||
    message.includes("schema cache")
  );
}

/** Row level security (or a missing column grant) refused the write. */
export function isPermissionError(error) {
  if (!error) return false;
  if (error.code === "42501") return true;

  const message = String(error.message ?? "").toLowerCase();
  return (
    message.includes("row-level security") ||
    message.includes("row level security") ||
    message.includes("permission denied")
  );
}

export const SETUP_MESSAGE =
  "The database is not set up yet. Open your Supabase project, go to the SQL " +
  "editor and run the files in supabase/migrations in order, then reload.";

/**
 * Auth failures, by Supabase's stable `code` where there is one. The messages
 * avoid confirming whether an address has an account: "wrong email or
 * password" is deliberate, since naming which half was wrong tells an attacker
 * that the address is registered.
 */
const authMessages = {
  invalid_credentials: "That email and password do not match an account.",
  email_not_confirmed:
    "Confirm your email first — check your inbox for the link we sent.",
  user_already_exists: "That email already has an account. Try signing in.",
  email_exists: "That email already has an account. Try signing in.",
  weak_password: "Pick a longer password — at least 8 characters.",
  same_password: "That is already your password. Choose a different one.",
  // Supabase rejected the address itself. Worth saying so plainly, because the
  // form already checked the format - this is the server disagreeing, not a typo.
  email_address_invalid:
    "Supabase will not accept that email address. Try a different one.",
  email_address_not_authorized:
    "This project is not allowed to send email to that address.",
  // Confirmation and reset emails share one small hourly quota on the free
  // plan, and every sign-up attempt spends one.
  over_email_send_rate_limit:
    "Too many confirmation emails have been sent. Wait an hour, or turn off " +
    "“Confirm email” in Supabase so sign-up stops sending them.",
  over_request_rate_limit: "Too many attempts. Wait a minute and try again.",
  signup_disabled: "New accounts are turned off in this Supabase project.",
  validation_failed: "Check the details you entered and try again.",
};

/** One human sentence for any error this app can raise. */
export function describeError(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;

  if (isSetupError(error)) return SETUP_MESSAGE;

  // GoTrue returns the reason as `error_code` on the wire; supabase-js copies
  // it to `code` on the AuthApiError it throws. Read both, because which one
  // is populated depends on the client version.
  const byCode = authMessages[error.code] ?? authMessages[error.error_code];
  if (byCode) return byCode;

  const message = String(error.message ?? error.msg ?? "");

  // Older supabase-js versions report these by message, without a code.
  if (/invalid login credentials/i.test(message)) {
    return authMessages.invalid_credentials;
  }
  if (/already registered|already exists/i.test(message)) {
    return authMessages.user_already_exists;
  }
  if (/email not confirmed/i.test(message)) {
    return authMessages.email_not_confirmed;
  }
  if (/failed to fetch|network/i.test(message)) {
    return "Could not reach the server. Check your connection and try again.";
  }
  if (isPermissionError(error)) {
    return "Your account is not allowed to do that.";
  }

  return message || fallback;
}
