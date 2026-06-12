"use client";

import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import TelegramLoginButton from "./TelegramLoginButton";

// First screen of the funnel: identify the buyer before payment. Google is a
// native Clerk connection; Telegram goes through our custom bridge
// (/api/auth/telegram → sign-in token → /tg-callback). We use useClerk()
// (stable client API) rather than the newer signals-based useSignIn hook.
export default function AuthGate({ tgError }: { tgError?: string }) {
  const clerk = useClerk();
  const [busy, setBusy] = useState(false);

  async function continueWithGoogle() {
    if (busy || !clerk.client) return;
    setBusy(true);
    try {
      await clerk.client.signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/checkout",
      });
    } catch {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-2 text-center font-display-lg text-display-lg-mobile md:text-display-lg">
        ابدأ اشتراكك
      </h1>
      <p className="mb-10 text-center font-body-lg text-body-lg text-on-surface-variant">
        سجّل دخولك الأول علشان نحفظلك تقدّمك ونوصّلك الكورس والكوميونيتي على طول.
        اختار طريقة واحدة:
      </p>

      {tgError && (
        <p className="mb-6 border-2 border-error bg-error-container p-3 text-center font-label-md text-label-md text-on-error-container">
          حصلت مشكلة في الدخول عبر تليجرام. جرّب تاني أو استخدم جوجل.
        </p>
      )}

      <div className="space-y-4">
        {/* Google */}
        <button
          type="button"
          onClick={continueWithGoogle}
          disabled={busy}
          className="neo-button flex w-full items-center justify-center gap-3 border-2 border-black bg-surface-container-lowest px-8 py-5 font-headline-md text-headline-md text-on-surface disabled:pointer-events-none disabled:opacity-60"
        >
          <GoogleMark />
          <span>{busy ? "جاري التحويل..." : "سجّل دخول بحساب جوجل"}</span>
        </button>

        <div className="flex items-center gap-3 py-1 text-on-surface-variant">
          <span className="h-px flex-1 bg-outline-variant" />
          <span className="font-label-md text-label-md">أو</span>
          <span className="h-px flex-1 bg-outline-variant" />
        </div>

        {/* Telegram (custom widget → bridge) */}
        <div className="neo-card flex flex-col items-center gap-3 border-2 border-black bg-surface-container-lowest px-6 py-6">
          <span className="font-headline-md text-headline-md font-bold text-on-surface">
            اتصل عبر تليجرام
          </span>
          <span className="text-center font-body-md text-body-md text-on-surface-variant">
            هتدخل بحساب تليجرام، وهنضيفك للكوميونيتي على طول بعد التفعيل.
          </span>
          <TelegramLoginButton />
        </div>
      </div>

      <p className="mt-8 text-center font-label-md text-label-md text-on-surface-variant">
        بتسجيلك إنت موافق على شروط الاستخدام وسياسة الخصوصية.
      </p>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
