import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-gray-600">We couldn&apos;t find that page.</p>
      <Link href="/" className="rounded bg-black px-4 py-2 text-white">Back home</Link>
    </div>
  );
}