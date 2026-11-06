import { listUsers } from "@/lib/db/users";
import { countProducts } from "@/lib/db/products";
import { listCategories } from "@/lib/db/categories";
import { listAllOrders } from "@/lib/db/orders";
import { listProducts } from "./catalog.service";

export async function adminStats() {
  const [users, productCount, categories, orders, products] = await Promise.all([
    listUsers(), countProducts("GSI1", "PRODUCTS"), listCategories(), listAllOrders(),
    listProducts(new URLSearchParams({ limit: "48" })),
  ]);
  const sold = orders.filter((o) => o.status !== "pending_payment" && o.status !== "cancelled");
  const revenue = sold.reduce((n, o) => n + o.subtotal, 0);
  const days = Array.from({ length: 7 }, (_, i) => new Date(Date.now() - (6 - i) * 86_400_000).toISOString().slice(0, 10));
  const byDay = days.map((day) => ({
    day,
    total: Math.round(sold.filter((o) => (o.paidAt ?? o.createdAt).slice(0, 10) === day).reduce((n, o) => n + o.subtotal, 0) * 100) / 100,
  }));
  return {
    buyers: users.filter((u) => u.role === "user").length,
    sellers: users.filter((u) => u.role === "seller").length,
    productCount, categoryCount: categories.length, orderCount: sold.length, revenue, byDay,
    recent: sold.slice(0, 5), lowStock: products.items.filter((p) => p.stock <= 5).slice(0, 6),
  };
}