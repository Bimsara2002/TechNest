import { Link } from "react-router-dom";
import {
  AccessoryIcon,
  AudioIcon,
  LaptopIcon,
  MobileIcon,
  TabletIcon,
  WatchIcon,
} from "./icons.jsx";

const icons = {
  mobiles: MobileIcon,
  laptops: LaptopIcon,
  tablets: TabletIcon,
  accessories: AccessoryIcon,
  audio: AudioIcon,
  watches: WatchIcon,
};

export default function CategoryTile({ category }) {
  const Icon = icons[category.slug] ?? MobileIcon;

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-brand-100"
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
        <Icon className="size-7" />
      </span>
      <span className="text-sm font-semibold leading-tight">{category.name}</span>
      <span className="text-xs text-slate-500">{category.blurb}</span>
    </Link>
  );
}
