import DashboardShell from "@/components/DashboardShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Admin" links={[
      { href: "/admin", label: "Overview" }, { href: "/admin/categories", label: "Categories" },
      { href: "/admin/products", label: "Products" }, { href: "/admin/users", label: "Users" },
    ]}>{children}</DashboardShell>
  );
}