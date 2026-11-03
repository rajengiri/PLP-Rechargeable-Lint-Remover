import { Suspense } from "react";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = {
  title: "Secure Checkout | Ganesh E Commerce Shop",
  description: "Place your Cash On Delivery order for the Ganesh E Commerce Shop Rechargeable Lint Remover.",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <CheckoutForm />
    </Suspense>
  );
}
