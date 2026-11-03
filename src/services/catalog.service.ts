import { nanoid } from "nanoid";
import { z } from "zod";
import { putCategory, listCategories, getCategory } from "@/lib/db/categories";
import { putProduct, getProduct, deleteProduct as delProduct, queryProducts } from "@/lib/db/products";
import { slugify } from "@/utils/slug";
import { AppError } from "@/utils/errors";
import type { Session } from "@/lib/auth";
import type { Product } from "@/types";


const categorySchema = z.object({ name: z.string().trim().min(2).max(40) });

export async function createCategory(input: unknown) {
  const { name } = categorySchema.parse(input);
  const slug = slugify(name);
  if ((await listCategories()).some((c) => c.slug === slug)) throw new AppError(409, "Category already exists");
  const cat = { id: nanoid(8), name, slug };
  await putCategory(cat);
  return cat;
}


const productSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  price: z.number().positive().max(10_000_000),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1),
  images: z.array(z.string().url().startsWith(process.env.CDN_URL!)).max(6).default([]),
});

async function ownedProduct(s: Session, id: string) {
  const p = await getProduct(id);
  if (!p) throw new AppError(404, "Product not found");
  if (s.role !== "admin" && p.sellerId !== s.sub) throw new AppError(403, "Not your product");
  return p;
}

export async function createProduct(s: Session, input: unknown) {
  const d = productSchema.parse(input);
  if (!(await getCategory(d.categoryId))) throw new AppError(400, "Invalid category");
  const id = nanoid(12);
  const p: Product = { ...d, id, sellerId: s.sub, slug: `${slugify(d.title)}-${id.slice(0, 4)}`, createdAt: new Date().toISOString() };
  await putProduct(p);
  return p;
}

export async function updateProduct(s: Session, id: string, input: unknown) {
  const old = await ownedProduct(s, id);
  const d = productSchema.partial().parse(input);
  if (d.categoryId && !(await getCategory(d.categoryId))) throw new AppError(400, "Invalid category");
  const p: Product = { ...old, ...d };
  await putProduct(p);
  return p;
}

export async function deleteProduct(s: Session, id: string) {
  await ownedProduct(s, id);
  await delProduct(id);
}

export async function getProductDetail(id: string) {
  const product = await getProduct(id);
  if (!product) throw new AppError(404, "Product not found");
  const rel = await queryProducts({ index: "GSI2", pk: `CAT#${product.categoryId}`, limit: 5 });
  return { product, related: rel.items.filter((p) => p.id !== id).slice(0, 4) };
}

export function listProducts(sp: URLSearchParams) {
  const num = (k: string) => (sp.get(k) && !isNaN(Number(sp.get(k))) ? Number(sp.get(k)) : undefined);
  const category = sp.get("category");
  return queryProducts({
    index: category ? "GSI2" : "GSI1",
    pk: category ? `CAT#${category}` : "PRODUCTS",
    q: sp.get("q") || undefined, min: num("min"), max: num("max"),
    limit: Math.min(num("limit") ?? 12, 48), cursor: sp.get("cursor") || undefined,
  });
}

export const listSellerProducts = (s: Session, sp: URLSearchParams) =>
  queryProducts({ index: "GSI3", pk: `SELLER#${s.sub}`, limit: Math.min(Number(sp.get("limit")) || 20, 48), cursor: sp.get("cursor") || undefined });