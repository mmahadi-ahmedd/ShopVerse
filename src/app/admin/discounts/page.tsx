import DeleteButton from "@/components/DeleteButton";
import FeatureButton from "@/components/FeatureButton";
import LocalTime from "@/components/LocalTime";
import { requireRole } from "@/lib/auth";
import { getFeaturedId } from "@/lib/db/config";
import { listDiscountsFor } from "@/services/discount.service";

const badge = { upcoming: "bg-amber-100 text-amber-700", active: "bg-green-100 text-green-700", ended: "bg-gray-100 text-gray-500" };

export default async function AdminDiscounts() {
  const s = await requireRole("admin");
  const [discounts, featuredId] = await Promise.all([listDiscountsFor(s), getFeaturedId()]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Discounts</h1>
        <p className="text-sm text-gray-500">Pick one discount to show as the big offer popup on the homepage. Only one can be featured at a time.</p>
      </div>
      {discounts.length === 0 ? <p className="text-gray-500">No discounts created by sellers yet.</p> : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr><th className="p-3">Product</th><th>Off</th><th>From</th><th>To</th><th>Status</th><th>Homepage</th><th></th></tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <tr key={d.id} className="border-b last:border-0">
                  <td className="p-3">{d.productTitle}</td>
                  <td>{d.percent}%</td>
                  <td><LocalTime iso={d.startsAt} /></td>
                  <td><LocalTime iso={d.endsAt} /></td>
                  <td><span className={`rounded-full px-2 py-0.5 text-xs ${badge[d.status]}`}>{d.status}</span></td>
                  <td><FeatureButton discountId={d.id} featured={featuredId === d.id} disabled={d.status === "ended"} /></td>
                  <td className="pr-3 text-right"><DeleteButton url={`/api/discounts/${d.id}`} confirmText="Delete this discount?" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}