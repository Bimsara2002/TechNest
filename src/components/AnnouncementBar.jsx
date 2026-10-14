import { useEffect, useState } from "react";
import Container from "./ui/Container.jsx";
import { CloseIcon, TruckIcon } from "./icons.jsx";
import { announcements } from "../lib/offers.js";

const STORAGE_KEY = "technest-announcement-dismissed";

/**
 * Rotating offer ticker.
 *
 * This was a rotating 3D prism and it was a mistake: without backface culling
 * the far faces showed through as mirrored text, and the geometry depended on
 * the bar's exact pixel height, so any wrap broke it. Legibility matters more
 * than the trick here, so it is now a vertical slide — only one message is
 * ever in the box, and it cannot overlap its neighbours.
 */
export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Private mode or blocked storage: show the bar rather than hiding it.
      return false;
    }
  });

  const count = announcements.length;

  useEffect(() => {
    if (dismissed || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => setIndex((i) => (i + 1) % count), 4500);
    return () => clearInterval(id);
  }, [dismissed, count]);

  if (dismissed || count === 0) return null;

  const close = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Not being able to remember the dismissal is not worth failing over.
    }
  };

  return (
    <div className="relative bg-brand text-white">
      <Container>
        <div className="flex items-center gap-3">
          <TruckIcon className="hidden size-4 shrink-0 text-white/70 sm:block" />

          {/* Fixed-height window. Exactly one message is visible at a time. */}
          <div className="relative h-10 flex-1 overflow-hidden" aria-live="polite">
            {announcements.map((text, i) => {
              const active = i === index;

              return (
                <p
                  key={text}
                  aria-hidden={!active}
                  className={`absolute inset-0 flex items-center justify-center px-2 text-center text-xs font-semibold leading-tight transition-all duration-500 ease-out sm:text-sm ${
                    active
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-3 opacity-0"
                  }`}
                >
                  {text}
                </p>
              );
            })}
          </div>

          {/* Progress dots, so the bar reads as a rotating set rather than a glitch */}
          <div className="hidden items-center gap-1.5 sm:flex">
            {announcements.map((text, i) => (
              <button
                key={text}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show offer ${i + 1} of ${count}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Dismiss offers bar"
            className="-mr-2 inline-flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-white/15"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
      </Container>
    </div>
  );
}
