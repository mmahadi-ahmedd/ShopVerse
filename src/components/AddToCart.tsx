"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AddToCart({ productId, stock }: { productId: string; stock: number }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  if (stock === 0) return <p className="font-medium text-red-600">Out of stock</p>;

  async function add() {
    setBusy(true);
    setMsg(null);
    try {
      await api("/api/cart", "POST", { productId, quantity: qty });
      setMsg({ ok: true, text: "Added to cart" });
      router.refresh();
    } catch (e) {
      const m = e instanceof Error ? e.message : "Failed";
      if (m === "Not authenticated") router.push("/login");
      else setMsg({ ok: false, text: m });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <input type="number" min={1} max={Math.min(10, stock)} value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className="w-20 rounded border px-3 py-2" />
        <button onClick={add} disabled={busy}
          className="rounded bg-brand-600 hover:bg-brand-700 px-6 py-2 text-white disabled:opacity-50">
          {busy ? "Adding…" : "Add to cart"}
        </button>
      </div>
      {msg && <p className={`text-sm ${msg.ok ? "text-green-600" : "text-red-600"}`}>{msg.text}</p>}
    </div>
  );
}