import { useCallback, useEffect, useState } from "react";
import Button from "./ui/Button.jsx";
import Countdown from "./ui/Countdown.jsx";
import Magnetic from "./ui/Magnetic.jsx";
import { offers } from "../lib/offers.js";
import { useToast } from "../store/toastStore.js";

const tones = {
  brand: "bg-linear-to-br from-brand-700 via-brand to-brand-900",
  dark: "bg-brand-dark",
  accent: "mesh-surface animate-gradient",
};

/** Cards recede behind the active one instead of sliding sideways. */
function layerStyle(offset, total) {
  // Anything more than two cards back is hidden, but stays mounted so the
  // transition into view is smooth rather than a pop.
  const depth = Math.min(offset, 3);

  return {
    transform: `translate3d(0, ${depth * -14}px, ${depth * -70}px) scale(${1 - depth * 0.05})`,
    opacity: offset === 0 ? 1 : depth >= 3 ? 0 : 0.55 - (depth - 1) * 0.18,
    zIndex: total - offset,
    pointerEvents: offset === 0 ? "auto" : "none",
  };
}

export default function OfferDeck() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const toast = useToast();

  const count = offers.length;
  const next = useCallback(() => setActive((i) => (i + 1) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [paused, next, count]);

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast(`Code ${code} copied`);
    } catch {
      // Clipboard can be blocked; the code is visible on screen regardless.
      toast(`Use code ${code} at checkout`, "info");
    }
  };

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="stage-3d relative h-72 sm:h-64">
        <div className="absolute inset-0 transform-3d">
          {offers.map((offer, index) => {
            // Distance forward in the deck, wrapping at the end.
            const offset = (index - active + count) % count;

            return (
              <article
                key={offer.id}
                aria-hidden={offset !== 0}
                style={layerStyle(offset, count)}
                className={`absolute inset-0 overflow-hidden rounded-3xl p-6 text-white shadow-lift transition-all duration-600 ease-out sm:p-8 ${tones[offer.tone] ?? tones.brand}`}
              >
                <div className="flex h-full flex-col">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                    {offer.eyebrow}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                    {offer.headline}
                  </h3>

                  <p className="mt-1.5 max-w-md text-sm text-white/80">
                    {offer.subline}
                  </p>

                  {offer.code ? (
                    <button
                      type="button"
                      onClick={() => copyCode(offer.code)}
                      className="mt-4 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-dashed border-white/40 bg-white/10 px-4 font-mono text-sm font-bold tracking-widest backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
                    >
                      {offer.code}
                      <span className="font-sans text-xs font-medium text-white/70">
                        tap to copy
                      </span>
                    </button>
                  ) : null}

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
                    <Magnetic strength={0.25}>
                      <Button
                        to={offer.link}
                        variant="secondary"
                        className="bg-white text-brand-dark hover:bg-brand-50 hover:text-brand-dark"
                      >
                        {offer.cta}
                      </Button>
                    </Magnetic>

                    {offer.endsAt ? (
                      <div className="scale-90 origin-right sm:scale-100">
                        <Countdown endsAt={offer.endsAt} light />
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="mt-5 flex justify-center gap-2">
        {offers.map((offer, index) => (
          <button
            key={offer.id}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show offer: ${offer.headline}`}
            aria-current={index === active}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === active ? "w-8 bg-brand" : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
