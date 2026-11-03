import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

const HOME = { admin: "/admin", seller: "/seller", user: "/dashboard" } as const;

export default async function Navbar() {
  const s = await getSession();
  return (
    <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-bold">ShopVerse</Link>
        <Link href="/products" className="text-sm text-gray-600 hover:text-black">Shop</Link>
        <div className="ml-auto flex items-center gap-4 text-sm">
          {s?.role === "user" && (
            <>
              <Link href="/wishlist">Wishlist</Link>
              <Link href="/cart">Cart</Link>
            </>
          )}
          {s ? (
            <>
              <Link href={HOME[s.role]}>Dashboard</Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register" className="rounded bg-black px-3 py-1.5 text-white">Sign up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}