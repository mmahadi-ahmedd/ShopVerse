import { z } from "zod";
import { getProduct, getProductsByIds } from "@/lib/db/products";
import { putEntry, getEntry, listEntries, deleteEntry } from "@/lib/db/userLists";
import { AppError } from "@/utils/errors";
import { activeDiscountMap, finalPrice } from "./discount.service";

const MAX_QTY = 10;
const MAX_LINES = 50;
type CartEntry = { productId: string; quantity: number; addedAt: string };

const addSchema = z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(MAX_QTY).default(1) });
const qtySchema = z.object({ quantity: z.number().int().min(1).max(MAX_QTY) });
const idSchema = z.object({ productId: z.string().min(1) });

async function loadProduct(id: string) {
  const p = await getProduct(id);
  if (!p) throw new AppError(404, "Product not found");
  return p;
}

function checkStock(total: number, stock: number) {
  if (total > MAX_QTY) throw new AppError(400, `Maximum ${MAX_QTY} per item`);
  if (total > stock) throw new AppError(400, stock ? `Only ${stock} in stock` : "Out of stock");
}

export async function getCart(userId: string) {
  const entries = await listEntries<CartEntry>(userId, "CART");
  const map = new Map((await getProductsByIds(entries.map((e) => e.productId))).map((p) => [p.id, p]));
  const discounts = await activeDiscountMap();

  const items = entries.map((e) => {
    const p = map.get(e.productId);
    const d = p ? discounts.get(p.id) : undefined;
    return {
      productId: e.productId, quantity: e.quantity,
      title: p?.title ?? "Unavailable product", slug: p?.slug ?? null,
      price: p ? (d ? finalPrice(p.price, d.percent) : p.price) : 0,
      image: p?.images[0] ?? null,
      stock: p?.stock ?? 0, available: !!p && p.stock >= e.quantity,
    };
  });

  const subtotal = Math.round(items.filter((i) => i.available).reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
  return { items, subtotal, count: items.reduce((n, i) => n + i.quantity, 0) };
}

export async function addToCart(userId: string, input: unknown) {
  const { productId, quantity } = addSchema.parse(input);
  const p = await loadProduct(productId);
  const existing = await getEntry<CartEntry>(userId, "CART", productId);
  if (!existing && (await listEntries(userId, "CART")).length >= MAX_LINES) throw new AppError(400, "Cart is full");
  const total = (existing?.quantity ?? 0) + quantity;
  checkStock(total, p.stock);
  await putEntry(userId, "CART", productId, { quantity: total, addedAt: existing?.addedAt ?? new Date().toISOString() });
  return getCart(userId);
}

export async function updateCartQuantity(userId: string, productId: string, input: unknown) {
  const { quantity } = qtySchema.parse(input);
  const existing = await getEntry<CartEntry>(userId, "CART", productId);
  if (!existing) throw new AppError(404, "Item not in cart");
  checkStock(quantity, (await loadProduct(productId)).stock);
  await putEntry(userId, "CART", productId, { quantity, addedAt: existing.addedAt });
  return getCart(userId);
}

export async function removeFromCart(userId: string, productId: string) {
  await deleteEntry(userId, "CART", productId);
  return getCart(userId);
}

export async function clearCart(userId: string) {
  const entries = await listEntries<CartEntry>(userId, "CART");
  await Promise.all(entries.map((e) => deleteEntry(userId, "CART", e.productId)));
}

export async function getWishlist(userId: string) {
  const entries = await listEntries<{ productId: string }>(userId, "WISH");
  const map = new Map((await getProductsByIds(entries.map((e) => e.productId))).map((p) => [p.id, p]));
  return { items: entries.map((e) => map.get(e.productId)).filter(Boolean) };
}

export async function addToWishlist(userId: string, input: unknown) {
  const { productId } = idSchema.parse(input);
  await loadProduct(productId);
  try {
    await putEntry(userId, "WISH", productId, { addedAt: new Date().toISOString() }, true);
  } catch (e) {
    if (!(e instanceof Error && e.name === "ConditionalCheckFailedException")) throw e; // already saved: fine
  }
  return getWishlist(userId);
}

export async function removeFromWishlist(userId: string, productId: string) {
  await deleteEntry(userId, "WISH", productId);
  return getWishlist(userId);
}