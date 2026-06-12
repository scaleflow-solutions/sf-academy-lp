import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { clerkClient } from "@clerk/nextjs/server";

export const runtime = "nodejs";

// Telegram Login Widget → here. Telegram isn't OAuth: it signs the payload with
// HMAC-SHA256 using SHA256(bot_token) as the key. We verify that, then find-or-
// create a Clerk user keyed by externalId `telegram:<id>` and mint a sign-in
// token the client exchanges for a session at /tg-callback.
export async function GET(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const origin = req.nextUrl.origin;
  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`/checkout?tg_error=${reason}`, origin));

  if (!botToken) return fail("unconfigured");

  const data: Record<string, string> = {};
  for (const [k, v] of req.nextUrl.searchParams.entries()) data[k] = v;
  const { hash, ...fields } = data;
  if (!hash || !fields.id) return fail("missing");

  // 1) Verify the signature.
  const checkString = Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k]}`)
    .join("\n");
  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const expected = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return fail("invalid");
  }

  // 2) Reject stale logins (replay window: 1 day).
  const authDate = Number(fields.auth_date ?? 0);
  if (!authDate || Date.now() / 1000 - authDate > 86400) return fail("stale");

  // 3) Find-or-create the Clerk user.
  const tgId = String(fields.id);
  const externalId = `telegram:${tgId}`;
  try {
    const client = await clerkClient();
    const existing = await client.users.getUserList({
      externalId: [externalId],
      limit: 1,
    });
    const user =
      existing.data[0] ??
      (await client.users.createUser({
        externalId,
        username: fields.username ? `tg_${fields.username}` : `tg_${tgId}`,
        firstName: fields.first_name,
        lastName: fields.last_name,
        skipPasswordRequirement: true,
        publicMetadata: {
          auth_method: "telegram",
          telegram_user_id: tgId,
          telegram_username: fields.username ?? null,
          telegram_photo_url: fields.photo_url ?? null,
        },
      }));

    // 4) Mint a short-lived sign-in token and hand off to the client.
    const { token } = await client.signInTokens.createSignInToken({
      userId: user.id,
      expiresInSeconds: 600,
    });
    return NextResponse.redirect(
      new URL(`/tg-callback?ticket=${encodeURIComponent(token)}`, origin),
    );
  } catch (err) {
    console.error("[telegram-bridge] clerk error", err);
    return fail("server");
  }
}
