import "server-only";
import { google } from "googleapis";

// Server-only reader for the leads Sheet (order-status source of truth).
// Uses a Google service account with READ-ONLY access — share the Sheet with
// the service-account email. Never import this from a client component.

const SHEET_ID = process.env.LEADS_SHEET_ID ?? "";
const TAB = process.env.LEADS_SHEET_TAB ?? "leads";

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );
  if (!email || !key) {
    throw new Error("Google service account not configured");
  }
  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export type OrderRow = Record<string, string>;

// Reads the tab and returns the row matching lead_id as a header→value map.
// Header-driven so new columns don't break it.
export async function getOrderByLeadId(
  leadId: string,
): Promise<OrderRow | null> {
  if (!SHEET_ID) throw new Error("LEADS_SHEET_ID not set");
  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A1:Z100000`,
  });
  const rows = res.data.values ?? [];
  if (rows.length < 2) return null;

  const header = rows[0].map((h) => String(h).trim());
  const idIdx = header.indexOf("lead_id");
  if (idIdx === -1) return null;

  const match = rows
    .slice(1)
    .find((r) => String(r[idIdx] ?? "").trim() === leadId);
  if (!match) return null;

  const row: OrderRow = {};
  header.forEach((h, i) => {
    row[h] = String(match[i] ?? "");
  });
  return row;
}

export type OrderStage = "received" | "review" | "activated";

export type OrderStatus = {
  orderId: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
  accessStatus: string;
  whopStatus: string;
  clerkUserId: string;
  stage: OrderStage;
};

// Collapses the raw row into the 3-step tracker state.
export function deriveStatus(leadId: string, row: OrderRow): OrderStatus {
  const accessStatus = row.access_status ?? "";
  const whopStatus = row.whop_status ?? "";
  const activated =
    whopStatus === "joined" ||
    whopStatus === "paid_on_whop" ||
    accessStatus === "access_activated";
  const stage: OrderStage = activated
    ? "activated"
    : accessStatus === "granted"
      ? "review"
      : "review";
  return {
    orderId: leadId,
    createdAt: row.created_at ?? "",
    paymentMethod: row.payment_method ?? "",
    paymentStatus: row.payment_status ?? "",
    accessStatus,
    whopStatus,
    clerkUserId: row.clerk_user_id ?? "",
    stage,
  };
}
