// ────────────────────────────────────────────────────────────
// بيانات العرض والدفع — عدّل القيم التالية ببياناتك الفعلية.
// ────────────────────────────────────────────────────────────

export const COURSE = {
  name: "أكاديمية سكيل فلو",
  currency: "ج.م",
  priceEGP: 3997,
  originalPriceEGP: 6997,
} as const;

export const PAYMENT = {
  // معرّف إنستاباي الخاص بك.
  instapayHandle: "ziadadelmahmoud@instapay",
  // رقم واتساب بصيغة دولية بدون علامة + أو أصفار بادئة.
  whatsappNumber: "201221143366",
} as const;
