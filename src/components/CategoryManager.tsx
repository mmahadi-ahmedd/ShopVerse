"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import DeleteButton from "./DeleteButton";
import type { Category } from "@/types";

export default function CategoryManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try { await api("/api/categories", "POST", { name }); setName(""); router.refresh(); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed"); }
  }

  return (
    <div className="max-w-xl space-y-4">
      <form onSubmit={add} className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" required minLength={2}
          className="flex-1 rounded border px-3 py-2" />
        <button className="rounded bg-black px-4 py-2 text-white">Add</button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {initial.length === 0 ? <p className="text-gray-500">No categories yet.</p> : (
        <ul className="divide-y rounded-xl border bg-white">
          {initial.map((c) => (
            <li key={c.id} className="flex items-center justify-between px-4 py-3">
              <span>{c.name}</span>
              <DeleteButton url={`/api/categories/${c.id}`} confirmText={`Delete "${c.name}"?`} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}