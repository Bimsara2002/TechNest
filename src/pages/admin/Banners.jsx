import { useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import BannerForm from "../../components/admin/BannerForm.jsx";
import Reveal3D from "../../components/ui/Reveal3D.jsx";
import Stagger from "../../components/ui/Stagger.jsx";
import Tilt from "../../components/ui/Tilt.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { EmptyState, ErrorState } from "../../components/ui/States.jsx";
import {
  useBanners,
  useDeleteBanner,
  useSaveBanner,
} from "../../hooks/useAdmin.js";
import { useToast } from "../../store/toastStore.js";

export default function Banners() {
  const [editing, setEditing] = useState(null);
  const toast = useToast();
  const { data: banners, isPending, isError, error, refetch } = useBanners();
  const save = useSaveBanner();
  const remove = useDeleteBanner();

  const close = () => {
    setEditing(null);
    save.reset();
  };

  const onSubmit = (values) =>
    save.mutate(values, {
      onSuccess: () => {
        toast(values.id ? "Banner saved" : "Banner added");
        close();
      },
    });

  const onDelete = (banner) => {
    if (!window.confirm(`Delete "${banner.headline}"? This cannot be undone.`)) return;

    remove.mutate(banner.id, {
      onSuccess: () => {
        toast("Banner deleted");
        if (editing?.id === banner.id) close();
      },
      onError: (deleteError) => toast(deleteError.message, "error"),
    });
  };

  const toggleLive = (banner) =>
    save.mutate(
      { ...banner, is_active: !banner.is_active },
      {
        onSuccess: () => toast(banner.is_active ? "Banner hidden" : "Banner is live"),
        onError: (saveError) => toast(saveError.message, "error"),
      },
    );

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader
        title="Homepage banners"
        subtitle="Change the hero without touching code."
      >
        {editing ? null : <Button onClick={() => setEditing("new")}>Add banner</Button>}
      </AdminHeader>

      {editing ? (
        <div className="mt-6">
          <BannerForm
            key={editing === "new" ? "new" : editing.id}
            banner={editing === "new" ? null : editing}
            onSubmit={onSubmit}
            onCancel={close}
            error={save.error}
            isSaving={save.isPending}
          />
        </div>
      ) : null}

      {isError ? (
        <div className="mt-6">
          <ErrorState
            title="Could not load banners"
            message={error?.message}
            onRetry={refetch}
          />
        </div>
      ) : isPending ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No banners yet"
            message="Add one and it appears on the home page as soon as it is live."
          />
        </div>
      ) : (
        <Stagger className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {banners.map((banner) => (
            <Tilt key={banner.id} max={9} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 transform-3d transition-shadow duration-300 hover:shadow-lift">
                <div className="mesh-surface relative flex aspect-16/7 items-end p-4">
                  {banner.image_url ? (
                    <img
                      src={banner.image_url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : null}

                  <p className="relative text-sm font-bold text-white drop-shadow">
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
                  <p className="mt-0.5 truncate font-mono text-sm">
                    {banner.link || "Nowhere"}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
                    <span className="text-xs text-slate-500">
                      Position {banner.sort_order}
                    </span>

                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        disabled={save.isPending}
                        onClick={() => toggleLive(banner)}
                        className="inline-flex min-h-11 items-center rounded-xl px-3 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40"
                      >
                        {banner.is_active ? "Hide" : "Make live"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(banner)}
                        className="inline-flex min-h-11 items-center rounded-xl px-3 text-xs font-semibold text-brand transition-colors hover:bg-brand-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={remove.isPending}
                        onClick={() => onDelete(banner)}
                        className="inline-flex min-h-11 items-center rounded-xl px-3 text-xs font-semibold text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </Tilt>
          ))}
        </Stagger>
      )}

      <Reveal3D className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <h2 className="font-bold">Image guidance</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
          <li>Use a wide image, around 1600 × 700, with the subject to one side.</li>
          <li>Leave the opposite side clear — the headline sits over it.</li>
          <li>
            Export as WebP and keep it under 100 KB. Most customers are on mobile
            data, where a 2 MB hero costs them real money.
          </li>
          <li>
            Upload it to the <span className="font-mono text-xs">banners</span>{" "}
            Storage bucket, then paste the public address here.
          </li>
        </ul>
      </Reveal3D>
    </div>
  );
}
