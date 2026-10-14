import { useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import Stagger from "../../components/ui/Stagger.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { EmptyState } from "../../components/ui/States.jsx";
import { MailIcon } from "../../components/icons.jsx";
import { formatDate } from "../../lib/format.js";
import { sampleMessages } from "../../lib/adminSampleData.js";
import { useToast } from "../../store/toastStore.js";

export default function Messages() {
  const [showRead, setShowRead] = useState(false);
  const toast = useToast();

  const rows = sampleMessages.filter((message) => showRead || !message.is_read);
  const unread = sampleMessages.filter((message) => !message.is_read).length;

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader
        title="Contact messages"
        subtitle="Sent from the contact form. Guests can write in without an account."
      >
        {unread > 0 ? (
          <Badge tone="brand">
            {unread} unread
          </Badge>
        ) : null}
      </AdminHeader>

      <label className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
        <input
          type="checkbox"
          checked={showRead}
          onChange={(event) => setShowRead(event.target.checked)}
          className="size-4 rounded border-slate-300 text-brand focus:ring-brand"
        />
        Show messages already read
      </label>

      {rows.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={MailIcon}
            title="Inbox clear"
            message="Every message has been read. New ones land here straight away."
          />
        </div>
      ) : (
        <Stagger className="mt-4 space-y-3">
          {rows.map((message) => (
            <article
              key={message.id}
              className={`rounded-2xl p-5 ring-1 transition-shadow duration-300 hover:shadow-card ${
                message.is_read
                  ? "bg-white ring-slate-200"
                  : "bg-white ring-brand-100 shadow-card"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{message.name}</h3>
                    {!message.is_read ? <Badge tone="brand">New</Badge> : null}
                  </div>
                  <a
                    href={`mailto:${message.email}`}
                    className="text-sm text-brand hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
                <time className="text-xs text-slate-500">
                  {formatDate(message.created_at)}
                </time>
              </div>

              <p className="mt-3 leading-relaxed text-slate-700">{message.message}</p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <a
                  href={`mailto:${message.email}`}
                  className="inline-flex min-h-11 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-white transition-all hover:bg-brand-700 active:scale-95"
                >
                  Reply by email
                </a>
                <button
                  type="button"
                  onClick={() => toast("Marking as read arrives in Phase 2", "info")}
                  className="inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                >
                  {message.is_read ? "Mark unread" : "Mark as read"}
                </button>
              </div>
            </article>
          ))}
        </Stagger>
      )}
    </div>
  );
}
