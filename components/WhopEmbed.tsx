"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WhopCheckoutEmbed } from "@whop/checkout/react";
import { WHOP, SITE_URL } from "@/lib/config";

function makeLeadId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Foreign / card flow: Whop's embedded checkout on our page. On completion we
// record the order (server attaches Clerk identity) and route to the status
// page. The Whop webhook is the authoritative confirm; onComplete just drives UX.
export default function WhopEmbed() {
  const router = useRouter();
  const [leadId, setLeadId] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLeadId(makeLeadId());
    setMounted(true);
  }, []);

  if (!WHOP.planId) {
    return (
      <div className="neo-card rounded-xl border-2 border-black bg-surface-container-lowest p-8 text-center">
        <p className="font-body-md text-on-surface-variant">
          الدفع بالبطاقة لسه مش مفعّل. جرّب إنستاباي أو ارجع بعدين.
        </p>
      </div>
    );
  }

  if (!mounted || !leadId) {
    return (
      <div className="neo-card rounded-xl border-2 border-black bg-surface-container-lowest p-8 text-center">
        <p className="font-body-md text-on-surface-variant">
          جاري تحميل صفحة الدفع...
        </p>
      </div>
    );
  }

  function handleComplete(_planId: string, receiptId?: string) {
    const body = new FormData();
    body.append("lead_id", leadId);
    body.append("payment_method", "card");
    if (receiptId) body.append("whop_receipt_id", receiptId);
    fetch("/api/checkout", { method: "POST", body })
      .catch(() => {})
      .finally(() => router.push(`/order/${leadId}`));
  }

  return (
    <div className="neo-card overflow-hidden rounded-xl border-2 border-black bg-surface-container-lowest">
      <WhopCheckoutEmbed
        planId={WHOP.planId}
        theme="light"
        returnUrl={`${SITE_URL}/order/${leadId}`}
        onComplete={handleComplete}
        themeOptions={{ accentColor: "brown" }}
      />
    </div>
  );
}
