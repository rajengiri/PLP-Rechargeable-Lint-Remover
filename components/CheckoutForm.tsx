"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PRODUCT, calculateTotal, formatNpr, getDeliveryFee, type DeliveryArea } from "@/lib/product";

type FieldErrors = Partial<Record<"customerName" | "phone" | "email" | "location" | "quantity" | "deliveryArea", string[]>>;

function clampQuantity(value: string | null) {
  const parsed = Number(value || 1);
  return Number.isInteger(parsed) ? Math.min(10, Math.max(1, parsed)) : 1;
}

export function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(() => clampQuantity(searchParams.get("quantity")));
  const [deliveryArea, setDeliveryArea] = useState<DeliveryArea>("insideValley");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const productSubtotal = PRODUCT.unitPrice * quantity;
  const deliveryFee = getDeliveryFee(deliveryArea);
  const total = useMemo(() => calculateTotal(quantity, deliveryArea), [quantity, deliveryArea]);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError("");
    setFieldErrors({});

    const form = new FormData(event.currentTarget);
    const payload = {
      customerName: form.get("customerName"),
      phone: form.get("phone"),
      email: form.get("email"),
      location: form.get("location"),
      productId: PRODUCT.id,
      quantity,
      deliveryArea,
      website: form.get("website"),
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setFieldErrors(data.fieldErrors || {});
        setError(data.orderId ? data.error + " Order ID: " + data.orderId : data.error || "Order submission failed.");
        return;
      }

      const params = new URLSearchParams({
        orderId: data.order.orderId,
        product: data.order.productName,
        quantity: String(data.order.quantity),
        total: String(data.order.totalPrice),
      });
      router.push("/thank-you?" + params.toString());
    } catch {
      setError("We could not connect to the order service. Please check your internet connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "focus-ring mt-2 w-full rounded-2xl border border-sage/20 bg-white px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-cocoa/35 focus:border-sage";

  return (
    <main className="checkout-theme min-h-screen bg-[#eef4ec]">
      <header className="border-b border-sage/15 bg-[#fbfdf9] px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="focus-ring shrink-0" aria-label="Ganesh E Commerce Shop home">
            <Image
              src="/branding/checkout-logo-green.png"
              alt="Ganesh E Commerce Shop"
              width={2172}
              height={724}
              priority
              className="h-8 w-auto sm:h-12"
            />
          </Link>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-sage sm:gap-2 sm:text-sm">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sage/10 sm:h-7 sm:w-7">✓</span>
            <span className="sm:hidden">COD checkout</span>
            <span className="hidden sm:inline">Secure Cash On Delivery checkout</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
        <Link href="/" className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-sage/80 hover:text-[#2f4a32]">← Back to product</Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
          <form onSubmit={submitOrder} className="rounded-4xl bg-white p-6 shadow-soft sm:p-9" noValidate>
            <div>
              <span className="eyebrow">Delivery details</span>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Complete your order</h1>
              <p className="mt-3 text-sm leading-6 text-cocoa/60">Enter accurate details so our representative can call and confirm delivery.</p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold text-cocoa">
                Full Name <span className="text-sage">*</span>
                <input name="customerName" autoComplete="name" required className={inputClass} placeholder="Your full name" />
                {fieldErrors.customerName?.[0] && <span className="mt-1 block text-xs text-red-600">{fieldErrors.customerName[0]}</span>}
              </label>
              <label className="text-sm font-bold text-cocoa">
                Phone Number <span className="text-sage">*</span>
                <input name="phone" autoComplete="tel" inputMode="tel" required className={inputClass} placeholder="98XXXXXXXX" />
                {fieldErrors.phone?.[0] && <span className="mt-1 block text-xs text-red-600">{fieldErrors.phone[0]}</span>}
              </label>
              <label className="text-sm font-bold text-cocoa sm:col-span-2">
                Email Address <span className="text-sage">*</span>
                <input name="email" type="email" autoComplete="email" required className={inputClass} placeholder="you@example.com" />
                {fieldErrors.email?.[0] && <span className="mt-1 block text-xs text-red-600">{fieldErrors.email[0]}</span>}
              </label>
              <label className="text-sm font-bold text-cocoa sm:col-span-2">
                Delivery Area <span className="text-sage">*</span>
                <select
                  name="deliveryArea"
                  value={deliveryArea}
                  onChange={(event) => setDeliveryArea(event.target.value as DeliveryArea)}
                  className={inputClass}
                >
                  <option value="insideValley">Inside Kathmandu Valley — Rs. 100</option>
                  <option value="outsideValley">Outside Kathmandu Valley — Rs. 150</option>
                </select>
              </label>
              <label className="text-sm font-bold text-cocoa sm:col-span-2">
                Exact Location <span className="text-sage">*</span>
                <textarea name="location" autoComplete="street-address" required rows={4} className={inputClass + " resize-none"} placeholder="Kindly share your exact location" />
                {fieldErrors.location?.[0] && <span className="mt-1 block text-xs text-red-600">{fieldErrors.location[0]}</span>}
              </label>
              <label className="absolute left-[-9999px]" aria-hidden="true">
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {error && (
              <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="button-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-65"
            >
              {submitting ? "Submitting Order..." : "Order Now — " + formatNpr(total)}
            </button>
            <p className="mt-4 text-center text-xs leading-5 text-cocoa/50">
              By ordering, you agree to be contacted by phone to confirm your Cash On Delivery order.
            </p>
          </form>

          <aside className="rounded-4xl bg-[#223226] p-6 text-white shadow-[0_20px_50px_rgba(39,70,45,0.2)] sm:p-8 lg:sticky lg:top-6">
            <h2 className="text-xl font-black">Order summary</h2>
            <div className="mt-6 flex gap-4 border-b border-white/10 pb-6">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-sand">
                <Image src="/images/lint-remover-lifestyle.png" alt={PRODUCT.name} fill sizes="100px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black">{PRODUCT.name}</p>
                <p className="mt-1 text-sm text-white/55">Price per piece: {formatNpr(PRODUCT.unitPrice)}</p>
                <div className="mt-3 inline-flex items-center rounded-full border border-white/15 p-1">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="focus-ring grid h-8 w-8 place-items-center rounded-full hover:bg-white/10" aria-label="Decrease quantity">−</button>
                  <span className="w-8 text-center text-sm font-black">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((value) => Math.min(10, value + 1))} className="focus-ring grid h-8 w-8 place-items-center rounded-full hover:bg-white/10" aria-label="Increase quantity">+</button>
                </div>
              </div>
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4 text-white/65"><dt>Product subtotal</dt><dd className="font-bold text-white">{formatNpr(productSubtotal)}</dd></div>
              <div className="flex justify-between gap-4 text-white/65"><dt>Delivery fee</dt><dd className="font-bold text-white">{formatNpr(deliveryFee)}</dd></div>
              <div className="flex justify-between gap-4 border-t border-white/10 pt-5 text-base"><dt className="font-black">Total</dt><dd className="text-2xl font-black text-[#b9d7b8]">{formatNpr(total)}</dd></div>
            </dl>

            <div className="mt-7 rounded-2xl bg-white/7 p-4">
              <div className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sage text-sm">✓</span>
                <div><p className="text-sm font-black">No online payment</p><p className="mt-1 text-xs leading-5 text-white/50">Pay in cash when your order is delivered.</p></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
