import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import AuthGate from "@/components/AuthGate";
import MethodPicker from "@/components/MethodPicker";

export const metadata: Metadata = {
  title: "اختار طريقة الدفع | أكاديمية سكيل فلو",
  description: "سجّل دخولك واختار طريقة الدفع المناسبة ليك.",
};

// Signed-out → auth gate (Google / Telegram). Signed-in → payment-method picker.
export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ tg_error?: string }>;
}) {
  const { userId } = await auth();
  const { tg_error } = await searchParams;

  return (
    <section className="px-margin-mobile py-12 md:px-margin-desktop md:py-16">
      <div className="mx-auto max-w-container-max">
        {userId ? <MethodPicker /> : <AuthGate tgError={tg_error} />}
      </div>
    </section>
  );
}
