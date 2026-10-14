import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMyProfile,
  getCurrentUser,
  onAuthChange,
  sendPasswordReset,
  signIn,
  signOut,
  signUp,
  updateMyProfile,
  updatePassword,
} from "../lib/auth.js";
import { isSetupError } from "../lib/supabaseErrors.js";

/**
 * Session and account state for the whole app.
 *
 * Query keys live here and nowhere else. Pages and guards use useAuth(), which
 * collapses "is there a session" and "what role is it" into one answer - a
 * guard that reads them separately redirects on the first render, before the
 * profile has loaded, and bounces a signed-in admin to the login page.
 */

export const authKeys = {
  all: ["auth"],
  user: ["auth", "user"],
  profile: ["auth", "profile"],
};

function useAuthUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: getCurrentUser,
    // The session lives in localStorage and is kept current by useAuthSync;
    // re-reading it on an interval would tell us nothing new.
    staleTime: Infinity,
    retry: false,
  });
}

function useMyProfile(enabled) {
  return useQuery({
    queryKey: authKeys.profile,
    queryFn: fetchMyProfile,
    enabled,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

/**
 * Everything a guard, the navbar or an admin screen needs about the person
 * using the app.
 *
 * `isPending` stays true until the role is known, not just the session, so
 * callers never have to special-case the window in between.
 */
export function useAuth() {
  const userQuery = useAuthUser();
  const user = userQuery.data ?? null;
  const profileQuery = useMyProfile(Boolean(user));

  const error = userQuery.error ?? profileQuery.error ?? null;

  return {
    user,
    profile: profileQuery.data ?? null,
    isSignedIn: Boolean(user),
    isAdmin: profileQuery.data?.role === "admin",
    isBlocked: profileQuery.data?.blocked === true,

    // A session with no profile row means the sign-up trigger never ran, which
    // in practice means the migrations were not applied.
    needsSetup:
      isSetupError(error) ||
      (Boolean(user) && profileQuery.isSuccess && profileQuery.data === null),

    isPending: userQuery.isPending || (Boolean(user) && profileQuery.isPending),
    isError: userQuery.isError || profileQuery.isError,
    error,
  };
}

/**
 * Keeps the cache in step with Supabase Auth: a token refresh in another tab,
 * a sign-out, or the recovery session created when a reset link is opened.
 * Called once, from App.
 */
export function useAuthSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    return onAuthChange((event, session) => {
      // useAuthUser already read the stored session; acting on this would
      // write the same value and invalidate the profile for nothing.
      if (event === "INITIAL_SESSION") return;

      queryClient.setQueryData(authKeys.user, session?.user ?? null);

      if (event === "SIGNED_OUT") {
        // Drop the profile rather than refetch it: there is no session to
        // fetch it with, and leaving it behind would show the old name.
        queryClient.setQueryData(authKeys.profile, null);
        // Orders and anything else scoped to the person who just left.
        queryClient.removeQueries({ queryKey: ["orders"] });
        queryClient.removeQueries({ queryKey: ["admin"] });
        return;
      }

      queryClient.invalidateQueries({ queryKey: authKeys.profile });
    });
  }, [queryClient]);
}

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signIn,
    onSuccess: ({ user, profile }) => {
      // Seeded straight from the sign-in response so the page that redirects
      // on success already knows the role and does not flash a spinner.
      queryClient.setQueryData(authKeys.user, user);
      queryClient.setQueryData(authKeys.profile, profile);
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: ({ session }) => {
      // Only when email confirmation is off does sign-up hand back a session.
      if (session) queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    // onAuthChange clears the cache; this covers the case where the listener
    // has not fired yet so the navbar never shows a stale account.
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user, null);
      queryClient.setQueryData(authKeys.profile, null);
    },
  });
}

export function usePasswordReset() {
  return useMutation({ mutationFn: sendPasswordReset });
}

export function useUpdatePassword() {
  return useMutation({ mutationFn: updatePassword });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (profile) => queryClient.setQueryData(authKeys.profile, profile),
  });
}
