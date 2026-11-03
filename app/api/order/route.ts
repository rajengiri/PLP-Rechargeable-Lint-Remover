import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { sendOrderEmails } from "@/lib/email";
import { saveOrderToSheet } from "@/lib/google-sheets";
import { orderInputSchema, type OrderRecord } from "@/lib/order";
import { PRODUCT, calculateTotal, getDeliveryFee } from "@/lib/product";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROJECT_DEPLOYMENT_HOST =
  /^plp-rechargeable-lint-remover-[a-z0-9]{6,32}-rajendigitalmkt-2291\.vercel\.app$/i;

function makeOrderId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return "GANESH-" + date + "-" + randomUUID().slice(0, 6).toUpperCase();
}

function formatKathmanduTime(date: Date) {
  return new Intl.DateTimeFormat("en-NP", {
    timeZone: "Asia/Kathmandu",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function normalizeOrigin(value: string | null | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`).origin;
  } catch {
    return null;
  }
}

function isTrustedProjectDeployment(origin: string) {
  try {
    const url = new URL(origin);
    return url.protocol === "https:" && PROJECT_DEPLOYMENT_HOST.test(url.hostname);
  } catch {
    return false;
  }
}

function originIsAllowed(request: NextRequest) {
  const requestOrigin = normalizeOrigin(request.headers.get("origin"));
  if (!requestOrigin) return true;

  const allowedOrigins = new Set(
    [
      process.env.FRONTEND_URL,
      process.env.NEXT_PUBLIC_SITE_URL,
      process.env.VERCEL_URL,
      process.env.VERCEL_BRANCH_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
    ]
      .map(normalizeOrigin)
      .filter((origin): origin is string => Boolean(origin))
  );

  return (
    allowedOrigins.has(requestOrigin) ||
    isTrustedProjectDeployment(requestOrigin)
  );
}

export async function POST(request: NextRequest) {
  if (!originIsAllowed(request)) {
    return NextResponse.json({ error: "This request origin is not allowed." }, { status: 403 });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }

  try {
    const body = await request.json();
    const parsed = orderInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please correct the highlighted order details.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const now = new Date();
    const deliveryFee = getDeliveryFee(input.deliveryArea);
    const order: OrderRecord = {
      orderId: makeOrderId(),
      dateTime: formatKathmanduTime(now),
      customerName: input.customerName,
      phone: input.phone,
      email: input.email,
      location: input.location,
      productName: PRODUCT.name,
      quantity: input.quantity,
      pricePerPiece: PRODUCT.unitPrice,
      deliveryArea:
        input.deliveryArea === "insideValley"
          ? "Inside Kathmandu Valley"
          : "Outside Kathmandu Valley",
      deliveryFee,
      totalPrice: calculateTotal(input.quantity, input.deliveryArea),
      paymentMethod: "Cash On Delivery",
      orderStatus: "New Order",
      notes: "",
    };

    await saveOrderToSheet(order);

    try {
      await sendOrderEmails(order);
    } catch (emailError) {
      console.error("Order saved but email delivery failed", {
        orderId: order.orderId,
        error: emailError,
      });
      return NextResponse.json(
        {
          error:
            "Your order was saved, but the confirmation email could not be completed. Please do not submit again; contact support with this order ID.",
          orderId: order.orderId,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        productName: order.productName,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
      },
    });
  } catch (error) {
    console.error("Order submission failed", error);
    return NextResponse.json(
      {
        error:
          "We could not submit your order right now. Please check the store setup or try again shortly.",
      },
      { status: 500 }
    );
  }
}
