import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ideaSchema } from "@/lib/validations";
import { applyRateLimit, getClientIp } from "@/lib/rate-limit";
import { trackServerEvent } from "@/lib/analytics";
import { verifyMutationOrigin } from "@/lib/security-server";

type Params = { params: Promise<{ groupId: string }> };

export async function GET(_: Request, { params }: Params) {
  const { groupId } = await params;

  const ideas = await db.projectIdea.findMany({
    where: { groupId },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { votes: true } },
      votes: { select: { userId: true } },
    },
    orderBy: { votes: { _count: "desc" } },
  });

  return NextResponse.json(ideas);
}

export async function POST(req: Request, { params }: Params) {
  const originError = verifyMutationOrigin(req);
  if (originError) return originError;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ip = getClientIp(req);
  const rl = applyRateLimit(
    `post-idea:${session.user.id}:${ip}`,
    30,
    60 * 60 * 1000,
  );
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many idea submissions. Please try again later." },
      { status: 429 },
    );
  }

  const { groupId } = await params;

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.user.id } },
  });
  if (!membership) {
    return NextResponse.json(
      { error: "Must be a member to post ideas" },
      { status: 403 },
    );
  }

  const body = await req.json();
  const parsed = ideaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const idea = await db.projectIdea.create({
    data: {
      groupId,
      authorId: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { votes: true } },
      votes: { select: { userId: true } },
    },
  });

  await trackServerEvent("idea_posted", session.user.id, {
    groupId,
    ideaId: idea.id,
  });

  return NextResponse.json(idea, { status: 201 });
}

