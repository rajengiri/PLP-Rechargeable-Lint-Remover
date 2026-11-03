"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PRODUCT, formatNpr } from "@/lib/product";

export function ThankYouContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId") || "Confirmed";
  const product = params.get("product") || PRODUCT.name;
  const quantity = Math.max(1, Number(params.get("quantity")) || 1);
  const total = Math.max(0, Number(params.get("total")) || PRODUCT.unitPrice);

  return (
    <main className="grain relative grid min-h-screen place-items-center overflow-hidden bg-cream px-5 py-12">
      <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-ember/10 blur-3xl" />
      <div className="absolute -bottom-48 -right-36 h-[500px] w-[500px] rounded-full bg-sage/10 blur-3xl" />

      <div className="relative w-full max-w-2xl rounded-[2.5rem] border border-cocoa/10 bg-white p-7 text-center shadow-soft sm:p-12">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-sage text-4xl font-black text-white shadow-lg">✓</div>
        <p className="mt-7 text-xs font-black uppercase tracking-[.18em] text-sage">Order received</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Thank you for your order!</h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-cocoa/65">
          Our sales representative will call you soon to confirm your order.
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl border border-cocoa/10 bg-cream text-left">
          <div className="flex items-center justify-between gap-4 border-b border-cocoa/10 bg-sand/55 px-5 py-4">
            <span className="text-xs font-black uppercase tracking-widest text-cocoa/45">Order ID</span>
            <span className="text-sm font-black text-clay">{orderId}</span>
          </div>
          <dl className="space-y-4 p-5 text-sm sm:p-6">
            <div className="flex justify-between gap-5"><dt className="text-cocoa/55">Product ordered</dt><dd className="text-right font-bold">{product}</dd></div>
            <div className="flex justify-between gap-5"><dt className="text-cocoa/55">Quantity</dt><dd className="font-bold">{quantity}</dd></div>
            <div className="flex justify-between gap-5"><dt className="text-cocoa/55">Total price</dt><dd className="text-lg font-black text-clay">{formatNpr(total)}</dd></div>
            <div className="flex justify-between gap-5 border-t border-cocoa/10 pt-4"><dt className="text-cocoa/55">Payment method</dt><dd className="font-bold">Cash On Delivery</dd></div>
          </dl>
        </div>

        <div className="mt-7 rounded-2xl bg-[#eef5ee] p-4 text-sm leading-6 text-sage">
          A confirmation email has been sent to the email address provided at checkout.
        </div>

        <Link href="/" className="button-primary mt-8 min-w-48">Back to Home</Link>
        <p className="mt-6 text-xs text-cocoa/45">Need help? rajen.digitalmkt@gmail.com</p>
      </div>
    </main>
  );
}
