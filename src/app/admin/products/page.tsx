import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import { listProducts } from "@/services/catalog.service";
import { money } from "@/utils/format";
export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const { items } = await listProducts(new URLSearchParams({ limit: "48" }));
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">All products</h1>
      {items.length === 0 ? <p className="text-gray-500">No products yet.</p> : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50"><tr><th className="p-3">Title</th><th>Price</th><th>Stock</th><th></th></tr></thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="p-3"><Link href={`/products/${p.id}`} className="underline">{p.title}</Link></td>
                  <td>{money(p.price)}</td><td>{p.stock}</td>
                  <td className="pr-3 text-right"><DeleteButton url={`/api/products/${p.id}`} confirmText={`Delete "${p.title}"?`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}