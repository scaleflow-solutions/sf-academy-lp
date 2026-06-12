"use client";

import { useEffect, useRef, useState } from "react";
import { COURSE, PAYMENT } from "@/lib/config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EG_PHONE_RE = /^01[0-9]{9}$/;

// n8n "Lead Capture" webhook (Flow A). Override per-env if needed.
const WEBHOOK_URL =
  process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL ??
  "https://n8n.scaleflow.digital/webhook/scaleflow-checkout";

function makeLeadId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type SubmitState = "idle" | "submitting" | "sent" | "error";

export default function CheckoutForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [submit, setSubmit] = useState<SubmitState>("idle");

  // Stable per-visit ID — the backend keys its row on this (idempotent).
  const [leadId, setLeadId] = useState("");
  useEffect(() => setLeadId(makeLeadId()), []);

  const cleanPhone = phone.replace(/\s+/g, "");
  const nameOk = name.trim().length >= 3;
  const emailOk = EMAIL_RE.test(email.trim());
  const phoneOk = EG_PHONE_RE.test(cleanPhone);
  const formValid = nameOk && emailOk && phoneOk;
  const readyToConfirm = formValid && !!screenshot && !!leadId;

  const waMessage =
    `السلام عليكم 👋\n` +
    `حابب أنضم لـ ${COURSE.name}.\n\n` +
    `الاسم: ${name.trim()}\n` +
    `البريد الإلكتروني: ${email.trim()}\n` +
    `رقم الموبايل: ${cleanPhone}\n` +
    `المبلغ: ${COURSE.priceEGP} ${COURSE.currency}\n\n` +
    `أنا دفعت عبر إنستاباي، ودي صورة إثبات التحويل 👇`;

  const waLink = `https://wa.me/${PAYMENT.whatsappNumber}?text=${encodeURIComponent(
    waMessage,
  )}`;

  // Best-effort early capture: the moment the fields are valid, record the lead
  // (without screenshot) so abandoners are still captured. keepalive lets the
  // request survive navigation. Fires once per leadId.
  const beaconSent = useRef(false);
  useEffect(() => {
    if (!formValid || !leadId || beaconSent.current) return;
    beaconSent.current = true;
    const body = new FormData();
    body.append("lead_id", leadId);
    body.append("name", name.trim());
    body.append("email", email.trim());
    body.append("phone", cleanPhone);
    body.append("amount", String(COURSE.priceEGP));
    body.append("currency", COURSE.currency);
    fetch(WEBHOOK_URL, { method: "POST", body, keepalive: true }).catch(() => {
      // best-effort only; the confirm step is the source of truth
      beaconSent.current = false;
    });
  }, [formValid, leadId, name, email, cleanPhone]);

  async function copyHandle() {
    try {
      await navigator.clipboard.writeText(PAYMENT.instapayHandle);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  // Confirm: send the full record + screenshot to the backend, then hand off to
  // WhatsApp. Same lead_id as the beacon → backend updates the existing row.
  async function handleConfirm() {
    if (!readyToConfirm || submit === "submitting") return;
    setSubmit("submitting");
    const body = new FormData();
    body.append("lead_id", leadId);
    body.append("name", name.trim());
    body.append("email", email.trim());
    body.append("phone", cleanPhone);
    body.append("amount", String(COURSE.priceEGP));
    body.append("currency", COURSE.currency);
    if (screenshot) body.append("screenshot", screenshot, screenshot.name);

    try {
      const res = await fetch(WEBHOOK_URL, { method: "POST", body });
      setSubmit(res.ok ? "sent" : "error");
    } catch {
      setSubmit("error");
    } finally {
      // Open WhatsApp regardless, so the user is never blocked.
      window.open(waLink, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="space-y-8">
      {/* Step 1 — buyer details */}
      <div className="neo-card rounded-xl border-2 border-black bg-surface-container-lowest p-6 md:p-8">
        <h2 className="mb-6 flex items-center gap-2 font-headline-md text-headline-md font-bold">
          <span className="flex h-8 w-8 items-center justify-center border-2 border-black bg-primary-container font-bold text-black">
            1
          </span>
          بياناتك
        </h2>

        <div className="space-y-5">
          <Field
            id="name"
            label="اسمك بالكامل"
            value={name}
            onChange={setName}
            placeholder="مثلاً: زياد عادل"
            error={name.length > 0 && !nameOk ? "اكتب اسمك صح." : ""}
          />
          <Field
            id="email"
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            error={
              email.length > 0 && !emailOk
                ? "البريد الإلكتروني مش مظبوط."
                : ""
            }
          />
          <Field
            id="phone"
            label="رقم الموبايل (مصري)"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="01XXXXXXXXX"
            error={
              phone.length > 0 && !phoneOk
                ? "رقم الموبايل لازم يبدأ بـ 01 ويكون 11 رقم."
                : ""
            }
          />
        </div>
      </div>

      {/* Step 2 — Instapay payment */}
      <div className="neo-card rounded-xl border-2 border-black bg-surface-container-lowest p-6 md:p-8">
        <h2 className="mb-6 flex items-center gap-2 font-headline-md text-headline-md font-bold">
          <span className="flex h-8 w-8 items-center justify-center border-2 border-black bg-primary-container font-bold text-black">
            2
          </span>
          ادفع عبر إنستاباي
        </h2>

        <div className="mb-6 flex items-center justify-between border-2 border-black bg-primary-container p-4 text-black">
          <span className="font-body-md font-bold">المبلغ المطلوب</span>
          <span className="font-display-lg text-2xl font-bold">
            {COURSE.priceEGP} {COURSE.currency}
          </span>
        </div>

        <p className="mb-2 font-label-md text-label-md uppercase text-on-surface-variant">
          حوّل المبلغ على معرّف إنستاباي ده
        </p>
        <div className="flex items-stretch gap-3">
          <code className="flex-1 select-all border-2 border-black bg-surface px-4 py-3 font-body-md font-bold text-on-surface">
            {PAYMENT.instapayHandle}
          </code>
          <button
            type="button"
            onClick={copyHandle}
            className="neo-button flex items-center gap-1 border-2 border-black bg-surface px-4 font-label-md text-label-md font-bold"
          >
            <span className="material-symbols-outlined text-base">
              {copied ? "check" : "content_copy"}
            </span>
            {copied ? "اتنسخ" : "نسخ"}
          </button>
        </div>

        <ol className="mt-6 space-y-2 font-body-md text-body-md text-on-surface-variant">
          <li>1. افتح تطبيق إنستاباي على موبايلك.</li>
          <li>
            2. حوّل مبلغ {COURSE.priceEGP} {COURSE.currency} على المعرّف اللي
            فوق.
          </li>
          <li>3. خُد صورة (Screenshot) لإثبات التحويل.</li>
          <li>4. ارفع الصورة في الخطوة 3 وأكّد اشتراكك.</li>
        </ol>
      </div>

      {/* Step 3 — upload proof + confirm */}
      <div className="neo-card rounded-xl border-2 border-black bg-surface-container-lowest p-6 md:p-8">
        <h2 className="mb-6 flex items-center gap-2 font-headline-md text-headline-md font-bold">
          <span className="flex h-8 w-8 items-center justify-center border-2 border-black bg-primary-container font-bold text-black">
            3
          </span>
          ارفع الإثبات وأكّد اشتراكك
        </h2>

        <p className="mb-4 font-body-md text-on-surface-variant">
          ارفع صورة إثبات التحويل، واضغط تأكيد. هنسجّل طلبك ونفعّل اشتراكك خلال 24
          ساعة، وهيتبعتلك رابط الدخول على واتساب.
        </p>

        <label
          htmlFor="screenshot"
          className="mb-2 block font-label-md text-label-md font-bold uppercase text-on-surface"
        >
          صورة إثبات التحويل
        </label>
        <input
          id="screenshot"
          type="file"
          accept="image/*"
          onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
          className="mb-2 block w-full border-2 border-black bg-surface px-4 py-3 font-body-md text-body-md text-on-surface file:mr-3 file:border-2 file:border-black file:bg-primary-container file:px-3 file:py-1 file:font-bold file:text-black"
        />
        {screenshot && (
          <p className="mb-4 font-label-md text-label-md text-on-surface-variant">
            تم اختيار: {screenshot.name}
          </p>
        )}

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!readyToConfirm || submit === "submitting"}
          className={`neo-button mt-2 flex w-full items-center justify-center gap-3 border-2 border-black px-8 py-5 font-headline-md text-headline-md ${
            readyToConfirm && submit !== "submitting"
              ? "bg-[#25D366] text-black"
              : "pointer-events-none cursor-not-allowed bg-surface-dim text-on-surface-variant opacity-70 shadow-none"
          }`}
        >
          <span className="material-symbols-outlined text-3xl">chat</span>
          <span>
            {submit === "submitting"
              ? "جاري الإرسال..."
              : "أكّد الاشتراك على واتساب"}
          </span>
        </button>

        {!readyToConfirm && (
          <p className="mt-3 text-center font-label-md text-label-md text-error">
            اكتب بياناتك في الخطوة 1 وارفع صورة الإثبات علشان زرار التأكيد يشتغل.
          </p>
        )}
        {submit === "sent" && (
          <p className="mt-3 text-center font-label-md text-label-md text-primary">
            استلمنا طلبك ✅ كمّل التأكيد على واتساب.
          </p>
        )}
        {submit === "error" && (
          <p className="mt-3 text-center font-label-md text-label-md text-error">
            حصلت مشكلة في الإرسال، بس فتحنالك واتساب — ابعتلنا الصورة هناك.
          </p>
        )}
      </div>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
};

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-label-md text-label-md font-bold uppercase text-on-surface"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border-2 bg-surface px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-0 ${
          error ? "border-error" : "border-black focus:border-primary"
        }`}
      />
      {error && (
        <p className="mt-1 font-label-md text-label-md text-error">{error}</p>
      )}
    </div>
  );
}
