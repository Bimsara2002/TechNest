import Container from "./ui/Container.jsx";
import Reveal from "./ui/Reveal.jsx";
import Button from "./ui/Button.jsx";

/**
 * Temporary body for a route that exists but is not built yet, so the skeleton
 * is navigable and each page documents what it owes. Delete the usage as each
 * page gets its real implementation.
 */
export default function PagePlaceholder({ title, summary, features = [], step }) {
  return (
    <Container className="py-10 xl:py-14">
      <Reveal className="max-w-3xl">
        {step ? (
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
            Roadmap step {step}
          </span>
        ) : null}

        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>

        {summary ? (
          <p className="mt-2 max-w-prose leading-relaxed text-slate-600">{summary}</p>
        ) : null}
      </Reveal>

      {features.length > 0 ? (
        <Reveal className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Planned for this page
          </h2>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 rounded-xl bg-white p-3 text-sm text-slate-700 ring-1 ring-slate-200"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
                />
                {feature}
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      <Reveal className="mt-8">
        <Button to="/" variant="secondary">
          Back to home
        </Button>
      </Reveal>
    </Container>
  );
}
