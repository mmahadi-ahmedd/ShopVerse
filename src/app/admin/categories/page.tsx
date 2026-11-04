import CategoryManager from "@/components/CategoryManager";
import { listCategories } from "@/lib/db/categories";

export default async function AdminCategories() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Categories</h1>
      <CategoryManager initial={await listCategories()} />
    </div>
  );
}