import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[70vh] w-full max-w-6xl px-4 py-6">
        <BackButton />
        {children}
      </main>
      <Footer />
    </>
  );
}