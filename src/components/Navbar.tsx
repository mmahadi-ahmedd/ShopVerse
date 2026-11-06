import Link from "next/link";
import { getSession } from "@/lib/auth";
import NavMenu from "./NavMenu";

const HOME = { admin: "/admin", seller: "/seller", user: "/dashboard" } as const;

export default async function Navbar() {
  const s = await getSession();

  const links = [
    { href: "/products", label: "Shop" },
    ...(s?.role === "user" ? [{ href: "/wishlist", label: "Wishlist" }, { href: "/cart", label: "Cart" }] : []),
    ...(s ? [{ href: HOME[s.role], label: "Dashboard" }] : [{ href: "/login", label: "Login" }]),
  ];

  return (
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">ShopVerse</Link>
        <NavMenu links={links} loggedIn={!!s} />
      </nav>
    </header>
  );
}