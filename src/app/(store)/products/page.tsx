import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { listProducts } from "@/services/catalog.service";
import { listCategories } from "@/lib/db/categories";
import { getWishIds } from "@/lib/wishIds";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const params = new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]);
  const [{ items, nextCursor }, categories, wished] = await Promise.all([
    listProducts(params), listCategories(), getWishIds(),
  ]);

  const base = new URLSearchParams(params);
  base.delete("cursor");
  const next = nextCursor ? new URLSearchParams({ ...Object.fromEntries(base), cursor: nextCursor }) : null;
  const input = "rounded border px-3 py-2 text-sm";

  return (
    <div className="space-y-6">
      <form className="flex flex-wrap gap-2">
        <input name="q" defaultValue={sp.q} placeholder="Search products…" className={`${input} min-w-48 flex-1`} />
        <select name="category" defaultValue={sp.category ?? ""} className={input}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input name="min" type="number" min={0} defaultValue={sp.min} placeholder="Min $" className={`${input} w-24`} />
        <input name="max" type="number" min={0} defaultValue={sp.max} placeholder="Max $" className={`${input} w-24`} />
        <button className="rounded bg-black px-4 py-2 text-sm text-white">Filter</button>
      </form>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-medium">No products found</p>
          <Link href="/products" className="mt-2 inline-block text-sm underline">Clear filters</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} p={p} wished={wished.has(p.id)} />)}
        </div>
      )}

      <div className="flex justify-between text-sm">
        {sp.cursor ? <Link href={`/products?${base}`} className="underline">← First page</Link> : <span />}
        {next && <Link href={`/products?${next}`} className="underline">Next page →</Link>}
      </div>
    </div>
  );
}