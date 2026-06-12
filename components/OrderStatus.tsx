"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PAYMENT } from "@/lib/config";

type Stage = "received" | "review" | "activated";
type StatusResponse = {
  orderId: string;
  createdAt: string;
  paymentMethod: string;
  stage: Stage;
};

type StepState = "done" | "active" | "pending";

export default function OrderStatus({ id }: { id: string }) {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/order/${id}`, { cache: "no-store" });
      if (res.status === 202) {
        // Row not written yet — keep the "received" optimistic view, keep polling.
        setLoading(false);
        return;
      }
      if (res.status === 403 || res.status === 404) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      if (res.ok) {
        const json = (await res.json()) as StatusResponse;
        setData(json);
        if (json.stage === "activated" && timer.current) {
          clearInterval(timer.current);
          timer.current = null;
        }
      }
    } catch {
      // transient — next poll retries
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
    timer.current = setInterval(load, 25000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [load]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <p className="mb-6 font-body-lg text-body-lg text-on-surface-variant">
          مش لاقيين الطلب ده، أو إنه مش تبع حسابك.
        </p>
        <Link
          href="/checkout"
          className="neo-button inline-flex border-2 border-black bg-primary-container px-6 py-3 font-label-md text-label-md font-bold text-black"
        >
          ابدأ من جديد
        </Link>
      </div>
    );
  }

  const stage: Stage = data?.stage ?? "received";
  const activated = stage === "activated";
  const isCard = data?.paymentMethod === "card";

  const steps: { title: string; sub: string; state: StepState }[] = [
    {
      title: isCard ? "استلام الدفع" : "استلام الإيصال",
      sub: "تمّ الاستلام بنجاح.",
      state: "done",
    },
    {
      title: isCard ? "تأكيد العملية" : "مراجعة فريق سكيل فلو",
      sub: isCard
        ? "بنتأكد من العملية مع Whop."
        : "نتأكد من وصول المبلغ لحسابنا في إنستاباي.",
      state: activated ? "done" : "active",
    },
    {
      title: "تفعيل الوصول",
      sub: "يوصلك تأكيد وتقدر تبدأ الكورس فورًا.",
      state: activated ? "done" : "pending",
    },
  ];

  const shortId = `#SF-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
  const waLink = `https://wa.me/${PAYMENT.whatsappNumber}`;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-black ${
            activated ? "bg-primary-container" : "bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-4xl text-primary">
            {activated ? "check_circle" : "schedule"}
          </span>
        </div>
        <h1 className="mb-3 font-display-lg text-display-lg-mobile md:text-display-lg">
          {activated ? "تم تفعيل اشتراكك 🎉" : "استلمنا طلبك — قيد المراجعة"}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {activated
            ? "مبروك! دخل الكورس والكوميونيتي، وهيوصلك تأكيد على وسيلة التواصل بتاعتك."
            : "إيصال الدفع وصل لفريقنا. هنراجعه ونفعّل حسابك عادةً خلال ساعات قليلة — أقصى مدة 24 ساعة. هتوصلك رسالة فور الاعتماد."}
        </p>
      </div>

      {/* Chips */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-outline-variant bg-surface px-4 py-2 font-label-md text-label-md font-bold">
          <span className="material-symbols-outlined text-base text-primary">
            tag
          </span>
          رقم الطلب {shortId}
        </span>
        {data?.createdAt && (
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-outline-variant bg-surface px-4 py-2 font-label-md text-label-md font-bold">
            <span className="material-symbols-outlined text-base text-primary">
              schedule
            </span>
            {data.createdAt}
          </span>
        )}
      </div>

      {/* Tracker */}
      <div className="neo-card rounded-2xl border-2 border-black bg-surface-container-lowest p-6 md:p-8">
        <h2 className="mb-6 text-right font-headline-md text-headline-md font-bold">
          الخطوات
        </h2>
        <ol className="space-y-6">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-4">
              <StepDot state={step.state} />
              <div className={step.state === "pending" ? "opacity-60" : ""}>
                <p className="font-body-md font-bold text-on-surface">
                  {step.title}
                </p>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  {step.sub}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="neo-button inline-flex items-center justify-center gap-2 border-2 border-black bg-surface px-6 py-3 font-label-md text-label-md font-bold"
        >
          <span className="material-symbols-outlined text-base">chat</span>
          تواصل معنا
        </a>
        <Link
          href="/"
          className="neo-button inline-flex items-center justify-center gap-2 border-2 border-black bg-primary-container px-6 py-3 font-label-md text-label-md font-bold text-black"
        >
          العودة للصفحة الرئيسية
        </Link>
      </div>

      {loading && !data && (
        <p className="mt-6 text-center font-label-md text-label-md text-on-surface-variant">
          جاري تحميل حالة الطلب...
        </p>
      )}
    </div>
  );
}

function StepDot({ state }: { state: StepState }) {
  if (state === "done") {
    return (
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-black bg-primary-container">
        <span className="material-symbols-outlined text-base text-black">
          check
        </span>
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-surface">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
      </span>
    );
  }
  return (
    <span className="mt-0.5 h-7 w-7 shrink-0 rounded-full border-2 border-outline-variant bg-surface" />
  );
}
