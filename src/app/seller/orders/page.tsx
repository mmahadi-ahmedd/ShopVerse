import LocalTime from "@/components/LocalTime";
import StatusBadge from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { listSellerOrders } from "@/services/order.service";
import { money } from "@/utils/format";

export default async function SellerOrders() {
  const s = await requireRole("seller");
  const orders = await listSellerOrders(s.sub);
  const earned = orders.reduce((n, o) => n + o.subtotal, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-gray-500">Total sales: <b>{money(earned)}</b></p>
      </div>
      {orders.length === 0 ? <p className="py-10 text-center text-gray-500">No paid orders yet.</p> : orders.map((o) => (
        <div key={o.orderId} className="space-y-2 rounded-xl border bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold">#{o.orderId.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-gray-500"><LocalTime iso={o.createdAt} /> · {o.shipping.name}, {o.shipping.city}</p>
            </div>
            <StatusBadge status={o.status} />
          </div>
          <ul className="divide-y text-sm">
            {o.items.map((i) => (
              <li key={i.productId} className="flex justify-between py-1.5">
                <span>{i.title} × {i.quantity}</span><span>{money(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="text-right text-sm font-semibold">{money(o.subtotal)}</p>
        </div>
      ))}
    </div>
  );
}