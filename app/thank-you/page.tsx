import { Suspense } from "react";
import { ThankYouContent } from "@/components/ThankYouContent";

export const metadata = {
  title: "Thank You for Your Order | Ganesh E Commerce Shop",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <ThankYouContent />
    </Suspense>
  );
}
