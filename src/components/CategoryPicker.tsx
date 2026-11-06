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
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, []);

  const options = allLabel ? [{ id: "", name: allLabel }, ...categories] : categories;
  const current = options.find((o) => o.id === value);

  return (
    <div ref={ref} className="relative w-full sm:w-auto">
      <input type="hidden" name={name} value={value} />
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded border bg-white px-3 py-2 text-left text-sm sm:min-w-44">
        <span className={`truncate ${current ? "" : "text-gray-500"}`}>{current?.name ?? placeholder}</span>
        <span>▾</span>
      </button>

      {open && (
        <>
          {/* mobile backdrop */}
          <div className="fixed inset-0 z-40 bg-black/30 sm:hidden" onClick={() => setOpen(false)} />
          <ul className="fixed inset-x-3 bottom-3 z-50 grid max-h-[60vh] grid-cols-2 gap-1 overflow-auto overscroll-contain rounded-2xl border bg-white p-2 shadow-xl
                         sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-full sm:mt-1 sm:max-h-72 sm:w-96 sm:grid-cols-3 sm:rounded-xl sm:shadow-lg">
            {options.map((o) => (
              <li key={o.id || "all"}>
                <button type="button" onClick={() => { setValue(o.id); setOpen(false); }}
                  className={`w-full truncate rounded px-3 py-2.5 text-left text-sm hover:bg-gray-100 ${o.id === value ? "bg-gray-100 font-medium" : ""}`}>
                  {o.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}