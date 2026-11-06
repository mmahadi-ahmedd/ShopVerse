"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { money } from "@/utils/format";

type Line = { productId: string; quantity: number; title: string; slug: string | null; price: number; image: string | null; stock: number; available: boolean };
type Cart = { items: Line[]; subtotal: number; count: number };

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<Cart | null>(null);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            const data = await api<Cart>("/api/cart");
            setCart(data);
            setError("");
        } catch (e) {
            const m = e instanceof Error ? e.message : "Failed to load cart";
            if (m === "Not authenticated") router.push("/login");
            else setError(m);
        }
    }, [router]);

    useEffect(() => {
        const timer = window.setTimeout(() => { void load(); }, 0);
        return () => window.clearTimeout(timer);
    }, [load]);

    async function act(id: string, fn: () => Promise<Cart>) {
        setBusy(id); setError("");
        try { setCart(await fn()); router.refresh(); }
        catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
        finally { setBusy(null); }
    }

    if (error && !cart) return (
        <div className="py-20 text-center">
            <p className="text-red-600">{error}</p>
            <button onClick={load} className="mt-3 rounded border px-4 py-2 text-sm">Retry</button>
        </div>
    );
    if (!cart) return <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />)}</div>;
    if (cart.items.length === 0) return (
        <div className="py-20 text-center">
            <p className="text-lg font-medium">Your cart is empty</p>
            <Link href="/products" className="mt-2 inline-block text-sm underline">Browse products</Link>
        </div>
    );

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
                <h1 className="text-2xl font-bold">Your cart ({cart.count})</h1>
                {error && <p className="text-sm text-red-600">{error}</p>}
                {cart.items.map((i) => (
                    <div key={i.productId} className="flex gap-4 rounded-xl border bg-white p-3">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {i.image && <Image src={i.image} alt="" fill sizes="80px" className="object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <Link href={`/products/${i.productId}`} className="line-clamp-1 font-medium">{i.title}</Link>
                            <p className="text-sm text-gray-600">{money(i.price)}</p>
                            {!i.available && <p className="text-xs text-red-600">Unavailable or low stock. Not counted in the total.</p>}
                            <div className="mt-2 flex items-center gap-2 text-sm">
                                <button disabled={busy === i.productId || i.quantity <= 1} className="h-7 w-7 rounded border disabled:opacity-40"
                                    onClick={() => act(i.productId, () => api<Cart>(`/api/cart/${i.productId}`, "PATCH", { quantity: i.quantity - 1 }))}>−</button>
                                <span className="w-6 text-center">{i.quantity}</span>
                                <button disabled={busy === i.productId || i.quantity >= 10} className="h-7 w-7 rounded border disabled:opacity-40"
                                    onClick={() => act(i.productId, () => api<Cart>(`/api/cart/${i.productId}`, "PATCH", { quantity: i.quantity + 1 }))}>+</button>
                                <button className="ml-3 text-red-600 underline" disabled={busy === i.productId}
                                    onClick={() => act(i.productId, () => api<Cart>(`/api/cart/${i.productId}`, "DELETE"))}>Remove</button>
                            </div>
                        </div>
                        <p className="font-medium">{money(i.price * i.quantity)}</p>
                    </div>
                ))}
            </div>

            <aside className="h-fit space-y-3 rounded-xl border bg-white p-5">
                <h2 className="font-semibold">Order summary</h2>
                <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">{money(cart.subtotal)}</span></div>
                <Link href="/checkout" className="block w-full rounded bg-black py-2 text-center text-white">Checkout</Link>
            </aside>
        </div>
    );
}