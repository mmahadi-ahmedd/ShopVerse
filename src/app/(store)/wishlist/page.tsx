import Link from "next/link";
import { redirect } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getSession } from "@/lib/auth";
import { getWishlist } from "@/services/cart.service";
import type { Product } from "@/types";

export default async function WishlistPage() {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role !== "user") redirect("/");
  const items = (await getWishlist(s.sub)).items.filter((p): p is Product => !!p);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your wishlist</h1>
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-medium">Nothing saved yet</p>
          <Link href="/products" className="mt-2 inline-block text-sm underline">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} p={p} wished />)}
        </div>
      )}
    </div>
  );
}