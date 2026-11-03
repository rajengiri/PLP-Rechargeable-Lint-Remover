import { google } from "googleapis";
import type { OrderRecord } from "@/lib/order";

const SHEET_SETUP_VERSION = "ganesh_orders_v2";
const ORDER_SHEET_COLOR = { red: 35 / 255, green: 73 / 255, blue: 51 / 255 };
const HEADERS = [
  "Order ID",
  "Date & Time",
  "Customer Name",
  "Phone Number",
  "Email Address",
  "Exact Location",
  "Product Name",
  "Quantity",
  "Price Per Piece",
  "Delivery Area",
  "Delivery Fee",
  "Total Price",
  "Payment Method",
  "Order Status",
  "Notes",
];

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error("Missing required server environment variable: " + name);
  return value;
}

export async function saveOrderToSheet(order: OrderRecord) {
  const spreadsheetId = required("GOOGLE_SHEET_ID");
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME?.trim() || "Orders";
  const clientEmail = required("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = required("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const safeTabName = tabName.replace(/'/g, "''");

  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields:
      "developerMetadata(metadataKey),sheets(properties(sheetId,title,gridProperties,tabColorStyle))",
  });

  let sheet = spreadsheet.data.sheets?.find(
    (candidate) => candidate.properties?.title === tabName
  );

  if (!sheet?.properties?.sheetId && sheet?.properties?.sheetId !== 0) {
    const created = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: tabName,
                gridProperties: { rowCount: 1000, columnCount: HEADERS.length },
              },
            },
          },
        ],
      },
    });
    sheet = created.data.replies?.[0]?.addSheet;
  }

  const sheetId = sheet?.properties?.sheetId;
  if (sheetId === undefined || sheetId === null) {
    throw new Error("Could not create or locate the Google Sheets order tab.");
  }

  const currentTabColor = sheet?.properties?.tabColorStyle?.rgbColor;
  const colorsMatch = (current: number | null | undefined, target: number) =>
    current !== null && current !== undefined && Math.abs(current - target) < 0.000001;
  const tabColorMatches =
    colorsMatch(currentTabColor?.red, ORDER_SHEET_COLOR.red) &&
    colorsMatch(currentTabColor?.green, ORDER_SHEET_COLOR.green) &&
    colorsMatch(currentTabColor?.blue, ORDER_SHEET_COLOR.blue);

  if (!tabColorMatches) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId,
                tabColorStyle: { rgbColor: ORDER_SHEET_COLOR },
              },
              fields: "tabColorStyle",
            },
          },
        ],
      },
    });
  }

  const isFormatted = spreadsheet.data.developerMetadata?.some(
    (metadata) => metadata.metadataKey === SHEET_SETUP_VERSION
  );

  if (!isFormatted) {
    const widths = [170, 145, 165, 135, 220, 250, 190, 85, 120, 180, 110, 120, 150, 145, 240];
    const statusColors = [
      { text: "New Order", red: 0.96, green: 0.68, blue: 0.24 },
      { text: "Order Confirmed", red: 0.35, green: 0.62, blue: 0.96 },
      { text: "Order Ongoing", red: 0.63, green: 0.49, blue: 0.9 },
      { text: "Delivered", red: 0.34, green: 0.72, blue: 0.49 },
      { text: "Cancelled", red: 0.88, green: 0.36, blue: 0.36 },
    ];

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateCells: {
              range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: HEADERS.length },
              rows: [
                {
                  values: HEADERS.map((header) => ({
                    userEnteredValue: { stringValue: header },
                  })),
                },
              ],
              fields: "userEnteredValue",
            },
          },
          {
            updateSheetProperties: {
              properties: {
                sheetId,
                gridProperties: { frozenRowCount: 1, frozenColumnCount: 2 },
              },
              fields: "gridProperties.frozenRowCount,gridProperties.frozenColumnCount",
            },
          },
          {
            repeatCell: {
              range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: HEADERS.length },
              cell: {
                userEnteredFormat: {
                  backgroundColor: ORDER_SHEET_COLOR,
                  textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 11 },
                  horizontalAlignment: "CENTER",
                  verticalAlignment: "MIDDLE",
                  wrapStrategy: "WRAP",
                },
              },
              fields: "userEnteredFormat",
            },
          },
          {
            updateDimensionProperties: {
              range: { sheetId, dimension: "ROWS", startIndex: 0, endIndex: 1 },
              properties: { pixelSize: 42 },
              fields: "pixelSize",
            },
          },
          ...widths.map((pixelSize, index) => ({
            updateDimensionProperties: {
              range: { sheetId, dimension: "COLUMNS" as const, startIndex: index, endIndex: index + 1 },
              properties: { pixelSize },
              fields: "pixelSize",
            },
          })),
          {
            addBanding: {
              bandedRange: {
                range: { sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: HEADERS.length },
                rowProperties: {
                  firstBandColor: { red: 0.98, green: 0.99, blue: 0.98 },
                  secondBandColor: { red: 0.93, green: 0.96, blue: 0.94 },
                },
              },
            },
          },
          {
            setBasicFilter: {
              filter: { range: { sheetId, startRowIndex: 0, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: HEADERS.length } },
            },
          },
          {
            repeatCell: {
              range: { sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 7, endColumnIndex: 8 },
              cell: { userEnteredFormat: { horizontalAlignment: "CENTER" } },
              fields: "userEnteredFormat.horizontalAlignment",
            },
          },
          {
            repeatCell: {
              range: { sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 8, endColumnIndex: 12 },
              cell: { userEnteredFormat: { numberFormat: { type: "CURRENCY", pattern: "[$Rs] #,##0" } } },
              fields: "userEnteredFormat.numberFormat",
            },
          },
          {
            setDataValidation: {
              range: { sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 13, endColumnIndex: 14 },
              rule: {
                condition: {
                  type: "ONE_OF_LIST",
                  values: statusColors.map(({ text }) => ({ userEnteredValue: text })),
                },
                strict: true,
                showCustomUi: true,
              },
            },
          },
          ...statusColors.map(({ text, red, green, blue }) => ({
            addConditionalFormatRule: {
              index: 0,
              rule: {
                ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 13, endColumnIndex: 14 }],
                booleanRule: {
                  condition: { type: "TEXT_EQ", values: [{ userEnteredValue: text }] },
                  format: {
                    backgroundColor: { red, green, blue },
                    textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true },
                  },
                },
              },
            },
          })),
          {
            createDeveloperMetadata: {
              developerMetadata: {
                metadataKey: SHEET_SETUP_VERSION,
                metadataValue: tabName,
                visibility: "DOCUMENT",
                location: { spreadsheet: true },
              },
            },
          },
        ],
      },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "'" + safeTabName + "'!A:O",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          order.orderId,
          order.dateTime,
          order.customerName,
          order.phone,
          order.email,
          order.location,
          order.productName,
          order.quantity,
          order.pricePerPiece,
          order.deliveryArea,
          order.deliveryFee,
          order.totalPrice,
          order.paymentMethod,
          order.orderStatus,
          order.notes,
        ],
      ],
    },
  });
}
