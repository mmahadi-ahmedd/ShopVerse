"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function DeleteButton({ url, confirmText = "Delete this item?" }: { url: string; confirmText?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button disabled={busy} className="text-sm text-red-600 underline disabled:opacity-50"
      onClick={async () => {
        if (!confirm(confirmText)) return;
        setBusy(true);
        try { await api(url, "DELETE"); router.refresh(); }
        catch (e) { alert(e instanceof Error ? e.message : "Failed"); }
        finally { setBusy(false); }
      }}>
      Delete
    </button>
  );
}