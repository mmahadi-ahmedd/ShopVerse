import Link from "next/link";
import LocalTime from "@/components/LocalTime";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { adminStats } from "@/services/stats.service";
import { money } from "@/utils/format";

export default async function AdminHome() {
  const s = await adminStats();
  const max = Math.max(...s.byDay.map((d) => d.total), 1);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Overview</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Revenue" value={money(s.revenue)} />
        <StatCard label="Orders" value={s.orderCount} />
        <StatCard label="Products" value={s.productCount} />
        <StatCard label="Customers" value={s.buyers} />
        <StatCard label="Sellers" value={s.sellers} />
        <StatCard label="Categories" value={s.categoryCount} />
      </div>

      <div className="rounded-xl border bg-white p-5">
        <h2 className="mb-4 font-semibold">Revenue, last 7 days</h2>
        <div className="flex h-40 items-end gap-2">
          {s.byDay.map((d) => (
            <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span className="text-[10px] text-gray-500">{d.total ? money(d.total) : ""}</span>
              <div className="w-full rounded-t bg-brand-500" style={{ height: `${Math.max((d.total / max) * 100, 2)}%` }} />
              <span className="text-[10px] text-gray-500">{d.day.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>
          {s.recent.length === 0 ? <p className="text-sm text-gray-500">No orders yet.</p> : (
            <ul className="divide-y text-sm">
              {s.recent.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-2 py-2">
                  <div>
                    <p className="font-medium">#{o.id.slice(0, 8).toUpperCase()} · {o.shipping.name}</p>
                    <p className="text-xs text-gray-500"><LocalTime iso={o.createdAt} /></p>
                  </div>
                  <div className="flex items-center gap-3"><StatusBadge status={o.status} /><span className="font-semibold">{money(o.subtotal)}</span></div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Low stock</h2>
            <Link href="/admin/products" className="text-sm text-brand-600 hover:underline">All products</Link>
          </div>
          {s.lowStock.length === 0 ? <p className="text-sm text-gray-500">All products are well stocked.</p> : (
            <ul className="divide-y text-sm">
              {s.lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2">
                  <span>{p.title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${p.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}