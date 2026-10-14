import { Navigate, Outlet, useLocation } from "react-router-dom";
import GateNotice from "./GateNotice.jsx";
import { LoadingState } from "../ui/States.jsx";
import { SETUP_MESSAGE } from "../../lib/supabaseErrors.js";
import { useAuth } from "../../hooks/useAuth.js";

/**
 * Wraps the routes the feature guide marks "login needed". Used as a layout
 * route, so it guards a whole branch rather than being repeated per page.
 *
 * This hides screens. Row Level Security is what protects the data - someone
 * calling the API directly never reaches this component at all.
 */
export default function RequireAuth({ children }) {
  const { isSignedIn, isBlocked, needsSetup, isPending } = useAuth();
  const location = useLocation();

  if (isPending) return <LoadingState label="Checking your account" />;

  if (!isSignedIn) {
    // `from` is what sends them back to the page they wanted after signing in,
    // instead of dumping them on the home page.
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
      />
    );
  }

  if (isBlocked) {
    return (
      <GateNotice
        tone="danger"
        title="Your account is on hold"
        message="You cannot place orders at the moment. Contact us and we will sort it out."
        actionLabel="Contact us"
        actionTo="/contact"
        secondaryLabel="Keep browsing"
        secondaryTo="/products"
      />
    );
  }

  return children ?? <Outlet />;
}
