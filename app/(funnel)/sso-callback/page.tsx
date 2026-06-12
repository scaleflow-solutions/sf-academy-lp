"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

// Clerk's OAuth (Google) return endpoint. It completes the redirect handshake
// and sends the user back into the funnel.
export default function SSOCallbackPage() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-margin-mobile py-24">
      <p className="font-body-lg text-body-lg text-on-surface-variant">
        جاري تسجيل دخولك...
      </p>
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/checkout"
        signUpForceRedirectUrl="/checkout"
      />
    </div>
  );
}
