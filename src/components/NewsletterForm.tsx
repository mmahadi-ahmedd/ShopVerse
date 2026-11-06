"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function NewsletterForm() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true); setMsg(null);
    try {
      await api("/api/newsletter", "POST", { email: new FormData(form).get("email") });
      form.reset();
      setMsg({ ok: true, text: "You're subscribed. Thank you!" });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-md space-y-2">
      <div className="flex gap-2">
        <input name="email" type="email" required placeholder="Your email address"
          className="min-w-0 flex-1 rounded-full bg-white px-4 py-3 text-sm text-slate-900 outline-none" />
        <button disabled={busy} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-700 disabled:opacity-60">
          {busy ? "…" : "Subscribe"}
        </button>
      </div>
      {msg && <p className={`text-sm ${msg.ok ? "text-green-300" : "text-rose-300"}`}>{msg.text}</p>}
    </form>
  );
}