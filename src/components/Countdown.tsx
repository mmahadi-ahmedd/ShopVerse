"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown({ endsAt }: { endsAt: string }) {
  const router = useRouter();
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const ms = Date.parse(endsAt) - Date.now();
      setLeft(Math.max(0, ms));
      if (ms <= 0) { clearInterval(id); router.refresh(); }
    };
    const id = setInterval(tick, 1000);
    const first = setTimeout(tick, 0);
    return () => { clearInterval(id); clearTimeout(first); };
  }, [endsAt, router]);

  const s = left === null ? null : Math.floor(left / 1000);
  const parts = s === null
    ? [["--", "days"], ["--", "hrs"], ["--", "min"], ["--", "sec"]]
    : [[pad(Math.floor(s / 86400)), "days"], [pad(Math.floor((s % 86400) / 3600)), "hrs"], [pad(Math.floor((s % 3600) / 60)), "min"], [pad(s % 60), "sec"]];

  return (
    <div className="flex gap-2">
      {parts.map(([v, label]) => (
        <div key={label} className="min-w-14 rounded-lg bg-white px-2 py-1.5 text-center shadow-sm ring-1 ring-rose-100">
          <div className="text-xl font-bold tabular-nums text-rose-600">{v}</div>
          <div className="text-[10px] uppercase text-gray-500">{label}</div>
        </div>
      ))}
    </div>
  );
}