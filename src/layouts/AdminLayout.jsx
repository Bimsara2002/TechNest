import { Link, NavLink, Outlet } from "react-router-dom";
import Toaster from "../components/ui/Toaster.jsx";

/**
 * Shell for /admin. Sidebar on laptop, horizontal scrolling tab strip on mobile.
 *
 * No access control yet - roadmap step 4 adds the admin guard that redirects
 * non-admins, backed by Row Level Security in the database.
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

export default function AdminLayout() {
  return (
    <div className="flex min-h-dvh flex-col xl:flex-row">
      <header className="bg-brand-dark text-white xl:w-64 xl:shrink-0">
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
      </header>

      <main className="flex-1 bg-slate-50">
        <Outlet />
      </main>

      <Toaster />
    </div>
  );
}
