import { useEffect, useState } from "react";
import Container from "./ui/Container.jsx";
import { CloseIcon } from "./icons.jsx";
import { announcements } from "../lib/offers.js";

const STORAGE_KEY = "technest-announcement-dismissed";
const HEIGHT = 40; // px — the prism geometry below depends on this

/**
 * Offer ticker that rotates like a prism: the strip is a solid with one face
 * per message, turning on its X axis.
 *
 * The faces are placed by the standard prism formula rather than a hardcoded
 * 20px, so adding a fifth message does not silently break the geometry.
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

    const id = setInterval(() => setIndex((i) => (i + 1) % count), 4200);
    return () => clearInterval(id);
  }, [dismissed, count]);

  if (dismissed || count === 0) return null;

  const step = 360 / count;
  // Distance from the axis to each face, for a regular prism of n sides.
  const depth = HEIGHT / 2 / Math.tan(Math.PI / count);

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
        <div className="flex items-center gap-2">
          <div
            className="stage-3d flex-1 overflow-hidden"
            style={{ height: HEIGHT }}
            aria-live="polite"
          >
            <div
              className="relative size-full transform-3d transition-transform duration-700 ease-out"
              style={{ transform: `rotateX(${-index * step}deg)` }}
            >
              {announcements.map((text, i) => (
                <p
                  key={text}
                  aria-hidden={i !== index}
                  className="absolute inset-0 flex items-center justify-center px-2 text-center text-xs font-semibold sm:text-sm"
                  style={{
                    transform: `rotateX(${i * step}deg) translateZ(${depth}px)`,
                  }}
                >
                  {text}
                </p>
              ))}
            </div>
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
