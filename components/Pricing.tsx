import Link from "next/link";
import { COURSE } from "@/lib/config";

const savings = COURSE.originalPriceEGP - COURSE.priceEGP;

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-y-4 border-primary-container bg-black px-margin-mobile py-24 text-white md:px-margin-desktop"
    >
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary opacity-50 mix-blend-screen blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-container-max text-center">
        <div className="mb-8 inline-block rotate-2 rounded-full border-2 border-black bg-primary-container px-6 py-2 font-headline-md font-bold text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
          سعر الإطلاق المبكر · أول 150 مشترك بس
        </div>

        <h2 className="mb-6 font-display-lg text-4xl font-bold md:text-6xl">
          ده أحسن استثمار هتعمله في نفسك
        </h2>

        <div className="neo-card relative mx-auto mb-12 mt-12 max-w-2xl rounded-3xl border-4 border-primary-container bg-surface p-10 text-on-surface">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-black bg-error px-6 py-2 font-bold text-white">
            وفّر {savings.toLocaleString("en-US")} {COURSE.currency}
          </div>

          <div className="mb-8 flex items-end justify-center gap-4 pt-4">
            <span className="text-3xl text-outline line-through">
              {COURSE.originalPriceEGP} {COURSE.currency}
            </span>
            <span className="font-display-lg text-6xl font-bold text-primary">
              {COURSE.priceEGP} {COURSE.currency}
            </span>
          </div>

          <div className="mb-8 flex justify-center gap-6">
            <div className="flex min-w-[100px] flex-col justify-center rounded-xl border-2 border-black bg-surface-variant p-4 text-center">
              {/* TODO: عداد ثابت مؤقتاً — هيتحول لعداد تنازلي حقيقي بعد تسجيل الكورس. */}
              <span className="block font-display-lg text-2xl font-bold">30</span>
              <span className="text-sm font-bold">يوم فاضل</span>
            </div>
            <div className="flex min-w-[100px] flex-col justify-center rounded-xl border-2 border-black bg-surface-variant p-4 text-center">
              <span className="text-sm font-bold">أول</span>
              <span className="block font-display-lg text-2xl font-bold text-primary">
                150
              </span>
              <span className="text-sm font-bold">مشترك</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="neo-button flex w-full items-center justify-center gap-3 rounded-xl border-4 border-black bg-primary-container px-8 py-6 font-display-lg text-3xl text-black"
          >
            <span>احجز مكانك في الإطلاق المبكر</span>
            <span className="material-symbols-outlined text-4xl">
              rocket_launch
            </span>
          </Link>

          <p className="mt-4 font-label-md text-label-md text-on-surface-variant">
            دفع آمن 100% · لو مش عاجبك محتوى الكورس تقدر تطلب استرجاع فلوسك خلال 24 ساعة من الدفع
          </p>
        </div>
      </div>
    </section>
  );
}
