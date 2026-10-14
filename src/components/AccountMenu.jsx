import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserIcon } from "./icons.jsx";
import { useAuth, useSignOut } from "../hooks/useAuth.js";
import { useToast } from "../store/toastStore.js";

const itemClass =
  "flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100";

/**
 * The account control in the navbar: a sign-in link when signed out, and an
 * initial-avatar menu when signed in.
 *
 * The Admin entry appears only for admins. That is a convenience, not a
 * security boundary - hiding a link stops nothing, which is why /admin is
 * behind RequireAdmin and the tables behind is_admin() policies.
 */
export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const location = useLocation();
  const { isSignedIn, isAdmin, profile, user } = useAuth();
  const signOut = useSignOut();
  const toast = useToast();

  // Close on navigation, derived during render rather than in an effect so the
  // menu never stays open over the page it just opened.
  const [lastKey, setLastKey] = useState(location.key);
  if (location.key !== lastKey) {
    setLastKey(location.key);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!isSignedIn) {
    return (
      <Link
        to="/login"
        className="hidden size-11 items-center justify-center rounded-xl transition-all hover:bg-white/10 active:scale-90 md:inline-flex"
        aria-label="Sign in"
      >
        <UserIcon className="size-5" />
      </Link>
    );
  }

  const name = profile?.full_name?.trim() || "Your account";
  const email = profile?.email ?? user?.email ?? "";

  return (
    <div ref={wrapRef} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${name}`}
        className="inline-flex size-11 items-center justify-center rounded-xl transition-all hover:bg-white/10 active:scale-90"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-brand text-sm font-bold uppercase text-white">
          {name.charAt(0)}
        </span>
      </button>

      {open ? (
        <div
          role="menu"
          className="animate-scale-in absolute right-0 top-full z-50 mt-1 w-60 origin-top-right rounded-2xl bg-white p-2 shadow-lift ring-1 ring-slate-200"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-bold text-slate-900">{name}</p>
            <p className="truncate text-xs text-slate-500">{email}</p>
          </div>

          <div className="my-1 h-px bg-slate-100" />

          {isAdmin ? (
            <>
              <Link to="/admin" role="menuitem" className={itemClass}>
                Admin dashboard
              </Link>
              <div className="my-1 h-px bg-slate-100" />
            </>
          ) : null}

          <Link to="/orders" role="menuitem" className={itemClass}>
            My orders
          </Link>
          <Link to="/wishlist" role="menuitem" className={itemClass}>
            Wishlist
          </Link>
          <Link to="/profile" role="menuitem" className={itemClass}>
            Profile
          </Link>

          <div className="my-1 h-px bg-slate-100" />

          <button
            type="button"
            role="menuitem"
            disabled={signOut.isPending}
            onClick={() => {
              setOpen(false);
              signOut.mutate(undefined, { onSuccess: () => toast("Signed out") });
            }}
            className={`${itemClass} w-full text-rose-600 hover:bg-rose-50 disabled:opacity-50`}
          >
            {signOut.isPending ? "Signing out…" : "Sign out"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
