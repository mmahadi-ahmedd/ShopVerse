import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { requireRole } from "@/lib/auth";
import { getProduct } from "@/lib/db/products";
import { listCategories } from "@/lib/db/categories";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const s = await requireRole("seller");
  const p = await getProduct((await params).id);
  if (!p || p.sellerId !== s.sub) notFound();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit product</h1>
      <ProductForm categories={await listCategories()} initial={p} />
    </div>
  );
}