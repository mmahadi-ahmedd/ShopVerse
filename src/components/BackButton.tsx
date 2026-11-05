"use client";
import { usePathname, useRouter } from "next/navigation";

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/") return null;

  return (
    <button
      onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
      className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black"
    >
      ← Back
    </button>
  );
}