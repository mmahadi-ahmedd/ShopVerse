"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Countdown from "./Countdown";
import { money } from "@/utils/format";
import type { Offer } from "@/services/discount.service";

export default function OfferModal({ offer }: { offer: Offer }) {
  const [open, setOpen] = useState(false);
  const key = `offer-seen-${offer.id}`;

  useEffect(() => {
    const t = setTimeout(() => {
      try { if (!sessionStorage.getItem(key)) setOpen(true); } catch { setOpen(true); }
    }, 600);
    return () => clearTimeout(t);
  }, [key]);

  const close = useCallback(() => {
    setOpen(false);
    try { sessionStorage.setItem(key, "1"); } catch { /* storage unavailable */ }
  }, [key]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={close} role="dialog" aria-modal="true">
      <div onClick={(e) => e.stopPropagation()}
        className="relative grid max-h-[92vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white shadow-2xl md:grid-cols-2">
        <button onClick={close} aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl shadow hover:bg-white">×</button>

        <div className="relative aspect-square md:aspect-auto md:min-h-[26rem]">
          <Image src={offer.image} alt={offer.productTitle} fill priority sizes="(min-width:768px) 380px, 100vw" className="object-cover" />
          <span className="absolute left-4 top-4 rounded-lg bg-rose-600 px-3 py-1.5 text-lg font-extrabold text-white">-{offer.percent}%</span>
        </div>

        <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">Limited time offer</p>
          <h2 className="text-3xl font-extrabold leading-tight">{offer.title || `${offer.percent}% OFF`}</h2>
          <p className="text-gray-600">{offer.productTitle}</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-rose-600">{money(offer.finalPrice)}</span>
            <span className="text-gray-400 line-through">{money(offer.price)}</span>
          </div>
          <div>
            <p className="mb-1 text-xs uppercase text-gray-500">Ends in</p>
            <Countdown endsAt={offer.endsAt} />
          </div>
          <div className="flex gap-3">
            <Link href={`/products/${offer.productId}`} onClick={close}
              className="flex-1 rounded-lg bg-rose-600 px-5 py-3 text-center font-semibold text-white hover:bg-rose-700">Grab the deal</Link>
            <button onClick={close} className="rounded-lg border px-4 py-3 text-sm">Maybe later</button>
          </div>
        </div>
      </div>
    </div>
  );
}