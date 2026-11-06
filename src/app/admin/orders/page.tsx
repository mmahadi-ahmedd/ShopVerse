import LocalTime from "@/components/LocalTime";
import OrderStatusSelect from "@/components/OrderStatusSelect";
import StatusBadge from "@/components/StatusBadge";
import { listAllOrders } from "@/lib/db/orders";
import { money } from "@/utils/format";
export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const orders = (await listAllOrders()).filter((o) => o.status !== "pending_payment").slice(0, 100);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Orders</h1>
      {orders.length === 0 ? <p className="text-gray-500">No orders yet.</p> : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr><th className="p-3">Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Update</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b align-top last:border-0">
                  <td className="p-3 font-medium">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td>{o.shipping.name}<br /><span className="text-xs text-gray-500">{o.shipping.phone} · {o.shipping.city}</span></td>
                  <td>{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
                  <td>{money(o.subtotal)}</td>
                  <td><LocalTime iso={o.createdAt} /></td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="pr-3"><OrderStatusSelect id={o.id} status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}