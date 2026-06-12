"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COURSE, type PaymentMethod } from "@/lib/config";

// Mirrors the reference: InstaPay (محلي, manual-verify) vs Card/Apple Pay
// (instant via Whop). Select one → continue to that flow.
export default function MethodPicker() {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [busy, setBusy] = useState(false);

  function go() {
    setBusy(true);
    router.push(method === "card" ? "/checkout/card" : "/checkout/instapay");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-center font-display-lg text-display-lg-mobile md:text-display-lg">
        اختار طريقة الدفع
      </h1>
      <p className="mb-10 text-center font-body-lg text-body-lg text-on-surface-variant">
        خطوة واحدة وتبقى معانا. اختار اللي يناسبك:
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card / Apple Pay — instant (Whop) */}
        <MethodCard
          selected={method === "card"}
          onSelect={() => setMethod("card")}
          badge="موصى بها"
          badgeClass="bg-primary-container text-black"
          title="بطاقة أو Apple Pay"
          subtitle="الطريقة الأسرع · تأكيد فوري ووصول للكورس في الحال"
          footer={
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-label-md text-label-md text-on-surface-variant">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-primary">
                  bolt
                </span>
                تأكيد فوري
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-primary">
                  lock
                </span>
                3D Secure
              </span>
            </div>
          }
        />

        {/* InstaPay — local, manual verification */}
        <MethodCard
          selected={method === "instapay"}
          onSelect={() => setMethod("instapay")}
          badge="محلي 🇪🇬"
          badgeClass="bg-surface-container-high text-on-surface-variant"
          title="إنستاباي"
          subtitle="للدفع من داخل مصر بالجنيه — تحويل وترفع لقطة التأكيد"
          footer={
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-label-md text-label-md text-on-surface-variant">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-primary">
                  credit_card_off
                </span>
                بدون بطاقة
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-primary">
                  schedule
                </span>
                التفعيل خلال ساعات
              </span>
            </div>
          }
        />
      </div>

      <button
        type="button"
        onClick={go}
        disabled={busy}
        className="neo-button mt-8 flex w-full items-center justify-center gap-3 border-2 border-black bg-primary px-8 py-5 font-headline-md text-headline-md text-on-primary disabled:opacity-60"
      >
        <span>{busy ? "جاري التحويل..." : "متابعة إلى الدفع"}</span>
        <span className="material-symbols-outlined text-2xl">arrow_back</span>
      </button>

      <p className="mt-4 text-center font-label-md text-label-md text-on-surface-variant">
        القيمة: {COURSE.priceEGP} {COURSE.currency} · تقدر تطلب استرجاع فلوسك خلال
        24 ساعة من الدفع
      </p>
    </div>
  );
}

function MethodCard({
  selected,
  onSelect,
  badge,
  badgeClass,
  title,
  subtitle,
  footer,
}: {
  selected: boolean;
  onSelect: () => void;
  badge: string;
  badgeClass: string;
  title: string;
  subtitle: string;
  footer: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`neo-card flex flex-col gap-4 rounded-xl border-2 bg-surface-container-lowest p-6 text-right transition-colors ${
        selected ? "border-primary ring-2 ring-primary" : "border-black"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
            selected ? "border-primary bg-primary" : "border-outline bg-surface"
          }`}
        >
          {selected && (
            <span className="material-symbols-outlined text-base text-on-primary">
              check
            </span>
          )}
        </span>
        <span
          className={`rounded px-2 py-1 font-label-md text-label-sm font-bold ${badgeClass}`}
        >
          {badge}
        </span>
      </div>
      <div>
        <h3 className="mb-1 font-headline-md text-headline-md font-bold text-on-surface">
          {title}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {subtitle}
        </p>
      </div>
      {footer}
    </button>
  );
}
