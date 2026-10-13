import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-slate-600">
        That address does not exist. It may have been moved or removed.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-brand px-5 font-medium text-white transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </main>
  );
}
