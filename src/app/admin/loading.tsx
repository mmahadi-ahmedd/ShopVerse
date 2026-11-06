export default function Loading() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />)}
    </div>
  );
}