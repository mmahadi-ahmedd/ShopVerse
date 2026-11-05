"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import ImageUploader from "./ImageUploader";

export default function DiscountForm({ products }: { products: { id: string; title: string }[] }) {
  const router = useRouter();
  const [image, setImage] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (products.length === 0) return <p className="text-gray-600">Add a product first, then you can create a discount for it.</p>;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!image[0]) { setError("Please upload a temporary image"); return; }
    const f = new FormData(form);
    setBusy(true); setError("");
    try {
      await api("/api/discounts", "POST", {
        productId: f.get("productId"),
        percent: Number(f.get("percent")),
        title: (f.get("title") as string) || undefined,
        image: image[0],
        startsAt: new Date(f.get("startsAt") as string).toISOString(),
        endsAt: new Date(f.get("endsAt") as string).toISOString(),
      });
      form.reset(); setImage([]); router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  const field = "w-full rounded border px-3 py-2 text-sm";
  const label = "mb-1 block text-xs font-medium text-gray-600";
  return (
    <form onSubmit={submit} className="max-w-xl space-y-4 rounded-xl border bg-white p-5">
      <div>
        <label className={label}>Product</label>
        <select name="productId" required defaultValue="" className={field}>
          <option value="" disabled>Select a product</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={label}>Discount %</label><input name="percent" type="number" min={1} max={90} step={1} required className={field} /></div>
        <div><label className={label}>Headline (optional)</label><input name="title" maxLength={60} placeholder="Flash Sale" className={field} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={label}>Starts</label><input name="startsAt" type="datetime-local" required className={field} /></div>
        <div><label className={label}>Ends</label><input name="endsAt" type="datetime-local" required className={field} /></div>
      </div>
      <div>
        <label className={label}>Temporary image (shown while the discount is active)</label>
        <ImageUploader value={image} onChange={setImage} max={1} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={busy} className="rounded bg-black px-5 py-2 text-sm text-white disabled:opacity-50">
        {busy ? "Saving…" : "Create discount"}
      </button>
    </form>
  );
}