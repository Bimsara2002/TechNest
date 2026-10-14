import Tilt from "./ui/Tilt.jsx";
import Countdown from "./ui/Countdown.jsx";
import { ChevronRightIcon } from "./icons.jsx";
import { Link } from "react-router-dom";

/**
 * Slim offer strip for pages that are not the home page, where a full deck
 * would get in the way of what the customer came to do.
 */
export default function OfferRibbon({ offer }) {
  if (!offer) return null;

  return (
    <Tilt max={4} scale={1.01}>
      <Link
        to={offer.link}
        className="mesh-surface animate-gradient group flex flex-wrap items-center gap-x-4 gap-y-3 overflow-hidden rounded-2xl p-4 text-white shadow-card transform-3d sm:px-5"
      >
        {/* Thumbnail from sm up — on a phone the strip is already full */}
        {offer.image ? (
          <img
            src={offer.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="depth-sm hidden size-14 shrink-0 rounded-xl bg-white/10 object-contain p-1.5 sm:block"
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">
            {offer.eyebrow}
          </p>
          <p className="mt-0.5 font-bold leading-tight">{offer.headline}</p>
          <p className="mt-0.5 truncate text-sm text-white/80">{offer.subline}</p>
        </div>

        {offer.endsAt ? (
          <div className="scale-90 origin-left sm:origin-center">
            <Countdown endsAt={offer.endsAt} light />
          </div>
        ) : null}

        <span className="depth-sm inline-flex min-h-11 items-center gap-1 whitespace-nowrap rounded-xl bg-white px-4 text-sm font-semibold text-brand-dark transition-transform group-hover:translate-x-0.5">
          {offer.cta}
          <ChevronRightIcon className="size-4" />
        </span>
      </Link>
    </Tilt>
  );
}
