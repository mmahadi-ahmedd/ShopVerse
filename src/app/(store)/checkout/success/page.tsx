import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { getOrder } from "@/lib/db/orders";
import { confirmPaid } from "@/services/order.service";
import { AppError } from "@/utils/errors";
import { money } from "@/utils/format";
import type { Order } from "@/types";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const s = await getSession();
  if (!s) redirect("/login");
  const { session_id } = await searchParams;
  if (!session_id) notFound();

  let order: Order | null = null;
  let error = "";
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const owned = session.client_reference_id ? await getOrder(session.client_reference_id) : null;
    if (!owned || owned.userId !== s.sub) notFound();
    order = await confirmPaid(session);
  } catch (e) {
    if (e instanceof AppError) error = e.message;
    else throw e;
  }

  return (
    <div className="mx-auto max-w-md space-y-4 py-16 text-center">
      {order ? (
        <>
          <div className="text-5xl">✅</div>
          <h1 className="text-2xl font-bold">Payment successful</h1>
          <p className="text-gray-600">Order <b>#{order.id.slice(0, 8).toUpperCase()}</b> · {money(order.subtotal)}</p>
          <Link href="/dashboard/orders" className="inline-block rounded bg-black px-5 py-2 text-white">View my orders</Link>
        </>
      ) : (
        <>
          <div className="text-5xl">⚠️</div>
          <h1 className="text-2xl font-bold">{error ? "Order cancelled" : "Payment not completed"}</h1>
          <p className="text-gray-600">{error || "We didn't receive a payment for this order."}</p>
          <Link href="/cart" className="inline-block rounded border px-5 py-2">Back to cart</Link>
        </>
      )}
    </div>
  );
}