import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { trackServerEvent } from "@/lib/analytics";
import { applyRateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  targetType: z.enum(["USER", "GROUP"]),
  targetId: z.string().min(1),
  reason: z.string().min(3).max(120),
  details: z.string().max(1200).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(req);
  const rl = applyRateLimit(
    `report:${session.user.id}:${ip}`,
    10,
    60 * 60 * 1000,
  );
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many reports. Please try again later." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid report payload" },
      { status: 400 },
    );
  }

  const { targetType, targetId, reason, details } = parsed.data;

  if (targetType === "USER") {
    const user = await db.user.findUnique({
      where: { id: targetId },
      select: { id: true },
    });
    if (!user)
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 },
      );
  } else {
    const group = await db.group.findUnique({
      where: { id: targetId },
      select: { id: true },
    });
    if (!group)
      return NextResponse.json(
        { error: "Target team not found" },
        { status: 404 },
      );
  }

  await db.report.create({
    data: {
      reporterUserId: session.user.id,
      targetType,
      targetId,
      reason,
      details: details?.trim() || null,
    },
  });

  await trackServerEvent("report_submitted", session.user.id, {
    targetType,
    reason,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
