import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import WishlistButton from "@/components/WishlistButton";
import { getProductDetail } from "@/services/catalog.service";
import { getCategory } from "@/lib/db/categories";
import { getSession } from "@/lib/auth";
import { getWishIds } from "@/lib/wishIds";
import { AppError } from "@/utils/errors";
import { money } from "@/utils/format";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { product: p, related } = await getProductDetail(id).catch((e) => {
    if (e instanceof AppError && e.status === 404) notFound();
    throw e;
  });
  const [session, wished, category] = await Promise.all([getSession(), getWishIds(), getCategory(p.categoryId)]);

  return (
    <div className="space-y-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            {p.images[0] ? (
              <Image src={p.images[0]} alt={p.title} fill priority sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">No image</div>
            )}
            <WishlistButton productId={p.id} initial={wished.has(p.id)} />
          </div>
          {p.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {p.images.slice(1).map((src) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <Image src={src} alt="" fill sizes="10vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {category && <p className="text-sm text-gray-500">{category.name}</p>}
          <h1 className="text-3xl font-bold">{p.title}</h1>
          <p className="text-2xl">{money(p.price)}</p>
          <p className="whitespace-pre-line text-gray-700">{p.description}</p>
          <p className="text-sm text-gray-500">{p.stock > 0 ? `${p.stock} in stock` : ""}</p>
          {(!session || session.role === "user") && <AddToCart productId={p.id} stock={p.stock} />}
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold">Related products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((r) => <ProductCard key={r.id} p={r} wished={wished.has(r.id)} />)}
          </div>
        </section>
      )}
    </div>
  );
}