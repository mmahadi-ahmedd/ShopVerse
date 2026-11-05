import Link from "next/link";
import Image from "next/image";
import WishlistButton from "./WishlistButton";
import { money } from "@/utils/format";
import type { ProductView } from "@/types";

export default function ProductCard({ p, wished }: { p: ProductView; wished: boolean }) {
  const img = p.discount?.image ?? p.images[0];
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-white">
      <Link href={`/products/${p.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {img ? (
            <Image src={img} alt={p.title} fill sizes="(min-width:1024px) 25vw, 50vw"
              className="object-cover transition group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">No image</div>
          )}
          {p.discount && (
            <span className="absolute left-2 top-2 rounded bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">-{p.discount.percent}%</span>
          )}
        </div>
        <div className="p-3">
          <h3 className="line-clamp-1 font-medium">{p.title}</h3>
          <p className="flex items-baseline gap-2 text-sm">
            <span className={p.discount ? "font-semibold text-rose-600" : "text-gray-700"}>{money(p.finalPrice)}</span>
            {p.discount && <span className="text-xs text-gray-400 line-through">{money(p.price)}</span>}
          </p>
          {p.stock === 0 && <p className="text-xs text-red-600">Out of stock</p>}
        </div>
      </Link>
      <WishlistButton productId={p.id} initial={wished} />
    </div>
  );
}