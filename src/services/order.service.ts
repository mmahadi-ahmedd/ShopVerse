import { nanoid } from "nanoid";
import { z } from "zod";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getCart, clearCart } from "./cart.service";
import { getProductsByIds } from "@/lib/db/products";
import { createOrder, getOrder, getOrdersByIds, listSellerGroups, payOrder, setOrderStatus, setStripeSession } from "@/lib/db/orders";
import { AppError } from "@/utils/errors";
import type { Order, OrderLine, OrderStatus } from "@/types";

const shippingSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[0-9+\-\s]{7,20}$/, "Invalid phone number"),
  address: z.string().trim().min(5).max(200),
  city: z.string().trim().min(2).max(60),
});

export async function startCheckout(user: { id: string; email: string }, input: unknown) {
  const shipping = shippingSchema.parse(input);
  const cart = await getCart(user.id);
  if (!cart.items.length) throw new AppError(400, "Your cart is empty");
  if (cart.items.some((i) => !i.available)) throw new AppError(400, "Some items are unavailable or low on stock. Update your cart first.");

  const products = new Map((await getProductsByIds(cart.items.map((i) => i.productId))).map((p) => [p.id, p]));
  const items: OrderLine[] = cart.items.map((i) => ({
    productId: i.productId, sellerId: products.get(i.productId)!.sellerId,
    title: i.title, image: i.image, price: i.price, quantity: i.quantity,
  }));

  const order: Order = {
    id: nanoid(10), userId: user.id, status: "pending_payment",
    subtotal: cart.subtotal, shipping, items, createdAt: new Date().toISOString(),
  };
  await createOrder(order);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: order.id,
    customer_email: user.email,
    line_items: items.map((i) => ({
      quantity: i.quantity,
      price_data: {
        currency: "usd", unit_amount: Math.round(i.price * 100),
        product_data: { name: i.title, ...(i.image ? { images: [i.image] } : {}) },
      },
    })),
    success_url: `${process.env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/cart`,
  });
  await setStripeSession(order.id, session.id);
  return { url: session.url! };
}


export async function confirmPaid(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid" || !session.client_reference_id) return null;
  const order = await getOrder(session.client_reference_id);
  if (!order) return null;
  if (order.status !== "pending_payment") return order;

  try {
    await payOrder(order);
  } catch (e) {
    if (e instanceof Error && e.name === "TransactionCanceledException") {
      const fresh = await getOrder(order.id);
      if (fresh && fresh.status !== "pending_payment") return fresh; // confirmed concurrently
      if (typeof session.payment_intent === "string") await stripe.refunds.create({ payment_intent: session.payment_intent });
      await setOrderStatus(order.id, "cancelled");
      throw new AppError(409, "An item sold out while you were paying. Your payment has been refunded.");
    }
    throw e;
  }
  await clearCart(order.userId);
  return getOrder(order.id);
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const o = await getOrder(id);
  if (!o) throw new AppError(404, "Order not found");
  if (o.status === "pending_payment" || o.status === "cancelled") throw new AppError(400, "This order cannot be updated");
  await setOrderStatus(id, status);
}

export async function listSellerOrders(sellerId: string) {
  const groups = await listSellerGroups(sellerId);
  const orders = new Map((await getOrdersByIds(groups.map((g) => g.orderId))).map((o) => [o.id, o]));
  return groups.flatMap((g) => {
    const o = orders.get(g.orderId);
    return o && o.status !== "pending_payment" && o.status !== "cancelled" ? [{ ...g, status: o.status, shipping: o.shipping }] : [];
  });
}