export default function Hero() {
  return (
    <section className="px-margin-mobile md:px-margin-desktop">
      <div className="mx-auto grid max-w-container-max items-center gap-12 pb-24 pt-16 md:grid-cols-2">
        <div>
          <h1 className="mb-6 font-display-lg text-display-lg-mobile leading-[1.45] md:text-display-lg">
            الـ AI مش هياخد شغلك. اللي عارف يستخدمه هو اللي هياخده.
          </h1>
          <p className="mb-10 font-body-lg text-body-lg text-on-surface-variant">
            سكيل فلو بتعلّمك الـ AI automation بـ Claude و Claude Code من الصفر
            — من غير ولا سطر كود — لحد ما تقفل أول client وتبني الـ agency
            بتاعتك.
          </p>
          <a
            href="#pricing"
            className="neo-button inline-flex w-full items-center justify-center gap-2 border-2 border-black bg-primary-container px-8 py-4 font-headline-md text-headline-md text-black md:w-auto"
          >
            <span>احجز مكانك في الإطلاق المبكر</span>
            <span className="material-symbols-outlined">arrow_back</span>
          </a>
        </div>

        {/* VSL placeholder — استبدله بمشغّل فيديو حقيقي لما يبقى جاهز. */}
        <div className="neo-card relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border-4 border-black bg-black">
          <div className="absolute inset-0 bg-primary-container opacity-20" />
          <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-black bg-primary text-on-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-[40px]">
              play_arrow
            </span>
          </span>
          <p className="absolute inset-x-0 bottom-4 text-center font-label-md font-bold text-white">
            اتفرّج على الفيديو ده الأول (5:32)
          </p>
        </div>
      </div>
    </section>
  );
}
