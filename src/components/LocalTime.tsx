"use client";
import { useEffect, useState } from "react";

export default function LocalTime({ iso }: { iso: string }) {
  const [text, setText] = useState("…");
  useEffect(() => {
    const t = setTimeout(
      () => setText(new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })), 0);
    return () => clearTimeout(t);
  }, [iso]);
  return <span>{text}</span>;
}