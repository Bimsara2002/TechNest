/**
 * The one place the page gutter is defined. px-4 keeps a 16px gutter at 375px,
 * which is what stops content touching the screen edge on a phone.
 */
export default function Container({ className = "", children }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>
  );
}
