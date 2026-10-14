import { cloneElement, useId } from "react";

const controlBase =
  "min-h-11 w-full rounded-xl bg-white px-3.5 text-sm ring-1 transition-all duration-200 " +
  "placeholder:text-slate-400 focus:outline-none focus:ring-2";

const controlTone = (invalid) =>
  invalid
    ? "ring-rose-300 focus:ring-rose-500"
    : "ring-slate-200 hover:ring-slate-300 focus:ring-brand";

export function Input({ invalid, className = "", ...rest }) {
  return <input className={`${controlBase} ${controlTone(invalid)} ${className}`} {...rest} />;
}

export function Textarea({ invalid, className = "", ...rest }) {
  return (
    <textarea
      className={`${controlBase} ${controlTone(invalid)} py-2.5 ${className}`}
      {...rest}
    />
  );
}

export function Select({ invalid, className = "", children, ...rest }) {
  return (
    <select className={`${controlBase} ${controlTone(invalid)} ${className}`} {...rest}>
      {children}
    </select>
  );
}

/**
 * Label + control + error message, wired together for screen readers.
 *
 * Clones the child so the caller writes `<Field label="Email"><Input …/></Field>`
 * without having to repeat an id three times. The error shakes on appearance:
 * movement is noticed faster than a colour change, and it does not rely on
 * colour vision.
 */
export default function Field({ label, error, hint, required, children }) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(" ");

  const control = cloneElement(children, {
    id,
    invalid: Boolean(error),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
  });

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required ? (
          <span className="ml-0.5 text-rose-500" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      <div className="mt-1.5">{control}</div>

      {hint && !error ? (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="animate-shake mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
