"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <button onClick={reset} className="rounded bg-brand-600 hover:bg-brand-700 px-4 py-2 text-white">Try again</button>
    </div>
  );
}