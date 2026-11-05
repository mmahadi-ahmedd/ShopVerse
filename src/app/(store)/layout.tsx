import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[70vh] w-full max-w-6xl px-4 py-6">
        <BackButton />
        {children}</main>
      <footer className="border-t py-6 text-center text-sm text-gray-500">© ShopVerse</footer>
    </>
  );
}