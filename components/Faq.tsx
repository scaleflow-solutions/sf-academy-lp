type QA = { q: string; a: string };

const faqs: QA[] = [
  {
    q: "محتاج خبرة برمجة عشان أبدأ؟",
    a: "لأ خالص. الكورس مبني إنك تبدأ من الصفر — Claude Code هو اللي بيكتب الكود، وانت بس بتقوده وبتقوله عايز إيه بلغة عادية.",
  },
  {
    q: "أنا لسه بادئ ومفيش معايا clients — الكورس ده ليّا؟",
    a: "أيوة، ده بالظبط اللي الكورس اتعمل عشانه. فيه موديول كامل عن إزاي تجيب أول clients بطريقة سكيل فلو: الـ outreach، العروض اللي بتقفل، والـ positioning الصح.",
  },
  {
    q: "الكورس فيديوهات مسجلة ولا لايف؟",
    a: "فيديوهات مسجلة بتتفرج عليها في أي وقت يناسبك، وبتفضل معاك للأبد. مفيش مواعيد ثابتة تلتزم بيها.",
  },
  {
    q: "لو اشتركت ولقيته مش ليّا؟",
    a: "معاك 24 ساعة من وقت ما تشترك. لو حسيت إن الكورس مش ليك لأي سبب، ابعتلنا رسالة على واتساب وفلوسك بترجعلك كاملة — من غير أسئلة ولا تعقيد.",
  },
  {
    q: "الدفع بيتم إزاي؟",
    a: "التحويل عن طريق إنستاباي. تحوّل قيمة الاشتراك، وبعدها تبعتلنا تأكيد على واتساب ونفعّلك الـ access على طول.",
  },
  {
    q: "إيه اللي بيحصل بعد ما الإطلاق المبكر يخلص؟",
    a: "دلوقتي متاح موديول 1 لـ 4 في الإطلاق المبكر. باقي الموديولز بتنزل مع الـ full launch، وانت معاك access دايم — هتاخدها كلها من غير ما تدفع تاني.",
  },
];

export default function Faq() {
  return (
    <section
      id="faq"
      className="bg-background px-margin-mobile py-24 md:px-margin-desktop"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-12 text-center font-display-lg text-display-lg-mobile font-bold md:text-headline-lg">
          أسئلة بتتسأل كتير
        </h2>

        <div className="space-y-4">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group neo-card rounded-xl border-2 border-black bg-surface"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 font-headline-md font-bold text-on-surface [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <span className="material-symbols-outlined shrink-0 text-primary transition-transform duration-200 group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="border-t-2 border-black p-6 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
