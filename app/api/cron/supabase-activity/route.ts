import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// A private, daily database activity check. No private rows or credentials are returned.
// On Supabase Free, activity reduces (but does not eliminate) the risk of automatic pausing.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Database connection not configured" }, { status: 503 });
  }

  try {
    // Query the database itself rather than only pinging the HTTP gateway.
    // A read-only request never writes or exposes a user's application data.
    const response = await fetch(
      `${url}/rest/v1/job_applications?select=id&limit=1`,
      { method: "GET", cache: "no-store", signal: AbortSignal.timeout(10000),
        headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!response.ok) {
      console.error("Scheduled Supabase activity check failed:", response.status);
      return NextResponse.json({ ok: false }, { status: 503 });
    }
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("Scheduled Supabase activity check could not reach the database");
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
