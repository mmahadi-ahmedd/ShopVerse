import StatCard from "@/components/StatCard";
import { listUsers } from "@/lib/db/users";
import { countProducts } from "@/lib/db/products";
import { listCategories } from "@/lib/db/categories";

export default async function AdminHome() {
  const [users, products, categories] = await Promise.all([listUsers(), countProducts("GSI1", "PRODUCTS"), listCategories()]);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Users" value={users.filter((u) => u.role === "user").length} />
        <StatCard label="Sellers" value={users.filter((u) => u.role === "seller").length} />
        <StatCard label="Products" value={products} />
        <StatCard label="Categories" value={categories.length} />
      </div>
    </div>
  );
}