"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

// Completes the Telegram bridge: the API route minted a Clerk sign-in token
// ("ticket") and redirected here. We exchange it for a live session via the
// stable clerk.client API.
function TgCallbackInner() {
  const clerk = useClerk();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const ticket = params.get("ticket");
    if (!clerk.client) return;
    if (!ticket) {
      router.replace("/checkout?tg_error=missing");
      return;
    }
    (async () => {
      try {
        const res = await clerk.client.signIn.create({
          strategy: "ticket",
          ticket,
        });
        if (res.status === "complete" && res.createdSessionId) {
          await clerk.setActive({ session: res.createdSessionId });
          router.replace("/checkout");
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    })();
  }, [clerk, params, router]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-margin-mobile py-24 text-center">
      {error ? (
        <>
          <p className="font-body-lg text-body-lg text-error">
            تعذّر إكمال الدخول عبر تليجرام.
          </p>
          <a
            href="/checkout"
            className="neo-button border-2 border-black bg-primary-container px-6 py-3 font-label-md text-label-md font-bold text-black"
          >
            ارجع وجرّب تاني
          </a>
        </>
      ) : (
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          جاري إتمام الدخول عبر تليجرام...
        </p>
      )}
    </div>
  );
}

export default function TgCallbackPage() {
  return (
    <Suspense fallback={null}>
      <TgCallbackInner />
    </Suspense>
  );
}
