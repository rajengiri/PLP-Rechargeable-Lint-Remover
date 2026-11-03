import Image from "next/image";
import { OrderLink } from "@/components/OrderLink";
import { ProductShowcase } from "@/components/ProductShowcase";
import { ReelSection } from "@/components/ReelSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PRODUCT, formatNpr } from "@/lib/product";

const faqs = [
  {
    question: "What fabrics can I use the lint remover on?",
    answer:
      "It is suitable for many everyday fabrics such as sweaters, jackets, blankets and upholstery. Always test a small hidden area first, keep the fabric flat and avoid delicate embroidery, loose threads or very thin fabric.",
  },
  {
    question: "Is it rechargeable?",
    answer:
      "Yes. The lint remover is designed for cordless use after charging, so you can use it without keeping a cable attached.",
  },
  {
    question: "How do I use it safely?",
    answer:
      "Lay the fabric on a firm, flat surface and move the remover gently without pressing hard. Do not use it while wearing the garment, and keep it away from wet fabric.",
  },
  {
    question: "How much is delivery?",
    answer:
      "Delivery is Rs. 100 inside Kathmandu Valley and Rs. 150 outside Kathmandu Valley. Your exact total is shown before you submit the order.",
  },
  {
    question: "How does Cash On Delivery work?",
    answer:
      "Place your order without paying online. Our representative will call to confirm your details, and you pay when the parcel is delivered.",
  },
  {
    question: "How long will delivery take?",
    answer:
      "Delivery timing depends on your location and will be confirmed by our representative during the confirmation call.",
  },
  {
    question: "What happens after I place an order?",
    answer:
      "You will receive an order confirmation email, and our sales representative will call you soon to confirm the address and delivery details.",
  },
];

const testimonials = [
  {
    name: "Anisha Karki",
    location: "Lalitpur",
    initials: "AK",
    quote: "My wool sweater looked much cleaner after just a few passes.",
    cardClass: "bg-[#fffdf9] md:col-span-2 lg:-rotate-1",
  },
  {
    name: "Sushmita Shrestha",
    location: "Bhaktapur",
    initials: "SS",
    quote: "Light in the hand and simple to clean after use.",
    cardClass: "bg-[#f7eee5] md:col-span-2 lg:translate-y-4",
  },
  {
    name: "Prakriti Gurung",
    location: "Pokhara",
    initials: "PG",
    quote: "I use it on jackets and the sofa cover. Very handy.",
    cardClass: "bg-[#fffdf9] md:col-span-2 lg:rotate-1",
  },
  {
    name: "Rojina Rai",
    location: "Dharan",
    initials: "RR",
    quote: "Charging is easy, and there is no wire in the way while using it.",
    cardClass: "bg-[#e7ede4] md:col-span-3 lg:ml-16",
  },
  {
    name: "Nirmala Thapa",
    location: "Butwal",
    initials: "NT",
    quote: "Compact enough for my wardrobe shelf. It does the job nicely.",
    cardClass: "bg-[#fffdf9] md:col-span-3 lg:mr-16 lg:translate-y-3",
  },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <SiteHeader />

      <section className="grain relative px-5 pb-20 pt-12 sm:pb-28 sm:pt-20 lg:px-8">
        <div className="absolute -right-36 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-ember/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-clay/15 bg-white/70 px-4 py-2 text-xs font-extrabold uppercase tracking-[.12em] text-clay">
              <span className="h-2 w-2 rounded-full bg-ember" />
              Everyday fabric care, simplified
            </div>
            <h1 className="mt-7 text-5xl font-black leading-[.98] tracking-[-.045em] text-ink sm:text-6xl lg:text-7xl">
              Bring your favourite fabrics <span className="text-ember">back to life.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-cocoa/70 sm:text-xl">
              Clear away visible fuzz and bobbles from sweaters, jackets and blankets with a compact rechargeable lint remover.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <OrderLink className="sm:min-w-48">Purchase now</OrderLink>
              <a href="#details" className="button-secondary sm:min-w-44">Explore product</a>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-bold text-cocoa/65">
              <span className="flex items-center gap-2"><b className="text-sage">✓</b> Cash On Delivery</span>
              <span className="flex items-center gap-2"><b className="text-sage">✓</b> No prepayment</span>
              <span className="flex items-center gap-2"><b className="text-sage">✓</b> Order confirmed by phone</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl">
            <div className="absolute -left-5 bottom-12 z-10 rounded-2xl bg-white p-4 shadow-lift sm:-left-10 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-cocoa/45">Today&apos;s price</p>
              <p className="mt-1 text-2xl font-black text-clay">{formatNpr(PRODUCT.unitPrice)}</p>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-sand shadow-soft">
              <Image
                src="/images/lint-remover-lifestyle.png"
                alt="Rechargeable lint remover resting on folded fabric"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -right-3 top-6 rounded-2xl bg-ink px-4 py-3 text-white shadow-lift sm:-right-7">
              <p className="text-xs font-bold text-white/55">You save</p>
              <p className="text-lg font-black">Rs. 301</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-cocoa/10 bg-white px-5 py-7 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 text-center sm:grid-cols-4">
          {[
            ["01", "Choose quantity"],
            ["02", "Share delivery details"],
            ["03", "Confirm by phone"],
            ["04", "Pay on delivery"],
          ].map(([number, label]) => (
            <div key={number} className="flex items-center justify-center gap-3">
              <span className="text-xs font-black text-ember">{number}</span>
              <span className="text-sm font-bold text-cocoa/70">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <ProductShowcase />
      <ReelSection />

      <section id="benefits" className="px-5 py-20 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Why you&apos;ll reach for it</span>
            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">More wear. Less fuzz. No fuss.</h2>
            <p className="mt-5 text-lg leading-8 text-cocoa/65">
              A small fabric-care habit can help everyday pieces look tidier and stay in rotation longer.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCT.benefits.map((benefit, index) => (
              <article key={benefit.title} className="group rounded-3xl border border-cocoa/10 bg-white p-7 shadow-soft transition hover:-translate-y-1">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-ember/10 text-xl font-black text-ember">{benefit.icon}</div>
                <p className="mt-8 text-xs font-black uppercase tracking-[.16em] text-cocoa/35">Benefit 0{index + 1}</p>
                <h3 className="mt-3 text-xl font-black">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-cocoa/65">{benefit.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <OrderLink>Order your lint remover</OrderLink>
          </div>
        </div>
      </section>

      <section className="border-y border-cocoa/10 bg-[#eadfd2] px-5 py-20 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <span className="eyebrow">Customer notes</span>
              <h2 className="mt-5 max-w-xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
                Everyday fabric care, in their words.
              </h2>
            </div>
            <p className="max-w-xl border-l-2 border-ember pl-5 text-base leading-7 text-cocoa/70 lg:justify-self-end">
              Simple experiences from women who like keeping well-loved clothes looking neat and ready to wear.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-6 lg:gap-6">
            {testimonials.map((testimonial, index) => (
              <figure
                key={testimonial.name}
                className={"group relative flex min-h-64 flex-col overflow-hidden rounded-[1.75rem] border border-cocoa/10 p-7 shadow-[0_14px_45px_rgba(73,40,22,0.09)] transition duration-300 hover:-translate-y-1 hover:rotate-0 " + testimonial.cardClass}
              >
                <span className="absolute right-6 top-4 font-serif text-7xl leading-none text-ember/12" aria-hidden="true">“</span>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-xs tracking-[.14em] text-ember" aria-label="5 out of 5 stars">★★★★★</div>
                  <span className="font-mono text-[10px] font-bold tracking-[.14em] text-cocoa/35">0{index + 1}</span>
                </div>
                <blockquote className="relative mt-8 flex-1 text-xl font-bold leading-8 text-ink">“{testimonial.quote}”</blockquote>
                <figcaption className="mt-7 flex items-center gap-3 border-t border-cocoa/10 pt-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-xs font-black tracking-wide text-white">
                    {testimonial.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-black text-ink">{testimonial.name}</span>
                    <span className="mt-0.5 block text-xs font-semibold text-cocoa/50">{testimonial.location}, Nepal</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-10 text-center text-xs leading-5 text-cocoa/45">
            Illustrative customer profiles are shown until verified buyer reviews are available.
          </p>
        </div>
      </section>

      <section id="faq" className="px-5 py-20 sm:py-28 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <span className="eyebrow">Good to know</span>
            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Frequently asked questions.</h2>
            <p className="mt-5 leading-7 text-cocoa/65">Everything you need to know before placing a Cash On Delivery order.</p>
            <OrderLink className="mt-7">Buy now</OrderLink>
          </div>
          <div className="divide-y divide-cocoa/10 border-y border-cocoa/10">
            {faqs.map((faq, index) => (
              <details key={faq.question} className="group py-1" open={index === 0}>
                <summary className="focus-ring flex cursor-pointer items-center justify-between gap-6 rounded-xl py-5 text-left text-lg font-black">
                  {faq.question}
                  <span className="faq-plus grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ember/10 text-ember transition">+</span>
                </summary>
                <p className="max-w-2xl pb-6 pr-10 text-sm leading-7 text-cocoa/65">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 lg:px-8">
        <div className="grain mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-clay px-7 py-14 text-center text-white shadow-lift sm:px-12 sm:py-20">
          <p className="text-sm font-black uppercase tracking-[.2em] text-white/60">Limited offer · Rs. 699</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">Give tired-looking fabrics a cleaner finish.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">Order today with no online payment. We&apos;ll call to confirm before dispatch.</p>
          <OrderLink className="mt-8 !bg-white !text-clay hover:!bg-cream">Order now — pay on delivery</OrderLink>
        </div>
      </section>

      <div className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-white/20 bg-ink/95 p-3 shadow-2xl backdrop-blur sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="pl-2 text-white">
            <p className="text-xs text-white/55 line-through">Rs. 1,000</p>
            <p className="font-black">Rs. 699</p>
          </div>
          <OrderLink className="min-h-0 flex-1 py-3 text-sm">Order now</OrderLink>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
