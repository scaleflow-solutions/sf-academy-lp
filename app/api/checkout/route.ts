import { NextResponse, type NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { COURSE } from "@/lib/config";

export const runtime = "nodejs";

// Authed order capture. The client never supplies identity — we read it from
// the Clerk session and forward the order (incl. receipt) to the existing n8n
// lead-capture webhook, which handles Drive upload + Sheet append (idempotent
// on lead_id). Works for both InstaPay (with receipt/txn) and card (whop_receipt_id).
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const leadId = String(form.get("lead_id") ?? "").trim();
  if (!leadId) {
    return NextResponse.json({ error: "missing lead_id" }, { status: 400 });
  }

  const user = await currentUser();
  const authMethod =
    (user?.publicMetadata?.auth_method as string | undefined) ?? "google";
  const telegramUserId =
    (user?.publicMetadata?.telegram_user_id as string | undefined) ?? "";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "";
  const deliveryChannel = authMethod === "telegram" ? "telegram" : "email";
  const paymentMethod = String(form.get("payment_method") ?? "instapay");

  const out = new FormData();
  out.append("lead_id", leadId);
  out.append("clerk_user_id", userId);
  out.append("name", name);
  out.append("email", email);
  out.append("phone", String(form.get("phone") ?? ""));
  out.append("amount", String(COURSE.priceEGP));
  out.append("currency", COURSE.currency);
  out.append("payment_method", paymentMethod);
  out.append("auth_method", authMethod);
  out.append("delivery_channel", deliveryChannel);
  out.append("telegram_user_id", telegramUserId);
  out.append("transaction_id", String(form.get("transaction_id") ?? ""));
  out.append("whop_receipt_id", String(form.get("whop_receipt_id") ?? ""));

  const screenshot = form.get("screenshot");
  if (screenshot instanceof File && screenshot.size > 0) {
    out.append("screenshot", screenshot, screenshot.name);
  }

  const webhook =
    process.env.N8N_LEAD_WEBHOOK_URL ??
    `${process.env.N8N_BASE_URL ?? "https://n8n.scaleflow.digital"}/webhook/scaleflow-checkout`;

  const headers: Record<string, string> = {};
  if (process.env.N8N_INTERNAL_SECRET) {
    headers["x-sf-internal"] = process.env.N8N_INTERNAL_SECRET;
  }

  try {
    const res = await fetch(webhook, { method: "POST", body: out, headers });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, lead_id: leadId, upstream: res.status },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, lead_id: leadId });
  } catch (err) {
    console.error("[api/checkout] upstream error", err);
    return NextResponse.json(
      { ok: false, lead_id: leadId },
      { status: 502 },
    );
  }
}
