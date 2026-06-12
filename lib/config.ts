// ────────────────────────────────────────────────────────────
// PUBLIC, client-safe config only. NEVER put secrets here — this
// file is imported by client components. Secrets (Clerk secret key,
// Telegram bot token, n8n shared secret) live in server-only env and
// are read directly via process.env inside API routes. See .env.example.
// عدّل القيم التالية ببياناتك الفعلية.
// ────────────────────────────────────────────────────────────

export const COURSE = {
  name: "أكاديمية سكيل فلو",
  currency: "ج.م",
  priceEGP: 3997,
  originalPriceEGP: 6997,
} as const;

export const PAYMENT = {
  // معرّف إنستاباي الخاص بك (للدفع المحلي).
  instapayHandle: "ziadadelmahmoud@instapay",
  // رقم واتساب بصيغة دولية بدون + أو أصفار بادئة (احتياطي للدعم).
  whatsappNumber: "201221143366",
} as const;

// Public site origin — used for Whop returnUrl + absolute links.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://academy.scaleflow.digital";

// Foreign / card payment — Whop embedded checkout. The plan id is NOT a
// secret (it ships in the client iframe), so it's a public env value.
export const WHOP = {
  planId: process.env.NEXT_PUBLIC_WHOP_PLAN_ID ?? "",
} as const;

// Telegram login widget needs the PUBLIC bot username (e.g. "ScaleFlowAcademyBot").
// The bot TOKEN is a server-only secret (TELEGRAM_BOT_TOKEN) used to verify the
// login hash and to DM buyers — it is never exposed here.
export const TELEGRAM = {
  botUsername: process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? "",
} as const;

// Payment methods the picker offers.
export type PaymentMethod = "instapay" | "card";

// How a buyer authenticated → drives how access is delivered later.
export type AuthMethod = "google" | "telegram";
export type DeliveryChannel = "email" | "telegram";
