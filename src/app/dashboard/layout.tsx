import DashboardShell from "@/components/DashboardShell";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="My account" links={[
      { href: "/dashboard", label: "Overview" }, { href: "/cart", label: "Cart" },
      { href: "/wishlist", label: "Wishlist" }, { href: "/products", label: "Shop" },
      { href: "/dashboard/orders", label: "My orders" }
    ]}>{children}</DashboardShell>
  );
}