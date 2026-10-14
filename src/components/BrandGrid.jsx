import { Link } from "react-router-dom";
import Tilt from "./ui/Tilt.jsx";
import Stagger from "./ui/Stagger.jsx";
import BrandLogo from "./BrandLogo.jsx";
import { brandList } from "../lib/brandList.js";
import { useProducts } from "../hooks/useProducts.js";

/**
 * "Shop by brand" tiles. Each one states how many products it actually has,
 * so a brand we do not stock yet says so rather than leading to an empty page.
 */
export default function BrandGrid() {
  const { data: products } = useProducts({});

  const countFor = (name) =>
    products?.filter((product) => product.brand === name).length ?? 0;

  return (
    <Stagger
      step={40}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
    >
      {brandList.map((brand) => {
        const count = countFor(brand.name);

        const inner = (
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 text-center ring-1 ring-slate-200 transform-3d transition-shadow duration-300 group-hover:shadow-lift group-hover:ring-brand-100">
            <span
              className={`depth-md flex h-9 items-center ${
                brand.stocked ? "text-brand-dark" : "text-slate-300"
              }`}
            >
              {brand.slug ? (
                <BrandLogo slug={brand.slug} className="h-7 w-auto" />
              ) : (
                <span className="text-base font-bold tracking-wide">{brand.name}</span>
              )}
            </span>

            <span className="depth-sm text-xs font-semibold">{brand.name}</span>

            <span
              className={`text-[11px] ${brand.stocked ? "text-slate-500" : "text-slate-400"}`}
            >
              {brand.stocked
                ? `${count} product${count === 1 ? "" : "s"}`
                : "Coming soon"}
            </span>
          </div>
        );

        if (!brand.stocked) {
          return (
            <div key={brand.name} className="group h-full opacity-70">
              {inner}
            </div>
          );
        }

        return (
          <Tilt key={brand.name} max={10} scale={1.04} className="group h-full">
            <Link
              to={`/products?brand=${encodeURIComponent(brand.name)}`}
              className="block h-full"
              aria-label={`${brand.name}, ${count} products`}
            >
              {inner}
            </Link>
          </Tilt>
        );
      })}
    </Stagger>
  );
}
