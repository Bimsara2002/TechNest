import { Link, NavLink, Outlet } from "react-router-dom";
import Toaster from "../components/ui/Toaster.jsx";
import { useAuth, useSignOut } from "../hooks/useAuth.js";
import { useToast } from "../store/toastStore.js";

/**
 * Shell for /admin. Sidebar on laptop, horizontal scrolling tab strip on mobile.
 *
 * Only ever rendered inside <RequireAdmin>, so it can assume an admin is
 * signed in; it does not re-check. The database checks again on every query.
 */

const adminLinks = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/inventory", label: "Inventory" },
  { to: "/admin/coupons", label: "Coupons" },
  { to: "/admin/banners", label: "Banners" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/messages", label: "Messages" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/settings", label: "Settings" },
];

const linkClass = ({ isActive }) =>
  `inline-flex min-h-11 w-full items-center whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors ${
    isActive ? "bg-brand text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
  }`;

/**
 * Who is signed in, and the way out. Pinned to the bottom of the sidebar on
 * laptop; on a phone it follows the tab strip, where it is out of the way but
 * still reachable without hunting for it.
 */
function AdminAccount() {
  const { profile, user } = useAuth();
  const signOut = useSignOut();
  const toast = useToast();

  const name = profile?.full_name?.trim() || "Admin";
  const email = profile?.email ?? user?.email ?? "";

  return (
    <div className="border-t border-white/10 px-3 py-3 xl:mt-auto">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold uppercase">
          {name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-slate-400">{email}</p>
        </div>
      </div>

      <div className="mt-2 flex gap-1">
        <Link
          to="/"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-white/10 px-3 text-xs font-semibold transition-colors hover:bg-white/15"
        >
          View shop
        </Link>
        <button
          type="button"
          disabled={signOut.isPending}
          onClick={() =>
            signOut.mutate(undefined, { onSuccess: () => toast("Signed out") })
          }
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-white/10 px-3 text-xs font-semibold transition-colors hover:bg-rose-500 disabled:opacity-50"
        >
          {signOut.isPending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <div className="flex min-h-dvh flex-col xl:flex-row">
      <header className="flex flex-col bg-brand-dark text-white xl:w-64 xl:shrink-0">
        <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-2 xl:max-w-none xl:px-3">
          <Link
            to="/admin"
            className="inline-flex min-h-11 items-center text-lg font-bold tracking-tight"
          >
            Tech<span className="text-brand">Nest</span>
            <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-xs font-medium">
              Admin
            </span>
          </Link>
        </div>

        <nav aria-label="Admin" className="px-2 pb-2 xl:px-3">
          {/* Mobile: one scrollable row. Laptop: stacked sidebar. */}
          <ul className="flex gap-1 overflow-x-auto xl:flex-col xl:overflow-visible">
            {adminLinks.map((link) => (
              <li key={link.to} className="shrink-0 xl:shrink">
                <NavLink to={link.to} end={link.end} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <AdminAccount />
      </header>

      <main className="flex-1 bg-slate-50">
        <Outlet />
      </main>

      <Toaster />
    </div>
  );
}
