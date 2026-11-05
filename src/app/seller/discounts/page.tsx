import DeleteButton from "@/components/DeleteButton";
import DiscountForm from "@/components/DiscountForm";
import LocalTime from "@/components/LocalTime";
import { requireRole } from "@/lib/auth";
import { listSellerProducts } from "@/services/catalog.service";
import { listDiscountsFor } from "@/services/discount.service";

const badge = { upcoming: "bg-amber-100 text-amber-700", active: "bg-green-100 text-green-700", ended: "bg-gray-100 text-gray-500" };

export default async function SellerDiscounts() {
  const s = await requireRole("seller");
  const [{ items: products }, discounts] = await Promise.all([
    listSellerProducts(s, new URLSearchParams({ limit: "48" })), listDiscountsFor(s),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Discounts</h1>
      <DiscountForm products={products.map((p) => ({ id: p.id, title: p.title }))} />
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Your discounts</h2>
        {discounts.length === 0 ? <p className="text-gray-500">No discounts yet.</p> : (
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50"><tr><th className="p-3">Product</th><th>Off</th><th>From</th><th>To</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {discounts.map((d) => (
                  <tr key={d.id} className="border-b last:border-0">
                    <td className="p-3">{d.productTitle}</td>
                    <td>{d.percent}%</td>
                    <td><LocalTime iso={d.startsAt} /></td>
                    <td><LocalTime iso={d.endsAt} /></td>
                    <td><span className={`rounded-full px-2 py-0.5 text-xs ${badge[d.status]}`}>{d.status}</span></td>
                    <td className="pr-3 text-right"><DeleteButton url={`/api/discounts/${d.id}`} confirmText="Delete this discount?" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}