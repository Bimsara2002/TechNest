import { useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import StatCard from "../../components/admin/StatCard.jsx";
import RevenueChart from "../../components/admin/RevenueChart.jsx";
import TopSellersChart from "../../components/admin/TopSellersChart.jsx";
import Reveal3D from "../../components/ui/Reveal3D.jsx";
import Stagger from "../../components/ui/Stagger.jsx";
import Button from "../../components/ui/Button.jsx";
import { CartIcon, CashIcon, TruckIcon } from "../../components/icons.jsx";
import { formatPrice } from "../../lib/format.js";
import { monthlyRevenue, topSellers } from "../../lib/adminSampleData.js";
import { useToast } from "../../store/toastStore.js";

export default function Reports() {
  const [showTable, setShowTable] = useState(false);
  const toast = useToast();

  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const totalOrders = monthlyRevenue.reduce((sum, m) => sum + m.orders, 0);
  const averageOrder = Math.round(totalRevenue / totalOrders);

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader title="Reports" subtitle="The last six months of trading.">
        <Button
          variant="secondary"
          onClick={() => toast("CSV export arrives in Phase 2", "info")}
        >
          Export CSV
        </Button>
      </AdminHeader>

      {/* Headline figures are stat tiles, not charts: three numbers do not need
          axes, and a chart of three values would say less. */}
      <Stagger className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Revenue"
          value={totalRevenue}
          format={formatPrice}
          Icon={CashIcon}
          tone="success"
          hint="Last 6 months"
        />
        <StatCard
          label="Orders"
          value={totalOrders}
          Icon={CartIcon}
          hint="Last 6 months"
        />
        <StatCard
          label="Average order"
          value={averageOrder}
          format={formatPrice}
          Icon={TruckIcon}
          hint="Revenue ÷ orders"
        />
      </Stagger>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr] xl:items-start">
        <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">Revenue by month</h2>
              <p className="mt-0.5 text-sm text-slate-600">
                Hover or focus a month for the exact figure.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTable((v) => !v)}
              aria-pressed={showTable}
              className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-brand transition-colors hover:bg-brand-50"
            >
              {showTable ? "Show chart" : "Show as table"}
            </button>
          </div>

          <div className="mt-4">
            {showTable ? (
              /* Table view: the same data without relying on sight or hover */
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th scope="col" className="py-2 font-semibold">Month</th>
                    <th scope="col" className="py-2 text-right font-semibold">Revenue</th>
                    <th scope="col" className="py-2 text-right font-semibold">Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyRevenue.map((row) => (
                    <tr key={row.month}>
                      <td className="py-2.5 font-medium">{row.month}</td>
                      <td className="py-2.5 text-right tabular-nums">
                        {formatPrice(row.revenue)}
                      </td>
                      <td className="py-2.5 text-right tabular-nums">{row.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <RevenueChart data={monthlyRevenue} />
            )}
          </div>
        </Reveal3D>

        <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
          <h2 className="font-bold">Best sellers</h2>
          <p className="mt-0.5 text-sm text-slate-600">By units sold.</p>

          <div className="mt-5">
            <TopSellersChart data={topSellers} />
          </div>
        </Reveal3D>
      </div>

      <Reveal3D className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
        Figures are sample data until orders flow through the database. The
        numbers come from <span className="font-mono text-xs">orders</span> and{" "}
        <span className="font-mono text-xs">order_items</span> once step 8 is live.
      </Reveal3D>
    </div>
  );
}
