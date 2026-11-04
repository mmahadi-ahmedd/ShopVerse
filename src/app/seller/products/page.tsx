import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import { requireRole } from "@/lib/auth";
import { listSellerProducts } from "@/services/catalog.service";
import { money } from "@/utils/format";

export default async function SellerProducts() {
  const s = await requireRole("seller");
  const { items } = await listSellerProducts(s, new URLSearchParams({ limit: "48" }));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My products</h1>
        <Link href="/seller/products/new" className="rounded bg-black px-4 py-2 text-sm text-white">Add product</Link>
      </div>
      {items.length === 0 ? <p className="py-10 text-center text-gray-500">You haven&apos;t added any products yet.</p> : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50"><tr><th className="p-3">Title</th><th>Price</th><th>Stock</th><th></th></tr></thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="p-3">{p.title}</td><td>{money(p.price)}</td><td>{p.stock}</td>
                  <td className="space-x-3 pr-3 text-right">
                    <Link href={`/seller/products/${p.id}/edit`} className="underline">Edit</Link>
                    <DeleteButton url={`/api/products/${p.id}`} confirmText={`Delete "${p.title}"?`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}