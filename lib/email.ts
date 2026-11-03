import nodemailer from "nodemailer";
import type { OrderRecord } from "@/lib/order";
import { formatNpr } from "@/lib/product";

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error("Missing required server environment variable: " + name);
  return value;
}

function escapeHtml(value: string | number) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function detailRow(label: string, value: string | number, strong = false) {
  return (
    '<tr><td style="padding:9px 0;color:#7a6256;font-size:14px;vertical-align:top">' +
    escapeHtml(label) +
    '</td><td style="padding:9px 0;color:#2a160e;font-size:14px;text-align:right;font-weight:' +
    (strong ? "800" : "600") +
    ';vertical-align:top">' +
    escapeHtml(value) +
    "</td></tr>"
  );
}

function section(title: string, rows: string) {
  return (
    '<div style="margin:22px 0 0"><div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#a85023;font-weight:800;margin-bottom:8px">' +
    escapeHtml(title) +
    '</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">' +
    rows +
    "</table></div>"
  );
}

function emailShell(brand: string, preheader: string, content: string) {
  return (
    '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="utf-8"><title>' +
    escapeHtml(preheader) +
    '</title></head><body style="margin:0;background:#f4ede5;font-family:Arial,Helvetica,sans-serif;color:#2a160e">' +
    '<div style="display:none;max-height:0;overflow:hidden;opacity:0">' +
    escapeHtml(preheader) +
    '</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4ede5;padding:28px 12px"><tr><td align="center">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#fffaf5;border-radius:24px;overflow:hidden;border:1px solid #ead6c5">' +
    '<tr><td style="background:#2a160e;padding:24px 30px;color:#fff"><div style="font-size:22px;font-weight:900;letter-spacing:.02em">' +
    escapeHtml(brand) +
    '</div><div style="font-size:12px;color:#efc7a9;margin-top:4px">Thoughtful care for everyday living</div></td></tr>' +
    '<tr><td style="padding:32px 30px">' +
    content +
    '</td></tr><tr><td style="padding:20px 30px;background:#f9efe6;color:#846b5d;font-size:12px;text-align:center">' +
    escapeHtml(brand) +
    " · Cash On Delivery</td></tr></table></td></tr></table></body></html>"
  );
}

function businessEmail(order: OrderRecord, brand: string) {
  const customerRows =
    detailRow("Customer", order.customerName) +
    detailRow("Phone", order.phone) +
    detailRow("Email", order.email) +
    detailRow("Location", order.location);
  const productRows =
    detailRow("Product", order.productName) +
    detailRow("Quantity", order.quantity) +
    detailRow("Price per piece", formatNpr(order.pricePerPiece)) +
    detailRow("Delivery", order.deliveryArea + " — " + formatNpr(order.deliveryFee)) +
    detailRow("Total", formatNpr(order.totalPrice), true);
  const paymentRows =
    detailRow("Payment method", order.paymentMethod) +
    detailRow("Order status", order.orderStatus);

  return emailShell(
    brand,
    "A new Cash On Delivery order has arrived.",
    '<div style="display:inline-block;background:#fff0e4;color:#a85023;padding:7px 12px;border-radius:999px;font-size:12px;font-weight:800">NEW ORDER</div>' +
      '<h1 style="margin:16px 0 8px;font-size:28px;line-height:1.2">New product order received</h1>' +
      '<p style="margin:0;color:#715b50;font-size:15px;line-height:1.7">Order <strong style="color:#2a160e">' +
      escapeHtml(order.orderId) +
      "</strong> was received on " +
      escapeHtml(order.dateTime) +
      ".</p>" +
      section("Customer details", customerRows) +
      section("Product details", productRows) +
      section("Payment details", paymentRows) +
      '<div style="margin-top:26px;padding:18px;background:#2a160e;color:#fff;border-radius:16px;font-size:14px;line-height:1.6"><strong>Please call the customer soon to confirm this order.</strong></div>'
  );
}

function customerEmail(order: OrderRecord, brand: string, supportEmail: string) {
  const rows =
    detailRow("Order ID", order.orderId) +
    detailRow("Product", order.productName) +
    detailRow("Quantity", order.quantity) +
    detailRow("Delivery", formatNpr(order.deliveryFee)) +
    detailRow("Total price", formatNpr(order.totalPrice), true) +
    detailRow("Payment method", order.paymentMethod);

  return emailShell(
    brand,
    "Your order has been received successfully.",
    '<div style="font-size:42px;line-height:1">✓</div><h1 style="margin:16px 0 8px;font-size:28px;line-height:1.2">Thank you for your order!</h1>' +
      '<p style="margin:0;color:#715b50;font-size:15px;line-height:1.7">Hi ' +
      escapeHtml(order.customerName) +
      ",</p>" +
      '<p style="color:#715b50;font-size:15px;line-height:1.7">We have received your order successfully. Here are your order details:</p>' +
      section("Order summary", rows) +
      '<div style="margin-top:26px;padding:18px;background:#fff0e4;color:#5b2c18;border-radius:16px;font-size:14px;line-height:1.6"><strong>Our sales representative will call you soon to confirm your order.</strong></div>' +
      '<p style="margin:24px 0 0;color:#715b50;font-size:14px;line-height:1.7">Need help? Reply to this email or contact <a href="mailto:' +
      escapeHtml(supportEmail) +
      '" style="color:#a85023">' +
      escapeHtml(supportEmail) +
      "</a>.</p>" +
      '<p style="margin:20px 0 0;color:#2a160e;font-size:14px;line-height:1.7">Thank you,<br><strong>' +
      escapeHtml(brand) +
      "</strong></p>"
  );
}

export async function sendOrderEmails(order: OrderRecord) {
  const smtpHost = required("SMTP_HOST");
  const smtpPort = Number(required("SMTP_PORT"));
  const smtpUser = required("SMTP_USER");
  const smtpPass = required("SMTP_PASS");
  const businessEmailAddress = required("BUSINESS_EMAIL");
  const emailFrom = required("EMAIL_FROM");
  const brand = process.env.BRAND_NAME?.trim() || "Ganesh E Commerce Shop";

  if (!Number.isInteger(smtpPort)) {
    throw new Error("SMTP_PORT must be a valid number.");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const from = brand + " <" + emailFrom + ">";

  await Promise.all([
    transporter.sendMail({
      from,
      to: businessEmailAddress,
      replyTo: order.email,
      subject: "New Product Order Received - " + order.orderId,
      html: businessEmail(order, brand),
    }),
    transporter.sendMail({
      from,
      to: order.email,
      replyTo: emailFrom,
      subject: "Your Order Has Been Received - " + brand,
      html: customerEmail(order, brand, emailFrom),
    }),
  ]);
}
