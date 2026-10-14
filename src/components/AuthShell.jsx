import { Link } from "react-router-dom";
import Container from "./ui/Container.jsx";
import { Logo } from "./icons.jsx";

/**
 * Centred card shared by sign in, register and password reset, so the three
 * pages feel like one flow rather than three separate screens.
 */
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <Container className="stage-3d py-12 xl:py-16">
      <div className="animate-rise-3d mx-auto w-full max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold">
            <Logo className="size-9" />
            <span>
              Tech<span className="text-brand">Nest</span>
            </span>
          </Link>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:p-8">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}

          <div className="mt-6">{children}</div>
        </div>

        {footer ? (
          <p className="mt-5 text-center text-sm text-slate-600">{footer}</p>
        ) : null}
      </div>
    </Container>
  );
}

/**
 * Whatever the server refused, above the fields rather than beside one of them
 * - "that email and password do not match" belongs to the form, not to the
 * password box. Renders nothing when there is no error, so it can sit
 * unconditionally at the top of a form.
 */
export function AuthError({ error }) {
  if (!error) return null;

  return (
    <p
      role="alert"
      className="animate-shake rounded-xl bg-rose-50 px-3.5 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200"
    >
      {error.message}
    </p>
  );
}

/** The matching confirmation, for "check your email" style outcomes. */
export function AuthSuccess({ title, children }) {
  return (
    <div
      role="status"
      className="animate-scale-in rounded-xl bg-emerald-50 px-3.5 py-3 ring-1 ring-emerald-200"
    >
      <p className="text-sm font-semibold text-emerald-900">{title}</p>
      {children ? (
        <p className="mt-1 text-sm leading-relaxed text-emerald-800">{children}</p>
      ) : null}
    </div>
  );
}
