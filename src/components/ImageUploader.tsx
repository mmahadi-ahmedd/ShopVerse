"use client";
import { useRef, useState } from "react";
import { uploadImage } from "@/lib/uploadImage";

export default function ImageUploader({ value, onChange, max = 6 }: {
  value: string[]; onChange: (urls: string[]) => void; max?: number;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(""); setBusy(true);
    try {
      const room = max - value.length;
      const urls = await Promise.all(Array.from(files).slice(0, room).map(uploadImage));
      onChange([...value, ...urls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((url) => (
          <div key={url} className="relative h-24 w-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full rounded-lg object-cover" />
            <button type="button" onClick={() => onChange(value.filter((u) => u !== url))}
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-600 text-xs text-white">×</button>
          </div>
        ))}
        {value.length < max && (
          <button type="button" disabled={busy} onClick={() => input.current?.click()}
            className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed text-sm text-gray-500 disabled:opacity-50">
            {busy ? "Uploading…" : "+ Add"}
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden
        onChange={(e) => handleFiles(e.target.files)} />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}