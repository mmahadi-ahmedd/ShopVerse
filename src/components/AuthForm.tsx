"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const HOME: Record<string, string> = { admin: "/admin", seller: "/seller", user: "/dashboard" };

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const reg = mode === "register";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const { user } = await api<{ user: { role: string } }>(`/api/auth/${mode}`, "POST", body);
      router.push(HOME[user.role]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setBusy(false);
    }
  }

  const field = "w-full rounded border px-3 py-2";
  return (
    <form onSubmit={submit} className="mx-auto mt-10 max-w-sm space-y-4 rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold">{reg ? "Create account" : "Welcome back"}</h1>
      {reg && <input name="name" placeholder="Full name" required minLength={2} className={field} />}
      <input name="email" type="email" placeholder="Email" required className={field} />
      <input name="password" type="password" placeholder="Password (min 8)" required minLength={8} className={field} />
      {reg && (
        <select name="role" defaultValue="user" className={field}>
          <option value="user">I want to buy</option>
          <option value="seller">I want to sell</option>
        </select>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={busy} className="w-full rounded bg-black py-2 text-white disabled:opacity-50">
        {busy ? "Please wait…" : reg ? "Sign up" : "Log in"}
      </button>
      <p className="text-center text-sm text-gray-600">
        {reg ? "Have an account? " : "New here? "}
        <Link href={reg ? "/login" : "/register"} className="underline">{reg ? "Log in" : "Sign up"}</Link>
      </p>
    </form>
  );
}