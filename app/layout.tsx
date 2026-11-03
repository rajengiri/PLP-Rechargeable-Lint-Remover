import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Rechargeable Lint Remover | Ganesh E Commerce Shop",
  description:
    "Refresh sweaters, jackets and blankets with the compact rechargeable lint remover from Ganesh E Commerce Shop. Cash On Delivery available across Nepal.",
  keywords: ["lint remover Nepal", "fabric shaver", "rechargeable lint remover", "Ganesh E Commerce Shop"],
  openGraph: {
    title: "Rechargeable Lint Remover | Ganesh E Commerce Shop",
    description: "Bring your favourite fabrics back to life for only Rs. 699.",
    type: "website",
    images: ["/images/lint-remover-lifestyle.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
