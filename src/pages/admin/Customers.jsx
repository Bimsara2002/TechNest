import { useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import Field, { Input } from "../../components/ui/Field.jsx";
import { EmptyState, ErrorState } from "../../components/ui/States.jsx";
import { UserIcon } from "../../components/icons.jsx";
import { formatDate } from "../../lib/format.js";
import { useAuth } from "../../hooks/useAuth.js";
import {
  useCustomers,
  useSetCustomerBlocked,
  useSetCustomerRole,
} from "../../hooks/useAdmin.js";
import { useToast } from "../../store/toastStore.js";

const actionClass =
  "inline-flex min-h-11 items-center rounded-xl px-3 text-xs font-semibold transition-colors disabled:opacity-40";

export default function Customers() {
  const [term, setTerm] = useState("");
  const toast = useToast();
  const { user } = useAuth();
  const { data: customers, isPending, isError, error, refetch } = useCustomers();
  const setBlocked = useSetCustomerBlocked();
  const setRole = useSetCustomerRole();

  const query = term.trim().toLowerCase();
  const rows = (customers ?? []).filter(
    (customer) =>
      !query ||
      customer.full_name?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.phone?.includes(query),
  );

  const busy = setBlocked.isPending || setRole.isPending;

  const toggleBlocked = (customer) =>
    setBlocked.mutate(
      { id: customer.id, blocked: !customer.blocked },
      {
        onSuccess: () =>
          toast(
            customer.blocked
              ? `${customer.full_name || "Account"} can order again`
              : `${customer.full_name || "Account"} is on hold`,
          ),
        onError: (mutationError) => toast(mutationError.message, "error"),
      },
    );

  const toggleRole = (customer) => {
    const next = customer.role === "admin" ? "customer" : "admin";

    // Worth a confirmation: an admin can read every order and every account.
    const ok = window.confirm(
      next === "admin"
        ? `Make ${customer.email} an admin? They will be able to see every order and manage the whole shop.`
        : `Remove admin access from ${customer.email}?`,
    );
    if (!ok) return;

    setRole.mutate(
      { id: customer.id, role: next },
      {
        onSuccess: () => toast(`${customer.email} is now ${next === "admin" ? "an admin" : "a customer"}`),
        onError: (mutationError) => toast(mutationError.message, "error"),
      },
    );
  };

  const columns = [
    {
      key: "name",
      header: "Customer",
      render: (customer) => (
        <div className="min-w-0">
          <p className="truncate font-medium">
            {customer.full_name?.trim() || "No name yet"}
            {customer.id === user?.id ? (
              <span className="ml-2 text-xs font-semibold text-brand">You</span>
            ) : null}
          </p>
          <p className="truncate text-xs text-slate-500">{customer.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (customer) =>
        customer.phone ? (
          <a href={`tel:${customer.phone}`} className="text-brand hover:underline">
            {customer.phone}
          </a>
        ) : (
          <span className="text-slate-400">Not given</span>
        ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (customer) => formatDate(customer.created_at),
    },
    {
      key: "status",
      header: "Status",
      render: (customer) => (
        <div className="flex flex-wrap items-center justify-end gap-1.5 xl:justify-start">
          <Badge tone={customer.role === "admin" ? "brand" : "neutral"}>
            {customer.role === "admin" ? "Admin" : "Customer"}
          </Badge>
          {customer.blocked ? <Badge tone="danger">On hold</Badge> : null}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (customer) => {
        // The database refuses both of these on your own row - blocking
        // yourself would lock you out of this screen, and demoting yourself
        // could leave the shop with no admin. Disabled here so the refusal
        // never has to be shown.
        const isSelf = customer.id === user?.id;

        return (
          <div className="flex flex-wrap justify-end gap-1">
            <button
              type="button"
              disabled={isSelf || busy}
              onClick={() => toggleRole(customer)}
              className={`${actionClass} text-slate-600 hover:bg-slate-100`}
            >
              {customer.role === "admin" ? "Make customer" : "Make admin"}
            </button>
            <button
              type="button"
              disabled={isSelf || busy}
              onClick={() => toggleBlocked(customer)}
              className={`${actionClass} ${
                customer.blocked
                  ? "text-emerald-700 hover:bg-emerald-50"
                  : "text-rose-600 hover:bg-rose-50"
              }`}
            >
              {customer.blocked ? "Unblock" : "Block"}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader
        title="Customers"
        subtitle="Everyone with an account. Roles and holds are enforced in the database, not here."
      >
        {customers ? (
          <Badge tone="neutral">
            {customers.length} account{customers.length === 1 ? "" : "s"}
          </Badge>
        ) : null}
      </AdminHeader>

      <div className="mt-6 max-w-sm">
        <Field label="Search">
          <Input
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Name, email or phone"
          />
        </Field>
      </div>

      <div className="mt-5">
        {isError ? (
          <ErrorState
            title="Could not load customers"
            message={error?.message}
            onRetry={refetch}
          />
        ) : isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(customer) => customer.id}
            empty={
              <EmptyState
                icon={UserIcon}
                title={query ? "Nobody matches that" : "No accounts yet"}
                message={
                  query
                    ? "Try part of a name, an email address or a phone number."
                    : "Accounts appear here as soon as customers register."
                }
              />
            }
          />
        )}
      </div>
    </div>
  );
}
