"use client";

import Image from "next/image";
import { useState } from "react";
import { OrderLink } from "@/components/OrderLink";
import { PRODUCT, formatNpr } from "@/lib/product";

export function ProductShowcase() {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  function changeImage(direction: number) {
    setActiveImage((current) => (current + direction + PRODUCT.images.length) % PRODUCT.images.length);
  }

  return (
    <section id="details" className="px-5 py-20 sm:py-28 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
        <div>
          <div className="relative overflow-hidden rounded-4xl bg-sand shadow-soft">
            <div className="relative aspect-[4/5]">
              <Image
                key={PRODUCT.images[activeImage]}
                src={PRODUCT.images[activeImage]}
                alt={"Rechargeable lint remover product view " + (activeImage + 1)}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
                priority={activeImage === 0}
              />
            </div>
            <button
              type="button"
              onClick={() => changeImage(-1)}
              aria-label="Previous product image"
              className="focus-ring absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-xl shadow-lg"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => changeImage(1)}
              aria-label="Next product image"
              className="focus-ring absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-xl shadow-lg"
            >
              ›
            </button>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {PRODUCT.images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={"View product image " + (index + 1)}
                aria-pressed={activeImage === index}
                className={
                  "focus-ring relative aspect-square overflow-hidden rounded-2xl border-2 bg-sand transition " +
                  (activeImage === index ? "border-ember" : "border-transparent opacity-70 hover:opacity-100")
                }
              >
                <Image src={image} alt="" fill sizes="150px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:pl-7">
          <span className="eyebrow">Limited-time offer</span>
          <h2 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">{PRODUCT.name}</h2>
          <p className="mt-5 text-lg leading-8 text-cocoa/70">
            A quick, cordless way to clear visible fuzz from everyday fabrics and make well-loved pieces look neater again.
          </p>
          <div className="mt-7 flex items-end gap-3">
            <span className="text-4xl font-black text-clay">{formatNpr(PRODUCT.unitPrice)}</span>
            <span className="pb-1 text-lg font-semibold text-cocoa/45 line-through">{formatNpr(PRODUCT.regularPrice)}</span>
            <span className="mb-1 rounded-full bg-sage px-3 py-1 text-xs font-extrabold text-white">30% OFF</span>
          </div>

          <ul className="mt-8 grid gap-4 text-sm font-semibold text-cocoa/80 sm:grid-cols-2">
            {PRODUCT.benefits.map((benefit) => (
              <li key={benefit.title} className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ember/10 text-ember">✓</span>
                {benefit.title}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-3xl border border-cocoa/10 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-cocoa/55">Quantity</p>
                <div className="mt-2 inline-flex items-center rounded-full border border-cocoa/15 bg-cream p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="focus-ring grid h-10 w-10 place-items-center rounded-full text-xl font-bold hover:bg-white"
                    aria-label="Decrease quantity"
                  >−</button>
                  <span className="w-10 text-center font-black" aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.min(10, value + 1))}
                    className="focus-ring grid h-10 w-10 place-items-center rounded-full text-xl font-bold hover:bg-white"
                    aria-label="Increase quantity"
                  >+</button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-cocoa/55">Product total</p>
                <p className="mt-2 text-2xl font-black text-clay">{formatNpr(PRODUCT.unitPrice * quantity)}</p>
              </div>
            </div>
            <p className="mt-4 border-t border-cocoa/10 pt-4 text-xs leading-5 text-cocoa/55">
              Delivery: Rs. 100 inside Kathmandu Valley or Rs. 150 outside the Valley, calculated at checkout.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <OrderLink quantity={quantity} className="flex-1">Buy now — Cash On Delivery</OrderLink>
            <a href="#demo" className="button-secondary">Watch demo</a>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs font-bold text-cocoa/65">
            <div className="rounded-2xl bg-sand/50 p-3">COD available</div>
            <div className="rounded-2xl bg-sand/50 p-3">Fast delivery</div>
            <div className="rounded-2xl bg-sand/50 p-3">Phone support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
