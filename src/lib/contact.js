import { supabase } from "./supabase.js";
import { describeError } from "./supabaseErrors.js";

/**
 * The contact form's one write.
 *
 * `messages` has an insert policy for anon as well as authenticated - a
 * customer should not have to make an account to ask a question - and reads
 * are admin-only, so nobody can list other people's messages.
 */
export async function sendMessage({ name, email, message }) {
  const { error } = await supabase.from("messages").insert({
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  });

  if (error) {
    throw new Error(describeError(error, "Could not send your message."), {
      cause: error,
    });
  }
}
