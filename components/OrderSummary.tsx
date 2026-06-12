import { COURSE } from "@/lib/config";

const summary = [
  { label: "الكورس كامل — 8 موديولز و34 درس", value: "15,000" },
  { label: "كوميونيتي سكيل فلو — دعم يومي", value: "5,000" },
  { label: "مختبر الأتمتة — تحديثات كل أسبوع", value: "8,000" },
  { label: "templates جاهزة تركّبها وتشتغل", value: "4,000" },
];

// Presentational order summary reused by the InstaPay + card checkout pages.
export default function OrderSummary() {
  return (
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
        <span className="font-headline-md font-bold">الإجمالي النهارده</span>
        <span className="font-display-lg text-2xl font-bold">
          {COURSE.priceEGP} {COURSE.currency}
        </span>
      </div>
      <p className="mt-4 font-label-md text-label-md text-on-surface-variant">
        دفع آمن · تقدر تطلب استرجاع فلوسك خلال 24 ساعة من الدفع
      </p>
    </aside>
  );
}
