import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo.jsx";
import { brandList } from "../lib/brandList.js";

/**
 * Endlessly scrolling brand strip, tilted back slightly so it reads as a band
 * running through the page rather than a flat row.
 *
 * The list is rendered twice and the track translates exactly -50%, so the
 * second copy lands where the first began and the loop is seamless. The track
 * pauses on hover so a logo can actually be clicked.
 *
 * Brands with no stock yet are shown but not linked: sending a customer to an
 * empty result page from a logo would read as a broken shop.
 */
function Mark({ brand }) {
  return brand.slug ? (
    <BrandLogo slug={brand.slug} className="h-6 w-auto" />
  ) : (
    <span className="text-sm font-bold tracking-wide">{brand.name}</span>
  );
}

const chip =
  "inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-white px-6 ring-1 ring-slate-200 transition-all duration-300";

export default function BrandMarquee() {
  const row = [...brandList, ...brandList];

  return (
    <div className="stage-3d overflow-hidden py-6">
      <div className="transform-[rotateX(18deg)]">
        {/* Fade the edges so logos enter and leave rather than being cut off */}
        <div className="relative mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex w-max gap-3 hover:[animation-play-state:paused]">
            {row.map((brand, index) => {
              const duplicate = index >= brandList.length;
              const key = `${brand.name}-${index}`;

              if (!brand.stocked) {
                return (
                  <span
                    key={key}
                    aria-hidden="true"
                    title={`${brand.name} — coming soon`}
                    className={`${chip} text-slate-300`}
                  >
                    <Mark brand={brand} />
                  </span>
                );
              }

              return (
                <Link
                  key={key}
                  to={`/products?brand=${encodeURIComponent(brand.name)}`}
                  aria-hidden={duplicate}
                  tabIndex={duplicate ? -1 : 0}
                  title={brand.name}
                  className={`${chip} text-slate-400 hover:text-brand hover:ring-brand`}
                >
                  <Mark brand={brand} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
