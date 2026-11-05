import { nanoid } from "nanoid";
import { z } from "zod";
import {
  putDiscount, getDiscount, deleteDiscount,
  listAllDiscounts, listSellerDiscounts, listProductDiscounts,
} from "@/lib/db/discounts";
import { getProduct, getProductsByIds } from "@/lib/db/products";
import { AppError } from "@/utils/errors";
import type { Session } from "@/lib/auth";
import type { Discount, Product, ProductView } from "@/types";

export const finalPrice = (price: number, percent: number) => Math.round(price * (100 - percent)) / 100;

export type DiscountStatus = "upcoming" | "active" | "ended";
export const statusOf = (d: Discount, now = Date.now()): DiscountStatus =>
  now < Date.parse(d.startsAt) ? "upcoming" : now >= Date.parse(d.endsAt) ? "ended" : "active";


export async function activeDiscountMap() {
  const now = Date.now();
  const map = new Map<string, Discount>();
  for (const d of await listAllDiscounts()) {
    if (statusOf(d, now) !== "active") continue;
    const cur = map.get(d.productId);
    if (!cur || d.percent > cur.percent) map.set(d.productId, d);
  }
  return map;
}

export async function withDiscounts(products: Product[]): Promise<ProductView[]> {
  const map = await activeDiscountMap();
  return products.map((p) => {
    const d = map.get(p.id);
    return d
      ? { ...p, finalPrice: finalPrice(p.price, d.percent),
          discount: { id: d.id, percent: d.percent, startsAt: d.startsAt, endsAt: d.endsAt, image: d.image, title: d.title } }
      : { ...p, finalPrice: p.price };
  });
}


const schema = z.object({
  productId: z.string().min(1),
  percent: z.number().int().min(1).max(90),
  title: z.string().trim().max(60).optional(),
  image: z.string().url().startsWith(process.env.CDN_URL!),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
}).refine((d) => Date.parse(d.endsAt) > Date.parse(d.startsAt), { message: "End must be after start", path: ["endsAt"] })
  .refine((d) => Date.parse(d.endsAt) > Date.now(), { message: "End time must be in the future", path: ["endsAt"] });

export async function createDiscount(s: Session, input: unknown) {
  const d = schema.parse(input);
  const product = await getProduct(d.productId);
  if (!product) throw new AppError(404, "Product not found");
  if (s.role !== "admin" && product.sellerId !== s.sub) throw new AppError(403, "Not your product");

  const clash = (await listProductDiscounts(d.productId)).some(
    (e) => Date.parse(d.startsAt) < Date.parse(e.endsAt) && Date.parse(d.endsAt) > Date.parse(e.startsAt)
  );
  if (clash) throw new AppError(409, "This product already has a discount in that time range");

  const discount: Discount = { ...d, id: nanoid(10), sellerId: product.sellerId, createdAt: new Date().toISOString() };
  await putDiscount(discount);
  return discount;
}

export async function removeDiscount(s: Session, id: string) {
  const d = await getDiscount(id);
  if (!d) throw new AppError(404, "Discount not found");
  if (s.role !== "admin" && d.sellerId !== s.sub) throw new AppError(403, "Not your discount");
  await deleteDiscount(id);
}

export async function listDiscountsFor(s: Session) {
  const items = s.role === "admin" ? await listAllDiscounts() : await listSellerDiscounts(s.sub);
  const products = new Map((await getProductsByIds(items.map((d) => d.productId))).map((p) => [p.id, p]));
  const now = Date.now();
  return items
    .map((d) => ({ ...d, status: statusOf(d, now), productTitle: products.get(d.productId)?.title ?? "Deleted product" }))
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
}