"use client";

import { useEffect, useRef } from "react";
import { TELEGRAM } from "@/lib/config";

// Injects Telegram's official Login Widget. On success Telegram redirects the
// browser to data-auth-url (/api/auth/telegram) with the signed payload, which
// our bridge verifies. NOTE: the bot's domain must be set in @BotFather
// (/setdomain → academy.scaleflow.digital) or the widget won't render.
export default function TelegramLoginButton() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = ref.current;
    if (!TELEGRAM.botUsername || !mount) return;
    mount.replaceChildren();
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", TELEGRAM.botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "0");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-auth-url", "/api/auth/telegram");
    mount.appendChild(script);
    return () => {
      mount.replaceChildren();
    };
  }, []);

  if (!TELEGRAM.botUsername) {
    return (
      <p className="font-label-md text-label-md text-on-surface-variant">
        (الدخول عبر تليجرام لسه مش مفعّل)
      </p>
    );
  }

  return <div ref={ref} className="min-h-[48px]" />;
}
