import AdminHeader from "../../components/admin/AdminHeader.jsx";
import Reveal3D from "../../components/ui/Reveal3D.jsx";
import Stagger from "../../components/ui/Stagger.jsx";
import Tilt from "../../components/ui/Tilt.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import { sampleBanners } from "../../lib/adminSampleData.js";
import { useToast } from "../../store/toastStore.js";

export default function Banners() {
  const toast = useToast();

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader
        title="Homepage banners"
        subtitle="Change the hero without touching code."
      >
        <Button onClick={() => toast("Banner upload arrives in Phase 2", "info")}>
          Add banner
        </Button>
      </AdminHeader>

      <Stagger className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sampleBanners.map((banner) => (
          <Tilt key={banner.id} max={9} className="h-full">
            <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 transform-3d transition-shadow duration-300 hover:shadow-lift">
              {/* Stand-in for the banner image, using the brand mesh */}
              <div className="mesh-surface animate-gradient relative flex aspect-16/7 items-end p-4">
                <p className="depth-md text-sm font-bold text-white drop-shadow">
                  {banner.headline}
                </p>
                <span className="absolute right-3 top-3">
                  <Badge tone={banner.is_active ? "success" : "neutral"}>
                    {banner.is_active ? "Live" : "Hidden"}
                  </Badge>
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Links to
                </p>
                <p className="mt-0.5 truncate font-mono text-sm">{banner.link}</p>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-xs text-slate-500">
                    Position {banner.sort_order}
                  </span>
                  <button
                    type="button"
                    onClick={() => toast("Editing banners arrives in Phase 2", "info")}
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-brand transition-colors hover:text-brand-700"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </article>
          </Tilt>
        ))}
      </Stagger>

      <Reveal3D className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <h2 className="font-bold">Image guidance</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
          <li>Use a wide image, around 1600 × 700, with the subject to one side.</li>
          <li>Leave the opposite side clear — the headline sits over it.</li>
          <li>
            Export as WebP and keep it under 100 KB. Most customers are on mobile
            data.
          </li>
        </ul>
      </Reveal3D>
    </div>
  );
}
