import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <form action="/products" className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input name="q" placeholder="Search products…"
        className="w-full rounded-full border bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-brand-500 focus:bg-white" />
    </form>
  );
}