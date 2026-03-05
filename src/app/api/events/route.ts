import { NextResponse } from "next/server";
import { z } from "zod";
import { trackServerEvent } from "@/lib/analytics";
import { applyRateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  event: z.enum([
    "sign_up",
    "profile_completed",
    "team_created",
    "team_joined",
    "idea_posted",
    "report_submitted",
  ]),
  properties: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = applyRateLimit(`events:${ip}`, 120, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many events" }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid event payload" },
      { status: 400 },
    );
  }

  await trackServerEvent(parsed.data.event, null, parsed.data.properties ?? {});
  return NextResponse.json({ ok: true });
}
