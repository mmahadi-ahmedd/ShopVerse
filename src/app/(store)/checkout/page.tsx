import Link from "next/link";
import { redirect } from "next/navigation";
import CheckoutForm from "@/components/CheckoutForm";
import { getSession } from "@/lib/auth";
import { getCart } from "@/services/cart.service";
import { money } from "@/utils/format";

export default async function CheckoutPage() {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role !== "user") redirect("/");
  const cart = await getCart(s.sub);

  if (cart.items.length === 0) return (
    <div className="py-20 text-center">
      <p className="text-lg font-medium">Your cart is empty</p>
      <Link href="/products" className="mt-2 inline-block text-sm underline">Browse products</Link>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <CheckoutForm />
      </div>
      <aside className="h-fit space-y-3 rounded-xl border bg-white p-5">
        <h2 className="font-semibold">Order summary</h2>
        <ul className="divide-y text-sm">
          {cart.items.map((i) => (
            <li key={i.productId} className="flex justify-between py-2">
              <span>{i.title} × {i.quantity}</span><span>{money(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t pt-3 font-semibold"><span>Total</span><span>{money(cart.subtotal)}</span></div>
      </aside>
    </div>
  );
}