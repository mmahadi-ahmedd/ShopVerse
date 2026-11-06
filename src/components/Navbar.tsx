import Link from "next/link";
import { getSession } from "@/lib/auth";
import NavMenu from "./NavMenu";
import SearchBar from "./SearchBar";

const HOME = { admin: "/admin", seller: "/seller", user: "/dashboard" } as const;

export default async function Navbar() {
  const s = await getSession();
  const links = [
    { href: "/products", label: "Shop" },
    { href: "/about", label: "About" },
    ...(s?.role === "user" ? [{ href: "/wishlist", label: "Wishlist" }, { href: "/cart", label: "Cart" }] : []),
    ...(s ? [{ href: HOME[s.role], label: "Dashboard" }] : [{ href: "/login", label: "Login" }]),
  ];

  return (
    <>
      <div className="bg-brand-900 py-1.5 text-center text-xs text-white">
        Free shipping on orders over $50 · Secure card payments
      </div>
      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link href="/" className="text-xl font-extrabold text-brand-600">Shop<span className="text-slate-900">Verse</span></Link>
          <div className="mx-auto hidden w-full max-w-md md:block"><SearchBar /></div>
          <div className="ml-auto md:ml-0"><NavMenu links={links} loggedIn={!!s} /></div>
        </nav>
        <div className="px-4 pb-3 md:hidden"><SearchBar /></div>
      </header>
    </>
  );
}