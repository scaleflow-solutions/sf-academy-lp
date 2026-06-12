import Image from "next/image";

type Module = {
  n: number;
  title: string;
  body: string;
  logo?: string;
};

const CLAUDE_LOGO = "/logos/claude.svg";

const betaModules: Module[] = [
  {
    n: 1,
    title: "عقلية الـ AI Automation",
    body: "قبل ما تلمس أي tool: هتفهم الأتمتة بتشتغل إزاي وتبدأ تفكّر بطريقة الأنظمة مش المهام.",
  },
  {
    n: 2,
    title: "Claude Code من الصفر للاحتراف",
    body: "الأداة اللي بتفرّق بجد. هتظبط Claude Code من الصفر، تتعلم الـ prompting اللي بيجيب نتيجة، وتبني أول automation حقيقي — من غير أي خبرة كود.",
    logo: CLAUDE_LOGO,
  },
  {
    n: 3,
    title: "صيد الفرص الربحية",
    body: "أصعب جزء مش إنك تبني — الأصعب إنك تعرف تبني إيه. هتتعلم تلقّط المشاكل اللي الشركات مستعدة تدفع فلوس عشان تتحل، وتركّز شغلك على الحلول اللي ليها سوق فعلاً.",
  },
  {
    n: 4,
    title: "تبني AI Agents",
    body: "بعد الـ prompts بمراحل. هتبني agents بتشتغل لوحدها على مدار اليوم وتنفّذ شغل حقيقي.",
    logo: CLAUDE_LOGO,
  },
];

const fullModules: Module[] = [
  {
    n: 5,
    title: "الأتمتة كخدمة بتتباع",
    body: "تحوّل الـ skill لفلوس: تحدد تأتمت إيه، تعمل package للخدمة، تسعّرها وتسلّمها.",
  },
  {
    n: 6,
    title: "n8n كراش كورس",
    body: "كراش كورس مركّز: تستخدم n8n إمتى جنب Claude Code وإزاي توصّلهم ببعض.",
  },
  {
    n: 7,
    title: "تجيب clients — طريقة سكيل فلو",
    body: "الـ playbook اللي زياد بنى بيه سكيل فلو: outreach، عروض بتقفل، و positioning صح.",
  },
  {
    n: 8,
    title: "تعمل scale للـ agency",
    body: "تبني أنظمة تخلّي الـ agency تمشي من غيرك: توظيف، تفويض، ونمو من غير ما تتفنّس.",
  },
];

function ModuleCard({ mod, coming }: { mod: Module; coming?: boolean }) {
  return (
    <div className="neo-card rounded-xl border-2 border-black bg-surface p-6">
      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="rounded bg-primary-container px-2 py-1 text-sm font-bold text-black">
              موديول {mod.n}
            </span>
            {coming && (
              <span className="border-2 border-outline px-2 py-0.5 font-label-md text-label-sm font-bold uppercase text-on-surface-variant">
                قريب
              </span>
            )}
          </div>
          <div className={coming ? "select-none blur-[6px]" : ""}>
            <h3 className="mb-2 font-headline-md font-bold text-primary">
              {mod.title}
            </h3>
            <p className="font-body-md text-on-surface-variant">{mod.body}</p>
          </div>
        </div>

        {mod.logo && (
          <div className="flex aspect-square w-20 shrink-0 items-center justify-center self-center rounded-xl border-2 border-black bg-surface-container-lowest p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Image
              src={mod.logo}
              alt="Claude"
              width={48}
              height={48}
              className="h-12 w-12"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Curriculum() {
  return (
    <section
      id="curriculum"
      className="bg-background px-margin-mobile py-24 md:px-margin-desktop"
    >
      <div className="mx-auto max-w-container-max">
        <h2 className="mb-3 text-center font-display-lg text-display-lg-mobile font-bold md:text-headline-lg">
          هتتعلم إيه بالظبط
        </h2>
        <p className="mb-12 text-center font-body-lg text-body-lg text-on-surface-variant">
          8 موديولز · 34 درس — من أول ما تفتح Claude لحد ما تبني agency بتدر
          فلوس.
        </p>

        {/* Beta — available now */}
        <div className="mb-12">
          <h3 className="mb-6 inline-block border-2 border-black bg-primary px-4 py-2 font-label-md text-label-md font-bold uppercase text-on-primary">
            متاح دلوقتي في الإطلاق المبكر
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {betaModules.map((mod) => (
              <ModuleCard key={mod.n} mod={mod} />
            ))}
          </div>
        </div>

        {/* Full launch — coming soon */}
        <div>
          <h3 className="mb-6 inline-block border-2 border-black bg-surface-container-high px-4 py-2 font-label-md text-label-md font-bold uppercase text-on-surface-variant">
            قريب · مع الـ full launch
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {fullModules.map((mod) => (
              <ModuleCard key={mod.n} mod={mod} coming />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
