import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <>
      <div className="bg-ink px-4 py-2.5 text-center text-xs font-bold tracking-wide text-white sm:text-sm">
        Cash On Delivery across Nepal · Save Rs. 301 today
      </div>
      <header className="border-b border-cocoa/10 bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="focus-ring shrink-0" aria-label="Ganesh E Commerce Shop home">
            <Image
              src="/branding/home-logo-orange.png"
              alt="Ganesh E Commerce Shop"
              width={2172}
              height={724}
              priority
              className="h-10 w-auto sm:h-12"
            />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-cocoa/80 md:flex" aria-label="Main navigation">
            <Link href="#details" className="hover:text-ember">Details</Link>
            <Link href="#demo" className="hover:text-ember">See it work</Link>
            <Link href="#benefits" className="hover:text-ember">Benefits</Link>
            <Link href="#faq" className="hover:text-ember">FAQs</Link>
          </nav>
          <Link href="/checkout?quantity=1" className="button-primary min-h-0 px-5 py-2.5 text-sm">
            Order now
          </Link>
        </div>
      </header>
    </>
  );
}
