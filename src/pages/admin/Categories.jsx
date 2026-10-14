import AdminHeader from "../../components/admin/AdminHeader.jsx";
import Reveal3D from "../../components/ui/Reveal3D.jsx";
import Stagger from "../../components/ui/Stagger.jsx";
import Tilt from "../../components/ui/Tilt.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { ErrorState } from "../../components/ui/States.jsx";
import {
  AccessoryIcon,
  AudioIcon,
  LaptopIcon,
  MobileIcon,
  TabletIcon,
  WatchIcon,
} from "../../components/icons.jsx";
import { categories } from "../../lib/sampleProducts.js";
import { brands } from "../../lib/products.js";
import { useProducts } from "../../hooks/useProducts.js";
import { useToast } from "../../store/toastStore.js";

const icons = {
  mobiles: MobileIcon,
  laptops: LaptopIcon,
  tablets: TabletIcon,
  accessories: AccessoryIcon,
  audio: AudioIcon,
  watches: WatchIcon,
};

export default function Categories() {
  const toast = useToast();
  const { data: products, isPending, isError, refetch } = useProducts({});

  const countFor = (slug) =>
    products?.filter((product) => product.category === slug).length ?? 0;

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader
        title="Categories and brands"
        subtitle="How the catalogue is organised for shoppers."
      >
        <Button onClick={() => toast("Adding categories is wired up in step 9", "info")}>
          Add category
        </Button>
      </AdminHeader>

      {isError ? (
        <div className="mt-6">
          <ErrorState onRetry={refetch} />
        </div>
      ) : isPending ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => {
              const Icon = icons[category.slug] ?? MobileIcon;
              const count = countFor(category.slug);

              return (
                <Tilt key={category.slug} max={8} className="h-full">
                  <div className="flex h-full items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200 transform-3d transition-shadow duration-300 hover:shadow-lift">
                    <span className="depth-md flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                      <Icon className="size-6" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{category.name}</h3>
                        <Badge tone={count > 0 ? "brand" : "neutral"}>
                          {count} item{count === 1 ? "" : "s"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{category.blurb}</p>
                      <p className="mt-2 font-mono text-xs text-slate-400">
                        /{category.slug}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toast("Editing categories arrives in step 9", "info")}
                      className="text-sm font-semibold text-brand transition-colors hover:text-brand-700"
                    >
                      Edit
                    </button>
                  </div>
                </Tilt>
              );
            })}
          </Stagger>

          <Reveal3D className="mt-10 rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
            <h2 className="text-lg font-bold">Brands</h2>
            <p className="mt-1 text-sm text-slate-600">
              Shown on product cards and used by the shop filters.
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {brands.map((brand) => (
                <li key={brand}>
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-50 px-4 text-sm font-semibold ring-1 ring-slate-200 transition-all hover:ring-brand">
                    {brand}
                    <span className="text-xs font-normal text-slate-400">
                      {products.filter((p) => p.brand === brand).length}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal3D>
        </>
      )}
    </div>
  );
}
