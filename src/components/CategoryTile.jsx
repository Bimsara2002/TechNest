import { Link } from "react-router-dom";
import {
  AccessoryIcon,
  AudioIcon,
  ChevronRightIcon,
  LaptopIcon,
  MobileIcon,
  TabletIcon,
  WatchIcon,
} from "./icons.jsx";

import mobilesImg from "../assets/categories/mobiles.webp";
import laptopsImg from "../assets/categories/laptops.webp";
import tabletsImg from "../assets/categories/tablets.webp";
import audioImg from "../assets/categories/audio.webp";
import watchesImg from "../assets/categories/watches.webp";
import accessoriesImg from "../assets/categories/accessories.webp";

const icons = {
  mobiles: MobileIcon,
  laptops: LaptopIcon,
  tablets: TabletIcon,
  accessories: AccessoryIcon,
  audio: AudioIcon,
  watches: WatchIcon,
};

/** Category photography. See CREDITS.md for source and licence. */
const photos = {
  mobiles: mobilesImg,
  laptops: laptopsImg,
  tablets: tabletsImg,
  audio: audioImg,
  watches: watchesImg,
  accessories: accessoriesImg,
};

/**
 * Flip card: a photograph on the front, the description on the back.
 *
 * Hover-only by nature, so it is an enhancement rather than the way in — on a
 * phone the whole tile is simply a link, and the back face carries nothing the
 * customer needs. The icon survives as a chip so the category still reads at a
 * glance if an image fails to load.
 */
export default function CategoryTile({ category }) {
  const Icon = icons[category.slug] ?? MobileIcon;
  const photo = photos[category.slug];

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group stage-3d block h-40 focus:outline-none"
      aria-label={`${category.name} — ${category.blurb}`}
    >
      <div className="relative size-full transform-3d transition-transform duration-500 ease-out group-hover:rotate-y-180 group-focus-visible:rotate-y-180">
        {/* Front: photograph */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl bg-slate-100 shadow-card ring-1 ring-slate-200 backface-hidden">
          {photo ? (
            <img
              src={photo}
              alt=""
              width="600"
              height="600"
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : null}

          {/* Scrim so the label stays readable over any photo */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-brand-dark/85 via-brand-dark/25 to-transparent"
          />

          <span className="absolute left-3 top-3 flex size-9 items-center justify-center rounded-xl bg-white/90 text-brand backdrop-blur-sm">
            <Icon className="size-5" />
          </span>

          <span className="absolute inset-x-3 bottom-3 text-left text-sm font-bold text-white drop-shadow">
            {category.name}
          </span>
        </div>

        {/* Back: the detail */}
        <div className="absolute inset-0 flex rotate-y-180 flex-col items-center justify-center gap-1.5 rounded-2xl bg-brand-dark p-3 text-center text-white shadow-lift backface-hidden">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-brand">
            <Icon className="size-5" />
          </span>
          <span className="mt-1 text-sm font-semibold">{category.name}</span>
          <span className="text-xs text-slate-300">{category.blurb}</span>
          <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand">
            Browse
            <ChevronRightIcon className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
