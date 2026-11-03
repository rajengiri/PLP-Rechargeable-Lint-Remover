"use client";

import Link from "next/link";

export function OrderLink({
  quantity = 1,
  children,
  secondary = false,
  className = "",
}: {
  quantity?: number;
  children: React.ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={{ pathname: "/checkout", query: { quantity: String(quantity) } }}
      className={(secondary ? "button-secondary " : "button-primary ") + className}
    >
      {children}
      <span aria-hidden="true" className="ml-2">→</span>
    </Link>
  );
}
