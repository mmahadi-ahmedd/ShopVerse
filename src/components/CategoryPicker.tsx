"use client";
import { useEffect, useRef, useState } from "react";
import type { Category } from "@/types";

export default function CategoryPicker({ categories, name = "categoryId", defaultValue = "", allLabel, placeholder = "Select category" }: {
  categories: Category[]; name?: string; defaultValue?: string; allLabel?: string; placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const options = allLabel ? [{ id: "", name: allLabel }, ...categories] : categories;
  const current = options.find((o) => o.id === value);

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={value} />
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="flex w-full min-w-44 items-center justify-between gap-2 rounded border bg-white px-3 py-2 text-left text-sm">
        <span className={current ? "" : "text-gray-500"}>{current?.name ?? placeholder}</span>
        <span>▾</span>
      </button>
      {open && (
        <ul className="absolute z-20 mt-1 grid max-h-72 w-72 max-w-[90vw] grid-cols-2 gap-1 overflow-auto rounded-xl border bg-white p-2 shadow-lg">
          {options.map((o) => (
            <li key={o.id || "all"}>
              <button type="button" onClick={() => { setValue(o.id); setOpen(false); }}
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${o.id === value ? "bg-gray-100 font-medium" : ""}`}>
                {o.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}