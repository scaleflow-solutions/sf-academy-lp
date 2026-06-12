import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import CheckoutForm from "@/components/CheckoutForm";
import { COURSE } from "@/lib/config";

export const metadata: Metadata = {
  title: "خلّص اشتراكك | أكاديمية سكيل فلو",
  description: "ادفع عبر إنستاباي وأكّد اشتراكك في أكاديمية سكيل فلو.",
};

const summary = [
  { label: "الكورس كامل — 8 موديولز و34 درس", value: "15,000" },
  { label: "كوميونيتي سكيل فلو — دعم يومي", value: "5,000" },
  { label: "مختبر الأتمتة — تحديثات كل أسبوع", value: "8,000" },
  { label: "templates جاهزة تركّبها وتشتغل", value: "4,000" },
];

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b-2 border-on-surface bg-surface">
        <div className="mx-auto flex max-w-container-max items-center justify-between px-margin-mobile py-4 md:px-margin-desktop">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-label-md text-label-md font-bold text-on-surface-variant transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
            ارجع للرئيسية
          </Link>
        </div>
      </header>

      <section className="px-margin-mobile py-12 md:px-margin-desktop md:py-16">
        <div className="mx-auto grid max-w-container-max items-start gap-12 lg:grid-cols-[1fr_minmax(0,1.6fr)]">
          {/* Order summary */}
          <aside className="neo-card rounded-2xl border-4 border-black bg-surface p-6 md:p-8 lg:sticky lg:top-24">
            <h2 className="mb-6 font-headline-md text-headline-md font-bold">
              ملخص الطلب
            </h2>
            <ul className="mb-6 space-y-3 font-body-md text-body-md text-on-surface-variant">
              {summary.map((item) => (
                <li
                  key={item.label}
                  className="flex items-start justify-between gap-3 border-b-2 border-outline-variant pb-3"
                >
                  <span className="flex items-start gap-2">
                    <span className="material-symbols-outlined mt-0.5 text-primary">
                      check
                    </span>
                    {item.label}
                  </span>
                  <span className="shrink-0 font-bold text-on-surface line-through opacity-60">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mb-2 flex items-center justify-between font-body-md text-on-surface-variant">
              <span>القيمة الإجمالية</span>
              <span className="font-bold line-through">
                {COURSE.originalPriceEGP} {COURSE.currency}
              </span>
            </div>
            <div className="flex items-center justify-between border-2 border-black bg-primary-container p-4 text-black">
              <span className="font-headline-md font-bold">
                الإجمالي النهارده
              </span>
              <span className="font-display-lg text-2xl font-bold">
                {COURSE.priceEGP} {COURSE.currency}
              </span>
            </div>
            <p className="mt-4 font-label-md text-label-md text-on-surface-variant">
              دفع آمن عبر إنستاباي | تقدر تطلب استرجاع فلوسك خلال 24 ساعة من الدفع
            </p>
          </aside>

          {/* Checkout steps */}
          <div>
            <h1 className="mb-2 font-display-lg text-display-lg-mobile md:text-display-lg">
              خلّص اشتراكك
            </h1>
            <p className="mb-10 font-body-lg text-body-lg text-on-surface-variant">
              إنت على بعد خطوة واحدة بس علشان تنضم للنخبة. اكتب بياناتك، ادفع
              عبر إنستاباي، وبعدين أكّد اشتراكك على واتساب.
            </p>
            <CheckoutForm />
          </div>
        </div>
      </section>
    </main>
  );
}
