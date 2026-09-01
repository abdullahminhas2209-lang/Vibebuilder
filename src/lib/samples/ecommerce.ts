import type { ProjectFile } from "@/lib/types";
import { makeFooter, makeGlobals, makeLayout } from "@/lib/samples/shared";

/**
 * Sample source for the "E-commerce Store" project (Northbound Goods).
 * Phase 1 only: display data for the code panel, not a real file system.
 */
export const ecommerceFiles: ProjectFile[] = [
  {
    path: "app/page.tsx",
    name: "page.tsx",
    language: "tsx",
    code: `import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { CartSummary } from "@/components/CartSummary";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <ProductGrid />
        <CartSummary />
      </main>
      <Footer />
    </div>
  );
}
`,
  },
  makeLayout(
    "Northbound Goods",
    "Northbound Goods — Outdoor supply",
    "Durable gear for cold-weather adventures.",
  ),
  makeGlobals("oklch(0.62 0.15 60)", "oklch(0.99 0.004 80)", "oklch(0.22 0.02 70)"),
  {
    path: "components/Navbar.tsx",
    name: "Navbar.tsx",
    language: "tsx",
    code: `const links = ["Shop", "Gear guides", "Journal", "Support"];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="text-lg font-semibold tracking-tight">
          Northbound Goods
        </a>
        <ul className="hidden gap-8 text-sm text-stone-600 md:flex">
          {links.map((label) => (
            <li key={label}>
              <a href="#" className="transition hover:text-stone-900">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#cart"
          className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white"
        >
          Cart (2)
        </a>
      </nav>
    </header>
  );
}
`,
  },
  {
    path: "components/Hero.tsx",
    name: "Hero.tsx",
    language: "tsx",
    code: `export function Hero() {
  return (
    <section className="bg-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-24 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-300">
          Winter 2026 collection
        </p>
        <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-tight">
          Gear that outlasts the season.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-slate-300">
          Packable insulation, stormproof shells, and boots rebuilt for
          colder mornings on the trail.
        </p>
        <a
          href="#shop"
          className="mt-10 inline-block rounded-full bg-amber-500 px-6 py-3 font-medium text-stone-950"
        >
          Shop the collection
        </a>
      </div>
    </section>
  );
}
`,
  },
  {
    path: "components/ProductGrid.tsx",
    name: "ProductGrid.tsx",
    language: "tsx",
    code: `const products = [
  { name: "Ridgeline down parka", price: "$320", tone: "bg-amber-100" },
  { name: "Trailhead wool sock 3-pack", price: "$38", tone: "bg-stone-200" },
  { name: "Basecamp duffel 60L", price: "$145", tone: "bg-orange-100" },
  { name: "Glacier shell jacket", price: "$265", tone: "bg-slate-200" },
];

export function ProductGrid() {
  return (
    <section id="shop" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-semibold">Best sellers</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <article key={product.name} className="group">
            <div className={"h-44 rounded-2xl " + product.tone} />
            <h3 className="mt-3 font-medium group-hover:underline">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-stone-500">{product.price}</p>
            <button className="mt-3 w-full rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white">
              Add to cart
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
`,
  },
  {
    path: "components/CartSummary.tsx",
    name: "CartSummary.tsx",
    language: "tsx",
    code: `const items = [
  { name: "Ridgeline down parka", qty: 1, price: "$320" },
  { name: "Trailhead wool sock 3-pack", qty: 1, price: "$38" },
];

export function CartSummary() {
  return (
    <section id="cart" className="border-t border-stone-200 bg-stone-50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold">Your cart</h2>
        <div className="mt-6 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
          {items.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-4">
              <p className="font-medium">{item.name}</p>
              <span className="text-stone-500">{item.price}</span>
            </div>
          ))}
          <div className="flex items-center justify-between p-4 text-sm">
            <span className="text-stone-500">Subtotal</span>
            <span className="font-semibold">$358.00</span>
          </div>
        </div>
        <button className="mt-6 rounded-full bg-amber-500 px-8 py-3 font-medium text-stone-950">
          Checkout
        </button>
      </div>
    </section>
  );
}
`,
  },
  makeFooter("Northbound Goods", ["Shipping", "Returns", "Contact"], "Northbound Goods"),
];
