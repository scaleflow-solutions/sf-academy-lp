"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { COURSE, PAYMENT } from "@/lib/config";

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

type SubmitState = "idle" | "submitting" | "error";

// Local InstaPay flow: transfer → upload receipt OR enter Transaction ID →
// submit (server attaches the Clerk identity) → redirect to the status page.
// No WhatsApp handoff; confirmation lives on /order/[id].
export default function InstapayFlow() {
  const router = useRouter();
  const { user } = useUser();

  const [leadId, setLeadId] = useState("");
  useEffect(() => setLeadId(makeLeadId()), []);

  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [txnId, setTxnId] = useState("");
  const [copied, setCopied] = useState(false);
  const [submit, setSubmit] = useState<SubmitState>("idle");

  // At least one proof: a receipt screenshot OR a transaction id.
  const hasProof = !!screenshot || txnId.trim().length >= 4;
  const readyToConfirm = hasProof && !!leadId;

  async function copyHandle() {
    try {
      await navigator.clipboard.writeText(PAYMENT.instapayHandle);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function handleConfirm() {
    if (!readyToConfirm || submit === "submitting") return;
    setSubmit("submitting");
    const body = new FormData();
    body.append("lead_id", leadId);
    body.append("payment_method", "instapay");
    body.append("transaction_id", txnId.trim());
    if (screenshot) body.append("screenshot", screenshot, screenshot.name);

    try {
      const res = await fetch("/api/checkout", { method: "POST", body });
      if (res.ok) {
        router.push(`/order/${leadId}`);
        return;
      }
      setSubmit("error");
    } catch {
      setSubmit("error");
    }
  }

  return (
    <div className="space-y-8">
      {/* Identity (from sign-in) */}
      {user && (
        <div className="neo-card flex items-center gap-3 rounded-xl border-2 border-black bg-surface-container-lowest p-4">
          <span className="material-symbols-outlined text-primary">
            account_circle
          </span>
          <div className="min-w-0">
            <p className="truncate font-body-md font-bold text-on-surface">
              {user.fullName || user.username}
            </p>
            <p className="truncate font-label-md text-label-md text-on-surface-variant">
              {user.primaryEmailAddress?.emailAddress ?? "حساب تليجرام"}
            </p>
          </div>
        </div>
      )}

      {/* Step 1 — transfer */}
      <div className="neo-card rounded-xl border-2 border-black bg-surface-container-lowest p-6 md:p-8">
        <h2 className="mb-6 flex items-center gap-2 font-headline-md text-headline-md font-bold">
          <Badge>1</Badge>
          حوّل المبلغ على إنستاباي
        </h2>

        <div className="mb-6 flex items-center justify-between border-2 border-black bg-primary-container p-4 text-black">
          <span className="font-body-md font-bold">المبلغ المطلوب</span>
          <span className="font-display-lg text-2xl font-bold">
            {COURSE.priceEGP} {COURSE.currency}
          </span>
        </div>

        <p className="mb-2 font-label-md text-label-md uppercase text-on-surface-variant">
          حوّل على معرّف إنستاباي ده
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
      </div>

      {/* Step 2 — proof */}
      <div className="neo-card rounded-xl border-2 border-black bg-surface-container-lowest p-6 md:p-8">
        <h2 className="mb-6 flex items-center gap-2 font-headline-md text-headline-md font-bold">
          <Badge>2</Badge>
          ارفع الإثبات وأكّد
        </h2>
        <p className="mb-4 font-body-md text-on-surface-variant">
          اختار طريقة واحدة على الأقل — صورة إيصال التحويل أو رقم العملية. لو
          عندك الاتنين أفضل، بس مش لازم.
        </p>

        <label
          htmlFor="screenshot"
          className="mb-2 block font-label-md text-label-md font-bold uppercase text-on-surface"
        >
          صورة إيصال التحويل
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

        <div className="my-4 flex items-center gap-3 text-on-surface-variant">
          <span className="h-px flex-1 bg-outline-variant" />
          <span className="font-label-md text-label-md">أو</span>
          <span className="h-px flex-1 bg-outline-variant" />
        </div>

        <label
          htmlFor="txn"
          className="mb-2 block font-label-md text-label-md font-bold uppercase text-on-surface"
        >
          رقم العملية (Transaction ID)
        </label>
        <input
          id="txn"
          type="text"
          value={txnId}
          onChange={(e) => setTxnId(e.target.value)}
          placeholder="مثلاً: TXN20260612123456"
          className="mb-2 w-full border-2 border-black bg-surface px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary focus:outline-none"
        />

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!readyToConfirm || submit === "submitting"}
          className={`neo-button mt-6 flex w-full items-center justify-center gap-3 border-2 border-black px-8 py-5 font-headline-md text-headline-md ${
            readyToConfirm && submit !== "submitting"
              ? "bg-primary text-on-primary"
              : "pointer-events-none cursor-not-allowed bg-surface-dim text-on-surface-variant opacity-70 shadow-none"
          }`}
        >
          <span className="material-symbols-outlined text-3xl">task_alt</span>
          <span>
            {submit === "submitting" ? "جاري الإرسال..." : "أكّد الطلب"}
          </span>
        </button>

        {!readyToConfirm && (
          <p className="mt-3 text-center font-label-md text-label-md text-on-surface-variant">
            ارفع صورة الإيصال أو اكتب رقم العملية علشان زرار التأكيد يشتغل.
          </p>
        )}
        {submit === "error" && (
          <p className="mt-3 text-center font-label-md text-label-md text-error">
            حصلت مشكلة في الإرسال — جرّب تاني بعد لحظات.
          </p>
        )}
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center border-2 border-black bg-primary-container font-bold text-black">
      {children}
    </span>
  );
}
