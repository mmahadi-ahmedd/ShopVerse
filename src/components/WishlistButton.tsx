"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function WishlistButton({ productId, initial }: { productId: string; initial: boolean }) {
  const router = useRouter();
  const [wished, setWished] = useState(initial);
  const [pending, start] = useTransition();

  async function toggle() {
    const next = !wished;
    setWished(next);
    try {
      await (next ? api("/api/wishlist", "POST", { productId }) : api(`/api/wishlist/${productId}`, "DELETE"));
      start(() => router.refresh());
    } catch {
      setWished(!next);
      router.push("/login");
    }
  }

  return (
    <button onClick={toggle} disabled={pending} aria-label="Toggle wishlist"
      className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow">
      {wished ? "❤️" : "🤍"}
    </button>
  );
}