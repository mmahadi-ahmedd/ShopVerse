import StatCard from "@/components/StatCard";
import { requireRole } from "@/lib/auth";
import { listSellerProducts } from "@/services/catalog.service";

export default async function SellerHome() {
  const s = await requireRole("seller");
  const { items } = await listSellerProducts(s, new URLSearchParams({ limit: "48" }));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="My products" value={items.length} />
        <StatCard label="Units in stock" value={items.reduce((n, p) => n + p.stock, 0)} />
        <StatCard label="Low stock (≤5)" value={items.filter((p) => p.stock <= 5).length} />
      </div>
    </div>
  );
}