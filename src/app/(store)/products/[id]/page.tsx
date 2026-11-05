import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import Countdown from "@/components/Countdown";
import LocalTime from "@/components/LocalTime";
import ProductCard from "@/components/ProductCard";
import WishlistButton from "@/components/WishlistButton";
import { getProductDetail } from "@/services/catalog.service";
import { withDiscounts } from "@/services/discount.service";
import { getCategory } from "@/lib/db/categories";
import { getSession } from "@/lib/auth";
import { getWishIds } from "@/lib/wishIds";
import { AppError } from "@/utils/errors";
import { money } from "@/utils/format";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getProductDetail(id).catch((e) => {
    if (e instanceof AppError && e.status === 404) notFound();
    throw e;
  });
  const [[p], related, session, wished, category] = await Promise.all([
    withDiscounts([detail.product]), withDiscounts(detail.related),
    getSession(), getWishIds(), getCategory(detail.product.categoryId),
  ]);

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
            {p.discount && <span className="absolute left-3 top-3 rounded bg-rose-600 px-2.5 py-1 text-sm font-bold text-white">-{p.discount.percent}%</span>}
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

          <div className="flex flex-wrap items-baseline gap-3">
            <span className={`text-3xl font-bold ${p.discount ? "text-rose-600" : ""}`}>{money(p.finalPrice)}</span>
            {p.discount && (
              <>
                <span className="text-lg text-gray-400 line-through">{money(p.price)}</span>
                <span className="rounded bg-rose-600 px-2 py-0.5 text-sm font-semibold text-white">Save {p.discount.percent}%</span>
              </>
            )}
          </div>

          {p.discount && (
            <div className="space-y-2 rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="font-semibold text-rose-700">{p.discount.title || `${p.discount.percent}% OFF`} · ends in</p>
              <Countdown endsAt={p.discount.endsAt} />
              <p className="text-xs text-gray-600">
                Offer valid <LocalTime iso={p.discount.startsAt} /> → <LocalTime iso={p.discount.endsAt} />
              </p>
            </div>
          )}

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