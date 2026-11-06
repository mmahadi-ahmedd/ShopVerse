import Link from "next/link";
import { Heart, Mail, MapPin, Phone, ShieldCheck, Users } from "lucide-react";

const stats = [["10k+", "Happy customers"], ["500+", "Independent sellers"], ["25k+", "Products"], ["4.8/5", "Average rating"]];
const values = [
  { icon: Users, title: "Built for sellers", text: "Anyone can open a shop, list products and run timed offers from their own dashboard." },
  { icon: ShieldCheck, title: "Safe and secure", text: "Every payment is processed by Stripe and your card details never touch our servers." },
  { icon: Heart, title: "Customer first", text: "Clear prices, honest stock levels and quick support when you need it." },
];
const faqs = [
  ["How long does delivery take?", "Most orders arrive within 3 to 5 working days, depending on your city."],
  ["Can I return a product?", "Yes. You can return unused items within 7 days of delivery for a refund."],
  ["Which payment methods do you accept?", "We accept all major debit and credit cards through Stripe."],
  ["How do I become a seller?", "Sign up with the “I want to sell” option, then add products and discounts from your seller dashboard."],
];

export default function AboutPage() {
  return (
    <div className="space-y-14">
      <section className="rounded-3xl bg-gradient-to-br from-brand-900 to-brand-600 px-6 py-14 text-center text-white">
        <h1 className="text-4xl font-extrabold">About ShopVerse</h1>
        <p className="mx-auto mt-3 max-w-2xl text-brand-100">We connect independent sellers with shoppers who care about quality, price and a smooth experience.</p>
      </section>

      <section className="grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Our story</h2>
          <p className="text-gray-600">ShopVerse started with a simple idea: buying and selling online should be easy for everyone. We built a marketplace where sellers manage their own catalogue and offers, while shoppers enjoy transparent prices, live deals and secure checkout.</p>
          <p className="text-gray-600">Today, thousands of people use ShopVerse to discover products they love and to grow their small businesses.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map(([n, l]) => (
            <div key={l} className="rounded-2xl border bg-white p-5 text-center">
              <p className="text-3xl font-extrabold text-brand-600">{n}</p>
              <p className="text-sm text-gray-500">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">What we stand for</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="space-y-2 rounded-2xl border bg-white p-6">
              <Icon className="h-7 w-7 text-brand-600" />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="scroll-mt-24">
        <h2 className="mb-4 text-2xl font-bold">Frequently asked questions</h2>
        <div className="space-y-2">
          {faqs.map(([q, a]) => (
            <details key={q} className="group rounded-xl border bg-white p-4">
              <summary className="cursor-pointer font-medium marker:content-none">{q}</summary>
              <p className="mt-2 text-sm text-gray-600">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 rounded-3xl border bg-white p-8">
        <h2 className="text-2xl font-bold">Contact us</h2>
        <div className="mt-4 grid gap-4 text-sm text-gray-700 sm:grid-cols-3">
          <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-600" /> support@shopverse.com</p>
          <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-600" /> +880 1234 567890</p>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-600" /> Dhaka, Bangladesh</p>
        </div>
        <Link href="/products" className="mt-6 inline-block rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">Start shopping</Link>
      </section>
    </div>
  );
}