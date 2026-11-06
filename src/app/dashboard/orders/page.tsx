import Link from "next/link";
import LocalTime from "@/components/LocalTime";
import StatusBadge from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { listUserOrders } from "@/lib/db/orders";
import { money } from "@/utils/format";

export default async function UserOrders() {
  const s = await requireRole("user");
  const orders = (await listUserOrders(s.sub)).filter((o) => o.status !== "pending_payment");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My orders</h1>
      {orders.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          <p>No orders yet.</p>
          <Link href="/products" className="text-sm underline">Start shopping</Link>
        </div>
      ) : orders.map((o) => (
        <div key={o.id} className="space-y-3 rounded-xl border bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold">#{o.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-gray-500"><LocalTime iso={o.createdAt} /></p>
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
          <div className="flex justify-between border-t pt-2 text-sm">
            <span className="text-gray-500">Ship to {o.shipping.city}</span>
            <span className="font-semibold">{money(o.subtotal)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}