"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const locked = status === "pending_payment" || status === "cancelled";

  return (
    <select value={status} disabled={busy || locked} className="rounded border px-2 py-1 text-xs capitalize"
      onChange={async (e) => {
        setBusy(true);
        try { await api(`/api/orders/${id}`, "PATCH", { status: e.target.value }); router.refresh(); }
        catch (err) { alert(err instanceof Error ? err.message : "Failed"); }
        finally { setBusy(false); }
      }}>
      {status === "paid" && <option value="paid" disabled>paid</option>}
      {locked && <option value={status}>{status.replace("_", " ")}</option>}
      <option value="processing">processing</option>
      <option value="shipped">shipped</option>
      <option value="delivered">delivered</option>
    </select>
  );
}