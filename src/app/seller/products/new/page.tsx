import ProductForm from "@/components/ProductForm";
import { listCategories } from "@/lib/db/categories";
export const dynamic = "force-dynamic";

export default async function NewProduct() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Add product</h1>
      <ProductForm categories={await listCategories()} />
    </div>
  );
}