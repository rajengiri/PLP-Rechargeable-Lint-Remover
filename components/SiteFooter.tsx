import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-cocoa/10 bg-ink px-5 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/" className="focus-ring inline-flex rounded-xl bg-white px-3 py-2" aria-label="Ganesh E Commerce Shop home">
            <Image
              src="/branding/home-logo-orange.png"
              alt="Ganesh E Commerce Shop"
              width={2172}
              height={724}
              className="h-10 w-auto"
            />
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/60">
            Thoughtful tools for easier everyday living. Orders are confirmed by phone before dispatch.
          </p>
        </div>
        <div className="text-sm text-white/55">
          <p>Support: rajen.digitalmkt@gmail.com</p>
          <p className="mt-1">© {new Date().getFullYear()} Ganesh E Commerce Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
