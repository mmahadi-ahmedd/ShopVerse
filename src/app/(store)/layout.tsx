import Navbar from "@/components/Navbar";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-6">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-gray-500">© ShopVerse</footer>
    </>
  );
}