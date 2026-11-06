import Link from "next/link";
import LogoutButton from "./LogoutButton";
import BackButton from "./BackButton";

export default function DashboardShell({ title, links, children }: {
  title: string; links: { href: string; label: string }[]; children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <aside className="border-b bg-white md:min-h-screen md:w-56 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between p-4 md:block">
          <div>
            <Link href="/" className="font-extrabold text-brand-600">ShopVerse</Link>
            <p className="text-xs uppercase text-gray-500">{title}</p>
          </div>
          <div className="text-sm md:mt-4"><LogoutButton /></div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:pb-0">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap rounded px-3 py-2 text-sm hover:bg-gray-100">{l.label}</Link>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">
        <BackButton />
        {children}</main>
    </div>
  );
}