import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrderByLeadId, deriveStatus } from "@/lib/sheets";

export const runtime = "nodejs";

// Live order status for the tracker. Reads the Sheet server-side and authorizes
// that the signed-in user owns the order (no cross-user peeking).
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let row;
  try {
    row = await getOrderByLeadId(id);
  } catch (err) {
    console.error("[api/order] sheet read failed", err);
    return NextResponse.json({ error: "lookup_failed" }, { status: 502 });
  }

  if (!row) {
    // Row may not be written yet (just-submitted) — tell the client to keep polling.
    return NextResponse.json({ status: "pending_write" }, { status: 202 });
  }

  // Deny by default: an order is only ever shown to the user it's attached to.
  // Ownerless rows (legacy / not-yet-attributed) are never returned to anyone.
  if (!row.clerk_user_id || row.clerk_user_id !== userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  return NextResponse.json(deriveStatus(id, row));
}
