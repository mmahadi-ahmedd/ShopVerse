import Link from "next/link";
import Image from "next/image";
import { Headphones, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";
import OfferModal from "@/components/OfferModal";
import ProductCard from "@/components/ProductCard";
import { listProducts } from "@/services/catalog.service";
import { getDealProducts, getFeaturedOffer, withDiscounts } from "@/services/discount.service";
import { listCategories } from "@/lib/db/categories";
import { queryProducts } from "@/lib/db/products";
import { getWishIds } from "@/lib/wishIds";

const perks = [
  { icon: Truck, title: "Free shipping", text: "On orders over $50" },
  { icon: ShieldCheck, title: "Secure payment", text: "Protected by Stripe" },
  { icon: RotateCcw, title: "Easy returns", text: "7-day return window" },
  { icon: Headphones, title: "24/7 support", text: "We're here to help" },
];

const reviews = [
  { name: "Ayesha R.", text: "Fast delivery and the product looked exactly like the photos. Will order again!" },
  { name: "Tanvir H.", text: "Great prices and a smooth checkout. Support replied within minutes." },
  { name: "Nusrat J.", text: "Loved the flash deals. I saved a lot on my headphones." },
];

function Heading({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <h2 className="text-2xl font-bold">{title}</h2>
      {href && <Link href={href} className="text-sm font-medium text-brand-600 hover:underline">View all →</Link>}
    </div>
  );
}

export default async function Home() {
  const [{ items }, categories, wished, offer, deals] = await Promise.all([
    listProducts(new URLSearchParams({ limit: "8" })), listCategories(), getWishIds(), getFeaturedOffer(), getDealProducts(4),
  ]);
  const [products, catCards] = await Promise.all([
    withDiscounts(items),
    Promise.all(categories.map(async (c) => ({
      ...c,
      image: (await queryProducts({ index: "GSI2", pk: `CAT#${c.id}`, limit: 1 })).items[0]?.images[0] ?? null,
    }))),
  ]);
  const showcase = products.filter((p) => p.discount?.image ?? p.images[0]).slice(0, 4);

  return (
    <div className="space-y-14">
      {offer && <OfferModal offer={offer} />}


      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white">
        <div className="grid items-center gap-8 px-6 py-12 md:grid-cols-2 md:px-12 md:py-16">
          <div className="space-y-5">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">New season · New deals</span>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Everything you need, delivered to your door.</h1>
            <p className="max-w-md text-brand-100">Discover quality products from independent sellers at prices you&apos;ll love.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="rounded-full bg-white px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50">Shop now</Link>
              <Link href="/about" className="rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white/10">Learn more</Link>
            </div>
          </div>
          {showcase.length > 0 && (
            <div className="hidden grid-cols-2 gap-3 md:grid">
              {showcase.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="relative aspect-square overflow-hidden rounded-2xl bg-white/10">
                  <Image src={(p.discount?.image ?? p.images[0])!} alt={p.title} fill sizes="25vw" className="object-cover transition hover:scale-105" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

   
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {perks.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3 rounded-2xl border bg-white p-4">
            <Icon className="h-7 w-7 shrink-0 text-brand-600" />
            <div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-gray-500">{text}</p></div>
          </div>
        ))}
      </section>


      {catCards.length > 0 && (
        <section>
          <Heading title="Shop by category" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {catCards.map((c) => (
              <Link key={c.id} href={`/products?category=${c.id}`} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-300">
                {c.image && <Image src={c.image} alt="" fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover transition group-hover:scale-105" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 font-semibold text-white">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {deals.length > 0 && (
        <section>
          <Heading title="🔥 Hot deals" href="/products" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {deals.map((p) => <ProductCard key={p.id} p={p} wished={wished.has(p.id)} />)}
          </div>
        </section>
      )}

     
      <section>
        <Heading title="New arrivals" href="/products" />
        {products.length === 0 ? (
          <p className="text-gray-500">No products yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} p={p} wished={wished.has(p.id)} />)}
          </div>
        )}
      </section>

   
      <section>
        <Heading title="What our customers say" />
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="space-y-3 rounded-2xl border bg-white p-5">
              <div className="flex gap-0.5 text-amber-400">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <blockquote className="text-sm text-gray-700">&ldquo;{r.text}&rdquo;</blockquote>
              <figcaption className="text-sm font-semibold">{r.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

     
      <section className="rounded-3xl bg-brand-900 px-6 py-12 text-center text-white">
        <h2 className="text-2xl font-bold sm:text-3xl">Get 10% off your first order</h2>
        <p className="mb-6 mt-2 text-brand-100">Subscribe for deals, new arrivals and exclusive offers.</p>
        <NewsletterForm />
      </section>
    </div>
  );
}