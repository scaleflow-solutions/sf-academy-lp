import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import OrderStatus from "@/components/OrderStatus";

export const metadata: Metadata = {
  title: "حالة طلبك | أكاديمية سكيل فلو",
  robots: { index: false, follow: false },
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/checkout");

  const { id } = await params;

  return (
    <section className="px-margin-mobile py-12 md:px-margin-desktop md:py-16">
      <div className="mx-auto max-w-container-max">
        <OrderStatus id={id} />
      </div>
    </section>
  );
}
