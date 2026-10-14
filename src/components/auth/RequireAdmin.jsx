import { Navigate, Outlet, useLocation } from "react-router-dom";
import GateNotice from "./GateNotice.jsx";
import { LoadingState } from "../ui/States.jsx";
import { SETUP_MESSAGE } from "../../lib/supabaseErrors.js";
import { useAuth } from "../../hooks/useAuth.js";

/**
 * Guards the whole /admin branch.
 *
 * Half of the "enforced twice" rule in CLAUDE.md: this hides the screens, and
 * the is_admin() checks in the Row Level Security policies refuse the data
 * even if someone loads the admin bundle by hand. Never relax one because the
 * other exists.
 *
 * A non-admin gets told, not redirected - a signed-in customer sent to /login
 * would sign in again and land right back here.
 */
export default function RequireAdmin({ children }) {
  const { isSignedIn, isAdmin, needsSetup, isError, error, isPending } = useAuth();
  const location = useLocation();

  if (isPending) return <LoadingState label="Checking your permissions" />;

  if (!isSignedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (needsSetup) {
    return (
      <GateNotice
        tone="warning"
        title="Database not set up"
        message={SETUP_MESSAGE}
        actionLabel="Back to the shop"
        actionTo="/"
      >
        <p className="mt-4 rounded-xl bg-white/60 px-3 py-2 text-left font-mono text-xs leading-relaxed text-amber-900">
          npm run db:push
        </p>
        <p className="mt-2 text-xs text-amber-800">
          Applies every migration to the linked project. See ADMIN.md if it has
          not been linked yet.
        </p>
      </GateNotice>
    );
  }

  if (isError) {
    return (
      <GateNotice
        tone="danger"
        title="Could not check your permissions"
        message={error?.message ?? "Please reload and try again."}
        actionLabel="Back to the shop"
        actionTo="/"
      />
    );
  }

  if (!isAdmin) {
    return (
      <GateNotice
        tone="danger"
        title="Admins only"
        message="This account does not manage the shop. If it should, add its email to the admin_allowlist table in Supabase and sign in again."
        actionLabel="Back to the shop"
        actionTo="/"
        secondaryLabel="Your orders"
        secondaryTo="/orders"
      />
    );
  }

  return children ?? <Outlet />;
}
