import Link from "next/link";
import Image from "next/image";
import WishlistButton from "./WishlistButton";
import { money } from "@/utils/format";
import type { Product } from "@/types";

export default function ProductCard({ p, wished }: { p: Product; wished: boolean }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-white">
      <Link href={`/products/${p.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {p.images[0] ? (
            <Image src={p.images[0]} alt={p.title} fill sizes="(min-width:1024px) 25vw, 50vw"
              className="object-cover transition group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">No image</div>
          )}
        </div>
        <div className="p-3">
          <h3 className="line-clamp-1 font-medium">{p.title}</h3>
          <p className="text-sm text-gray-600">{money(p.price)}</p>
          {p.stock === 0 && <p className="text-xs text-red-600">Out of stock</p>}
        </div>
      </Link>
      <WishlistButton productId={p.id} initial={wished} />
    </div>
  );
}