import { hasKey } from "@/lib/sarvam/client";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ ok: true, mode: hasKey() ? "live" : "mock" });
}
