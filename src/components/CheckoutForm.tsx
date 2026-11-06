"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function CheckoutForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const { url } = await api<{ url: string }>("/api/checkout", "POST", Object.fromEntries(new FormData(e.currentTarget)));
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setBusy(false);
    }
  }

  const field = "w-full rounded border px-3 py-2";
  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border bg-white p-5">
      <h2 className="font-semibold">Shipping details</h2>
      <input name="name" placeholder="Full name" required minLength={2} className={field} />
      <input name="phone" placeholder="Phone number" required className={field} />
      <input name="address" placeholder="Address" required minLength={5} className={field} />
      <input name="city" placeholder="City" required minLength={2} className={field} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={busy} className="w-full rounded bg-brand-600 hover:bg-brand-700 py-2.5 text-white disabled:opacity-50">
        {busy ? "Redirecting to payment…" : "Pay with card"}
      </button>
      <p className="text-center text-xs text-gray-500">Secure payment by Stripe (test mode)</p>
    </form>
  );
}