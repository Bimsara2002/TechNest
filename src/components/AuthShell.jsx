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
 * Shown while the real Supabase Auth wiring is still ahead (roadmap step 4),
 * so these forms never look like they signed someone in when they did not.
 */
export function AuthNotice() {
  return (
    <p className="mt-5 rounded-xl bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-200">
      Accounts are not connected yet — this form validates your details but
      cannot sign you in until Supabase Auth is wired up in roadmap step 4.
    </p>
  );
}
