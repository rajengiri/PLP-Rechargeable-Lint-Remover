# Ganesh E Commerce Shop — Cash On Delivery Sales Funnel

A production-ready Next.js App Router funnel for the **Rechargeable Lint Remover**, with a responsive product landing page, checkout, thank-you page, Google Sheets order capture and two transactional email notifications.

## Recommended stack

- **Next.js App Router + TypeScript** — landing pages and secure server API in one deployable project.
- **Tailwind CSS** — responsive, reusable styling.
- **Google Sheets API** — appends each validated order to an `Orders` sheet.
- **Nodemailer + Gmail SMTP** — sends the business order alert and customer confirmation.
- **Zod** — server-side input validation.
- **Vercel** — recommended hosting for the Next.js app and `/api/order` route.

## How the order flow works

1. A customer chooses a quantity on the landing page and opens `/checkout?quantity=...`.
2. Checkout collects name, phone, email, delivery area and exact location. Product and pricing fields are generated from the product configuration and cannot be manually edited.
3. The browser sends JSON to `POST /api/order`. The button is disabled and displays **Submitting Order...** while the request is active.
4. The server validates the form, ignores client-controlled prices, recalculates the product price, delivery fee and total, and creates a unique order ID.
5. The server appends the order to Google Sheets.
6. Only after the sheet append succeeds, the server sends the business notification and customer confirmation email.
7. The API reports success only when the sheet and both emails succeed. The browser then redirects to `/thank-you` with the safe order summary.

If the sheet succeeds but an email fails, the API returns the saved order ID and tells the customer not to submit again. The error is also logged server-side for diagnosis.

## Local setup

1. Install Node.js 20.9 or newer.
2. Install packages:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and add the real credentials.
4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`.

The application will load without credentials, but a real order submission intentionally fails until the Google and SMTP environment variables are configured.

## Environment variables

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BUSINESS_EMAIL=rajen.digitalmkt@gmail.com
EMAIL_FROM=rajen.digitalmkt@gmail.com
BRAND_NAME=Ganesh E Commerce Shop

GOOGLE_SHEET_ID=
GOOGLE_SHEET_TAB_NAME=Orders
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=rajen.digitalmkt@gmail.com
SMTP_PASS=

EMAIL_SERVICE_API_KEY=
FRONTEND_URL=http://localhost:3000
```

`EMAIL_SERVICE_API_KEY` is reserved for a future Resend, Brevo or SendGrid adapter and is not needed for Gmail SMTP.

## Google Spreadsheet setup

### 1. Create the sheet

The application automatically creates an `Orders` tab when it is missing and applies the dashboard formatting on the first successful order. It also adds these headers from A1 through O1:

| Column | Header |
| --- | --- |
| A | Order ID |
| B | Date & Time |
| C | Customer Name |
| D | Phone Number |
| E | Email Address |
| F | Exact Location |
| G | Product Name |
| H | Quantity |
| I | Price Per Piece |
| J | Delivery Area |
| K | Delivery Fee |
| L | Total Price |
| M | Payment Method |
| N | Order Status |
| O | Notes |

The first row is frozen, the first two columns remain visible while scrolling, and the header, filters, column widths, currency fields, alternating rows, and status colours are applied automatically.

### 2. Add filters

The app creates a filter across A1:O automatically. This lets you filter by date, location, delivery area or order status.

### 3. Add the Order Status dropdown

The app creates a colour-coded dropdown in column N with:

   - New Order
   - Order Confirmed
   - Order Ongoing
   - Delivered
   - Cancelled

New website submissions use `New Order` automatically.

### 4. Create Google service account credentials

1. Open Google Cloud Console and create or select a project.
2. Enable the **Google Sheets API**.
3. Go to **IAM & Admin → Service Accounts** and create a service account.
4. Open the service account, create a JSON key and download it securely.
5. From the JSON file:
   - Put `client_email` in `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
   - Put `private_key` in `GOOGLE_PRIVATE_KEY`. On Vercel, paste the complete key including `BEGIN/END PRIVATE KEY`; escaped `\n` line breaks are supported.
6. In Google Sheets, click **Share** and share the spreadsheet with the service account email as **Editor**.

Never commit the JSON key or `.env.local`.

### 5. Find the Sheet ID

In a URL like:

```text
https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit#gid=0
```

the Sheet ID is the text between `/d/` and `/edit`: `1AbCdEfGhIjKlMnOpQrStUvWxYz`.

## Gmail SMTP setup

1. Turn on 2-Step Verification for the Gmail account.
2. Create a Google **App Password** for Mail.
3. Set `SMTP_USER` and `EMAIL_FROM` to the Gmail address.
4. Put the 16-character App Password in `SMTP_PASS` (not the normal Gmail password).
5. Use `smtp.gmail.com`, port `465`.

The business email is sent to `BUSINESS_EMAIL`. The customer sees `Ganesh E Commerce Shop <EMAIL_FROM>` and can reply to that address.

## Testing a successful order

1. Use a test spreadsheet and complete all environment variables.
2. Run `npm run dev` and place an order using an email address you can check.
3. Confirm all four results:
   - A new row appears in the correct Google Sheets tab.
   - The business Gmail receives **New Product Order Received - [Order ID]**.
   - The customer receives **Your Order Has Been Received - Ganesh E Commerce Shop**.
   - The browser reaches `/thank-you` and displays the same order ID, quantity and total.
4. Test validation by submitting an invalid email and an empty location; the form should remain on checkout and show errors.
5. Temporarily use an invalid SMTP password to confirm that the page does not redirect and the API reports the saved order ID without creating an accidental second order.

Run the production checks before deploying:

```bash
npm run typecheck
npm run build
```

## Deploying on Vercel

1. Push this project to GitHub, GitLab or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected framework as **Next.js**.
4. Add every value from `.env.example` under **Project Settings → Environment Variables**.
5. Set both `NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL` to the final HTTPS Vercel domain, with no trailing slash.
6. Deploy, then place one real test order and verify the sheet, both emails and redirect.

When the production domain changes, update both URL environment variables and redeploy. The API uses them to reject cross-origin browser submissions.

## Editing the product later

Product name, benefits, images, price and delivery fees live in `lib/product.ts`. The API imports the same file as the landing page, so displayed and charged totals stay synchronized.

## Security notes

- Google and SMTP credentials are read only inside server modules.
- Prices are recalculated on the server; values sent from the browser are not trusted.
- The API validates every field and restricts quantity to 1–10.
- A hidden honeypot field filters basic form bots.
- `FRONTEND_URL`/`NEXT_PUBLIC_SITE_URL` restricts browser origins in production.
- `.env*` secrets are excluded from Git; `.env.example` contains placeholders only.
