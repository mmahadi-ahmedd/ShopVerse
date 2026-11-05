import DashboardShell from "@/components/DashboardShell";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Seller" links={[
      { href: "/seller", label: "Overview" }, { href: "/seller/products", label: "My products" },
      { href: "/seller/products/new", label: "Add product" },
      { href: "/seller/discounts", label: "Discounts" },
    ]}>{children}</DashboardShell>
  );
}