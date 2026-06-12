const oldWay = [
  "كل شغلانة بتبدأها من الصفر، والنتيجة بتطلع مختلفة كل مرة.",
  "بتلاحق أي حد عشان تجيب client، وبتضيّع وقتك مع ناس مش هتشتري.",
  "بتعيد نفس الشغل المتكرر بإيدك كل يوم.",
  "اللي بتقدّمه محدود بوقتك ومجهودك — وكل حاجة بتكلّفك.",
];

const newWay = [
  "بتشتغل بـ frameworks تخلّي مستوى الشغل ثابت كل مرة.",
  "بتجيب الـ clients اللي أقرب يقفلوا — على أساس الـ buying signals بتاعتهم.",
  "بتأتمت الـ workflows المتكررة اللي بتاكل وقتك كل يوم.",
  "بتقدّم قيمة ضخمة للعميل وانت مش دافع ولا جنيه.",
];

export default function ProblemSection() {
  return (
    <section className="border-y-2 border-on-surface bg-surface px-margin-mobile py-24 md:px-margin-desktop">
      <div className="mx-auto grid max-w-container-max items-center gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-6 font-display-lg text-display-lg-mobile font-bold md:text-headline-lg">
            بطّل تقايض وقتك بفلوس
          </h2>
          <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant">
            {oldWay.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="material-symbols-outlined mt-1 text-error">
                  close
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="neo-button rounded-lg border-2 border-black bg-surface p-8">
          <h3 className="mb-4 font-headline-md text-headline-md font-bold text-primary">
            الطريقة اللي سكيل فلو هتوريهالك
          </h3>
          <ul className="space-y-4 font-body-md text-body-md">
            {newWay.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="material-symbols-outlined mt-1 text-primary">
                  check
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
