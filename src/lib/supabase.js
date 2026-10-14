import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail loudly rather than rendering empty pages against a missing backend: a
// deploy with no environment variables should break obviously, not quietly.
if (!url || !anonKey) {
  throw new Error(
    "Supabase is not configured. Copy .env.example to .env and set " +
      "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see supabase/README.md). " +
      "On Vercel, set them in Project Settings > Environment Variables.",
  );
}

// An easy and expensive mistake: copying the REST endpoint out of the Supabase
// dashboard instead of the project URL. supabase-js appends its own paths, so
// ".../rest/v1" sends queries to /rest/v1/rest/v1/... and sign-ins to
// /rest/v1/auth/v1/..., and every single one fails with "Invalid path
// specified in request URL" - which reads like a bad key, not a bad URL.
if (/\/(rest|auth|storage|functions)\/v\d/.test(url)) {
  throw new Error(
    `VITE_SUPABASE_URL must be the project URL only, with no path: got "${url}". ` +
      `Use "${new URL(url).origin}" instead.`,
  );
}

/**
 * The one Supabase client for the whole app.
 *
 * This key is the public anon key and ships inside the bundle by design - it
 * is Row Level Security, not secrecy, that protects the data. Never put a
 * service-role key in a VITE_ variable.
 *
 * Per CLAUDE.md, only src/lib and src/hooks may import this. Pages and
 * components go through hooks so query keys and error handling stay in one layer.
 */
export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
