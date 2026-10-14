/**
 * Responsive record list: a real table from xl up, stacked cards below.
 *
 * The feature guide asks for "sidebar and tables on laptop, top menu and cards
 * on mobile" — a 7-column table on a 375px screen is unusable, so the same
 * rows render as cards instead of scrolling sideways.
 */
export default function DataTable({ columns, rows, rowKey, empty, onRowClick }) {
  if (rows.length === 0) return empty ?? null;

  return (
    <>
      {/* Laptop: table */}
      <div className="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 xl:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                    column.align === "right" ? "text-right" : ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`transition-colors hover:bg-slate-50 ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-3 ${column.align === "right" ? "text-right" : ""}`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phone and tablet: cards */}
      <ul className="space-y-3 xl:hidden">
        {rows.map((row) => (
          <li
            key={rowKey(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={`rounded-2xl bg-white p-4 ring-1 ring-slate-200 ${
              onRowClick ? "cursor-pointer active:scale-[0.99]" : ""
            } transition-transform`}
          >
            <dl className="space-y-2">
              {columns.map((column) => (
                <div key={column.key} className="flex items-start justify-between gap-3 text-sm">
                  <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                    {column.header}
                  </dt>
                  <dd className="min-w-0 text-right">{column.render(row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
