import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk runs ONLY on the funnel + its API routes. The marketing homepage and
// everything else stay Clerk-free, so the public site never depends on auth
// keys to render. Page/route components do their own auth() checks; we don't
// auto-protect here (the /checkout page must be reachable signed-out to show
// the auth gate).
export default clerkMiddleware();

export const config = {
  matcher: [
    "/checkout/:path*",
    "/order/:path*",
    "/sso-callback",
    "/tg-callback",
    "/api/checkout",
    "/api/order/:path*",
    "/api/auth/telegram",
  ],
};
