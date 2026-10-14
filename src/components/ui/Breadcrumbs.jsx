import { Link } from "react-router-dom";
import { ChevronRightIcon } from "../icons.jsx";

export default function Breadcrumbs({ trail }) {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;

          return (
            <li key={crumb.label} className="flex min-w-0 items-center gap-1">
              {index > 0 ? (
                <ChevronRightIcon className="size-3.5 shrink-0 text-slate-300" />
              ) : null}

              {last || !crumb.to ? (
                <span aria-current={last ? "page" : undefined} className="truncate font-medium text-brand-dark">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.to} className="transition-colors hover:text-brand">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
