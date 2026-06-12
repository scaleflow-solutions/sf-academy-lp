import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import InstapayFlow from "@/components/InstapayFlow";
import OrderSummary from "@/components/OrderSummary";

export const metadata: Metadata = {
  title: "الدفع عبر إنستاباي | أكاديمية سكيل فلو",
};

export default async function InstapayPage() {
  const { userId } = await auth();
  if (!userId) redirect("/checkout");

  return (
    <section className="px-margin-mobile py-12 md:px-margin-desktop md:py-16">
      <div className="mx-auto grid max-w-container-max items-start gap-12 lg:grid-cols-[1fr_minmax(0,1.6fr)]">
        <OrderSummary />
        <div>
          <h1 className="mb-2 font-display-lg text-display-lg-mobile md:text-display-lg">
            الدفع عبر إنستاباي
          </h1>
          <p className="mb-10 font-body-lg text-body-lg text-on-surface-variant">
            حوّل المبلغ، ارفع الإثبات، وهنراجع ونفعّل اشتراكك خلال ساعات — هتلاقي
            حالة طلبك بتتحدّث لحظة بلحظة بعد ما تأكّد.
          </p>
          <InstapayFlow />
        </div>
      </div>
    </section>
  );
}
