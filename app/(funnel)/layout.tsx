import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import Logo from "@/components/Logo";

// ClerkProvider is scoped to the funnel subtree only (checkout + order +
// auth callbacks). The shared header lives here so every funnel page gets it.
export default function FunnelLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider signInUrl="/checkout" signUpUrl="/checkout">
      <div className="min-h-screen bg-background">
        <header className="border-b-2 border-on-surface bg-surface">
          <div className="mx-auto flex max-w-container-max items-center justify-between px-margin-mobile py-4 md:px-margin-desktop">
            <Logo />
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-label-md text-label-md font-bold text-on-surface-variant transition-colors hover:text-primary"
            >
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
              ارجع للرئيسية
            </Link>
          </div>
        </header>
        {children}
      </div>
    </ClerkProvider>
  );
}
