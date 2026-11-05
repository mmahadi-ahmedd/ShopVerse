import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { listProducts } from "@/services/catalog.service";
import { listCategories } from "@/lib/db/categories";
import { getWishIds } from "@/lib/wishIds";
import { withDiscounts } from "@/services/discount.service";

export default async function Home() {
  const [{ items }, categories, wished] = await Promise.all([
    listProducts(new URLSearchParams({ limit: "8" })), listCategories(), getWishIds(),
  ]);

  const products = await withDiscounts(items);
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-r from-black to-gray-700 px-6 py-14 text-white">
        <h1 className="text-3xl font-bold sm:text-5xl">Everything you need, one place.</h1>
        <p className="mt-3 max-w-lg text-gray-300">Discover products from independent sellers.</p>
        <Link href="/products" className="mt-6 inline-block rounded bg-white px-5 py-2 font-medium text-black">Shop now</Link>
      </section>

      {categories.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link key={c.id} href={`/products?category=${c.id}`} className="rounded-full border px-4 py-1.5 text-sm hover:bg-gray-100">{c.name}</Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-xl font-semibold">Latest products</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} p={p} wished={wished.has(p.id)} />)}
          </div>
        )}
      </section>
    </div>
  );
}