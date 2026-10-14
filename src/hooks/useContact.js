import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../lib/contact.js";

/** Sends the contact form. Nothing to invalidate - the sender cannot read it back. */
export function useSendMessage() {
  return useMutation({ mutationFn: sendMessage });
}
