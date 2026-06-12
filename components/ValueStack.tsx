import { COURSE } from "@/lib/config";

type ValueItem = {
  icon: string;
  label: string;
  value?: string;
  priceless?: boolean;
};

const items: ValueItem[] = [
  { icon: "play_lesson", label: "الكورس كامل — 8 موديولز و34 درس", value: "15,000" },
  { icon: "groups", label: "ميتنجات لايف جماعية مع زياد كل أسبوعين", value: "35,000" },
  { icon: "forum", label: "كوميونيتي سكيل فلو — دعم يومي", value: "5,000" },
  { icon: "science", label: "مختبر الأتمتة — تحديثات كل أسبوع", value: "8,000" },
  {
    icon: "content_copy",
    label: "ملفات instructions و Claude Code setups جاهزة تركّبها وتشتغل",
    value: "4,000",
  },
  {
    icon: "all_inclusive",
    label: "access مدى الحياة للتحديثات وخبرات الكوميونيتي المشتركة",
    priceless: true,
  },
];

export default function ValueStack() {
  return (
    <section className="bg-background px-margin-mobile py-24 md:px-margin-desktop">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-12 text-center font-display-lg text-display-lg-mobile font-bold md:text-headline-lg">
          بتاخد إيه لما تشترك
        </h2>
        <div className="neo-card rounded-2xl border-4 border-black bg-surface p-8">
          <ul className="mb-8 space-y-6 font-body-lg">
            {items.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between gap-4 border-b-2 border-outline-variant pb-4"
              >
                <span className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    {item.icon}
                  </span>
                  {item.label}
                </span>
                <span className="shrink-0 font-bold">
                  {item.priceless
                    ? "مالهاش تمن"
                    : `بقيمة ${item.value} ${COURSE.currency}`}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between rounded-xl border-2 border-black bg-primary-container p-6 text-black">
            <span className="font-headline-md font-bold">
              لو جبتهم لوحدهم
            </span>
            <span className="font-display-lg text-2xl font-bold line-through opacity-70 md:text-display-lg">
              67,000 {COURSE.currency}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
