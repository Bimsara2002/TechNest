import { Link } from "react-router-dom";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold " +
  "transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "bg-brand text-white shadow-sm hover:bg-brand-700 hover:shadow-lift",
  secondary: "bg-white text-brand-dark ring-1 ring-slate-200 hover:ring-brand hover:text-brand",
  dark: "bg-brand-dark text-white hover:bg-brand-900",
  ghost: "text-brand-dark hover:bg-slate-100",
};

/**
 * One button, three ways to render it: a real <button>, a router <Link>
 * (pass `to`), or an <a> (pass `href`). Keeps the 44px tap target everywhere.
 */
export default function Button({
  variant = "primary",
  className = "",
  to,
  href,
  children,
  ...rest
}) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
