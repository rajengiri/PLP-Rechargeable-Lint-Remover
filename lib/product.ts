export const PRODUCT = {
  id: "lint-remover",
  name: "Rechargeable Lint Remover",
  shortName: "Lint Remover",
  headline: "Bring your favourite fabrics back to life.",
  description:
    "Remove unwanted fuzz and fabric pills from sweaters, jackets and blankets with a compact cordless tool made for everyday fabric care.",
  unitPrice: 699,
  regularPrice: 1000,
  currency: "NPR",
  images: [
    "/images/lint-remover-quiet.png",
    "/images/lint-remover-lifestyle.png",
    "/images/lint-remover-compact.png",
    "/images/lint-remover-lightweight.png",
  ],
  video: "/videos/lint-remover-demo.mp4",
  benefits: [
    {
      title: "Smoother-looking clothes",
      description: "Lifts away raised fuzz and bobbles for a cleaner, refreshed finish.",
      icon: "✦",
    },
    {
      title: "Cordless convenience",
      description: "Recharge it, pick it up and refresh fabrics without a trailing cable.",
      icon: "↯",
    },
    {
      title: "Less clothing waste",
      description: "Give worn-looking garments another chance before replacing them.",
      icon: "↻",
    },
    {
      title: "Compact and travel-ready",
      description: "Easy to hold, store and carry for fabric care at home or on the go.",
      icon: "◈",
    },
  ],
  deliveryFees: {
    insideValley: 100,
    outsideValley: 150,
  },
} as const;

export type DeliveryArea = keyof typeof PRODUCT.deliveryFees;

export function formatNpr(amount: number) {
  return "Rs. " + new Intl.NumberFormat("en-NP").format(amount);
}

export function getDeliveryFee(area: DeliveryArea) {
  return PRODUCT.deliveryFees[area];
}

export function calculateTotal(quantity: number, area?: DeliveryArea) {
  const productTotal = PRODUCT.unitPrice * quantity;
  return area ? productTotal + getDeliveryFee(area) : productTotal;
}
