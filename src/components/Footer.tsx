import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const h = "mb-3 font-semibold text-white";
const a = "block py-1 text-sm hover:text-white";

export default function Footer() {
  return (
    <footer className="mt-12 bg-slate-900 text-slate-400">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xl font-extrabold text-white">Shop<span className="text-brand-500">Verse</span></p>
          <p className="mt-3 text-sm">A marketplace where independent sellers meet shoppers who love a good deal.</p>
        </div>
        <div>
          <p className={h}>Shop</p>
          <Link href="/products" className={a}>All products</Link>
          <Link href="/wishlist" className={a}>Wishlist</Link>
          <Link href="/cart" className={a}>Cart</Link>
        </div>
        <div>
          <p className={h}>Company</p>
          <Link href="/about" className={a}>About us</Link>
          <Link href="/about#faq" className={a}>FAQ</Link>
          <Link href="/about#contact" className={a}>Contact</Link>
          <Link href="/register" className={a}>Become a seller</Link>
        </div>
        <div>
          <p className={h}>Get in touch</p>
          <p className="flex items-center gap-2 py-1 text-sm"><Mail className="h-4 w-4" /> support@shopverse.com</p>
          <p className="flex items-center gap-2 py-1 text-sm"><Phone className="h-4 w-4" /> +880 1234 567890</p>
          <p className="flex items-center gap-2 py-1 text-sm"><MapPin className="h-4 w-4" /> Dhaka, Bangladesh</p>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs">© ShopVerse. All rights reserved. Payments secured by Stripe.</div>
    </footer>
  );
}