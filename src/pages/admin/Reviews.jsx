import { useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import Stagger from "../../components/ui/Stagger.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { EmptyState } from "../../components/ui/States.jsx";
import { StarIcon } from "../../components/icons.jsx";
import { formatDate } from "../../lib/format.js";
import { sampleReviews } from "../../lib/adminSampleData.js";
import { useToast } from "../../store/toastStore.js";

const filters = [
  { value: "pending", label: "Awaiting approval" },
  { value: "approved", label: "Published" },
  { value: "all", label: "All" },
];

function Stars({ rating }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          filled={index < rating}
          className={`size-4 ${index < rating ? "text-amber-400" : "text-slate-200"}`}
        />
      ))}
    </span>
  );
}

export default function Reviews() {
  const [filter, setFilter] = useState("pending");
  const toast = useToast();

  const rows = sampleReviews.filter((review) => {
    if (filter === "all") return true;
    return filter === "approved" ? review.approved : !review.approved;
  });

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader
        title="Review moderation"
        subtitle="Only customers who bought the product can leave one — the database enforces that."
      />

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {filters.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`inline-flex min-h-11 shrink-0 items-center rounded-xl px-4 text-sm font-medium transition-all duration-200 ${
              filter === option.value
                ? "bg-brand-dark text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Nothing to moderate"
            message="New reviews will appear here for approval before they go live."
          />
        </div>
      ) : (
        <Stagger className="mt-5 space-y-3">
          {rows.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 transition-shadow duration-300 hover:shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{review.product}</h3>
                    <Badge tone={review.approved ? "success" : "warning"}>
                      {review.approved ? "Published" : "Pending"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {review.author} · {formatDate(review.created_at)}
                  </p>
                </div>
                <Stars rating={review.rating} />
              </div>

              <p className="mt-3 leading-relaxed text-slate-700">{review.comment}</p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => toast("Moderation arrives in Phase 2", "info")}
                  className="inline-flex min-h-11 items-center rounded-xl bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition-all hover:bg-emerald-100 active:scale-95"
                >
                  {review.approved ? "Unpublish" : "Approve"}
                </button>
                <button
                  type="button"
                  onClick={() => toast("Moderation arrives in Phase 2", "info")}
                  className="inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </Stagger>
      )}
    </div>
  );
}
