import { Link } from "react-router-dom";
import Tilt from "./ui/Tilt.jsx";
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
    <Tilt max={12} scale={1.04} className="h-full">
      <Link
        to={`/products?category=${category.slug}`}
        className="group relative flex h-full flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center ring-1 ring-slate-200 transition-shadow duration-300 transform-3d hover:shadow-lift hover:ring-brand-100"
      >
        <span className="depth-md flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
          <Icon className="size-7" />
        </span>
        <span className="depth-sm text-sm font-semibold leading-tight">{category.name}</span>
        <span className="text-xs text-slate-500">{category.blurb}</span>
      </Link>
    </Tilt>
  );
}
