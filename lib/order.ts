import { z } from "zod";

export const orderInputSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name.").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20)
    .regex(/^[0-9+()\-\s]+$/, "Please enter a valid phone number."),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  location: z.string().trim().min(5, "Please share your exact location.").max(500),
  productId: z.literal("lint-remover"),
  quantity: z.coerce.number().int().min(1).max(10),
  deliveryArea: z.enum(["insideValley", "outsideValley"]),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type OrderInput = z.infer<typeof orderInputSchema>;

export type OrderRecord = {
  orderId: string;
  dateTime: string;
  customerName: string;
  phone: string;
  email: string;
  location: string;
  productName: string;
  quantity: number;
  pricePerPiece: number;
  deliveryArea: "Inside Kathmandu Valley" | "Outside Kathmandu Valley";
  deliveryFee: number;
  totalPrice: number;
  paymentMethod: "Cash On Delivery";
  orderStatus: "New Order";
  notes: string;
};
