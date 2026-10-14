import { useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import Stagger from "../../components/ui/Stagger.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { EmptyState, ErrorState } from "../../components/ui/States.jsx";
import { MailIcon } from "../../components/icons.jsx";
import { formatDate } from "../../lib/format.js";
import {
  useDeleteMessage,
  useMessages,
  useSetMessageRead,
} from "../../hooks/useAdmin.js";
import { useToast } from "../../store/toastStore.js";

const buttonClass =
  "inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold transition-colors disabled:opacity-50";

export default function Messages() {
  const [showRead, setShowRead] = useState(false);
  const toast = useToast();
  const { data: messages, isPending, isError, error, refetch } = useMessages();
  const setRead = useSetMessageRead();
  const remove = useDeleteMessage();

  const all = messages ?? [];
  const rows = all.filter((message) => showRead || !message.is_read);
  const unread = all.filter((message) => !message.is_read).length;

  const onError = (mutationError) => toast(mutationError.message, "error");

  const toggleRead = (message) =>
    setRead.mutate({ id: message.id, is_read: !message.is_read }, { onError });

  const onDelete = (message) => {
    // Deleting is the one irreversible action on this screen.
    if (!window.confirm(`Delete the message from ${message.name}? This cannot be undone.`)) {
      return;
    }

    remove.mutate(message.id, {
      onSuccess: () => toast("Message deleted"),
      onError,
    });
  };

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader
        title="Contact messages"
        subtitle="Sent from the contact form. Guests can write in without an account."
      >
        {unread > 0 ? <Badge tone="brand">{unread} unread</Badge> : null}
      </AdminHeader>

      {isError ? (
        <div className="mt-6">
          <ErrorState
            title="Could not load messages"
            message={error?.message}
            onRetry={refetch}
          />
        </div>
      ) : isPending ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-36 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          <label className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={showRead}
              onChange={(event) => setShowRead(event.target.checked)}
              className="size-4 rounded border-slate-300 text-brand focus:ring-brand"
            />
            Show messages already read
            {all.length > 0 ? (
              <span className="text-slate-400">({all.length} in total)</span>
            ) : null}
          </label>

          {rows.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={MailIcon}
                title={all.length === 0 ? "No messages yet" : "Inbox clear"}
                message={
                  all.length === 0
                    ? "Anything sent through the contact form lands here straight away."
                    : "Every message has been read. Tick the box above to see them again."
                }
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

                  {/* Customer-written text: preserve their line breaks, and do
                      not let a long unbroken string stretch the card. */}
                  <p className="mt-3 whitespace-pre-line wrap-break-word leading-relaxed text-slate-700">
                    {message.message}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    <a
                      href={`mailto:${message.email}?subject=${encodeURIComponent(
                        "Re: your message to TechNest",
                      )}`}
                      className={`${buttonClass} bg-brand text-white hover:bg-brand-700 active:scale-95`}
                    >
                      Reply by email
                    </a>
                    <button
                      type="button"
                      disabled={setRead.isPending}
                      onClick={() => toggleRead(message)}
                      className={`${buttonClass} text-slate-600 hover:bg-slate-100`}
                    >
                      {message.is_read ? "Mark unread" : "Mark as read"}
                    </button>
                    <button
                      type="button"
                      disabled={remove.isPending}
                      onClick={() => onDelete(message)}
                      className={`${buttonClass} text-slate-500 hover:bg-rose-50 hover:text-rose-700`}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </Stagger>
          )}
        </>
      )}
    </div>
  );
}
