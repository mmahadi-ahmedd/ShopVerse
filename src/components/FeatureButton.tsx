"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function FeatureButton({ discountId, featured, disabled }: { discountId: string; featured: boolean; disabled?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    try {
      await (featured ? api("/api/admin/featured", "DELETE") : api("/api/admin/featured", "POST", { discountId }));
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button onClick={toggle} disabled={busy || (disabled && !featured)}
      className={`rounded px-3 py-1 text-xs font-medium disabled:opacity-40 ${featured ? "bg-gray-900 text-white" : "border"}`}>
      {busy ? "…" : featured ? "Remove from homepage" : "Show on homepage"}
    </button>
  );
}