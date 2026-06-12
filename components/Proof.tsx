import ProofCarousel from "./ProofCarousel";

export default function Proof() {
  return (
    <section
      id="proof"
      className="border-y-2 border-on-surface bg-surface px-margin-mobile py-24 md:px-margin-desktop"
    >
      <div className="mx-auto max-w-container-max text-center">
        <h2 className="mb-12 font-display-lg text-display-lg-mobile font-bold md:text-headline-lg">
          مش كلام — دي ناس بدأت زيك
        </h2>

        {/* Featured testimonial — founder */}
        <div className="neo-card mx-auto mb-12 max-w-3xl -rotate-1 rounded-2xl border-4 border-black bg-primary-container p-8 text-right">
          <div className="mb-6 flex items-center gap-4 border-b-2 border-black pb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-xl font-bold text-white">
              ز
            </div>
            <div>
              <h3 className="font-headline-md font-bold text-black">زياد</h3>
              <p className="font-body-md text-black opacity-80">
                مؤسس سكيل فلو
              </p>
            </div>
          </div>
          <h4 className="mb-4 font-display-lg text-3xl font-bold text-black">
            &quot;+500 ألف جنيه وأنا عايش مرتاح&quot;
          </h4>
          <p className="mb-6 font-body-lg leading-relaxed text-black">
            &quot;بالتكتيكات اللي بشاركها هنا في الكورس والكوميونيتي، قدرت أوصّل
            الـ agency بتاعتي لأكتر من 500 ألف جنيه revenue — وأنا عايش حياتي
            مرتاح من غير ضغط. هنا هشاركك كل حاجة بصدق: الغلطات اللي وقعت فيها،
            والـ playbooks اللي بنيتها وجربتها بنفسي مع الوقت، وكمان bonuses
            كتير زي ملفات skills معمولة مخصوص تركّبها وتشتغل على طول.&quot;
          </p>
          <div className="flex items-center gap-2 font-bold text-black">
            <span className="material-symbols-outlined">verified</span>
            نتيجة حقيقية
          </div>
        </div>

        {/* Real proof — testimonials, video & transfers in a stagger carousel */}
        <ProofCarousel />
      </div>
    </section>
  );
}
