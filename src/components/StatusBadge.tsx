const colors: Record<string, string> = {
  pending_payment: "bg-amber-100 text-amber-700", paid: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700", shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700", cancelled: "bg-gray-100 text-gray-500",
};

export default function StatusBadge({ status }: { status: string }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colors[status] ?? ""}`}>{status.replace("_", " ")}</span>;
}