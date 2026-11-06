"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import ImageUploader from "./ImageUploader";
import type { Category, Product } from "@/types";
import CategoryPicker from "./CategoryPicker";

export default function ProductForm({ categories, initial }: { categories: Category[]; initial?: Product }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (categories.length === 0) return <p className="text-gray-600">No categories exist yet. Ask the admin to create one first.</p>;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!f.get("categoryId")) { setError("Please select a category"); return; }
    setBusy(true);
    setError("");
    const body = {
      title: f.get("title"), description: f.get("description"),
      price: Number(f.get("price")), stock: Number(f.get("stock")),
      categoryId: f.get("categoryId"), images,
    };
    try {
      await api(initial ? `/api/products/${initial.id}` : "/api/products", initial ? "PUT" : "POST", body);
      router.push("/seller/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setBusy(false);
    }
  }

  const field = "w-full rounded border px-3 py-2";
  return (
    <form onSubmit={submit} className="max-w-xl space-y-4 rounded-xl border bg-white p-5">
      <input name="title" defaultValue={initial?.title} placeholder="Title" required minLength={3} className={field} />
      <textarea name="description" defaultValue={initial?.description} placeholder="Description (min 10 characters)" required minLength={10} rows={4} className={field} />
      <div className="grid grid-cols-2 gap-3">
        <input name="price" type="number" step="0.01" min="0.01" defaultValue={initial?.price} placeholder="Price" required className={field} />
        <input name="stock" type="number" min="0" step="1" defaultValue={initial?.stock ?? 0} placeholder="Stock" required className={field} />
      </div>
      <CategoryPicker categories={categories} defaultValue={initial?.categoryId ?? ""} />
      <ImageUploader value={images} onChange={setImages} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={busy} className="rounded bg-brand-600 hover:bg-brand-700 px-5 py-2 text-white disabled:opacity-50">
        {busy ? "Saving…" : initial ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}