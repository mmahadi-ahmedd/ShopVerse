import Link from "next/link";
import StatCard from "@/components/StatCard";
import { requireRole } from "@/lib/auth";
import { getUserById } from "@/lib/db/users";
import { getCart, getWishlist } from "@/services/cart.service";
import { money } from "@/utils/format";

export default async function UserHome() {
  const s = await requireRole("user");
  const [user, cart, wish] = await Promise.all([getUserById(s.sub), getCart(s.sub), getWishlist(s.sub)]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hi, {user?.name}</h1>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Items in cart" value={cart.count} />
        <StatCard label="Cart subtotal" value={money(cart.subtotal)} />
        <StatCard label="Wishlist" value={wish.items.length} />
      </div>
      <div className="flex gap-3">
        <Link href="/cart" className="rounded bg-black px-4 py-2 text-sm text-white">View cart</Link>
        <Link href="/products" className="rounded border px-4 py-2 text-sm">Keep shopping</Link>
      </div>
    </div>
  );
}