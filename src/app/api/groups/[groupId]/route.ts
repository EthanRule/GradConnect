import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { groupSchema } from "@/lib/validations";

type Params = { params: Promise<{ groupId: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { groupId } = await params;

  const group = await db.group.findUnique({
    where: { id: groupId },
    include: {
      _count: { select: { members: true } },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              createdAt: true,
              profile: true,
            },
          },
        },
        orderBy: { joinedAt: "asc" },
      },
      projectIdeas: {
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { votes: true } },
          votes: { select: { userId: true } },
        },
        orderBy: { votes: { _count: "desc" } },
      },
    },
  });

  if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Strip inviteToken from public response — only exposed to creator on the page
  const { inviteToken: _inviteToken, ...publicGroup } = group;

  return NextResponse.json(publicGroup);
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { groupId } = await params;

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.user.id } },
  });
  if (!membership || membership.role !== "CREATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = groupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { aiUsage, githubRepo, ...rest } = parsed.data;
  const group = await db.group.update({
    where: { id: groupId },
    data: {
      ...rest,
      ...(aiUsage ? { aiUsage: aiUsage as "AI" | "AI_HYBRID" | "NO_AI" } : {}),
      githubRepo: githubRepo || null,
    },
  });

  return NextResponse.json(group);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { groupId } = await params;

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.user.id } },
  });
  if (!membership || membership.role !== "CREATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.group.delete({ where: { id: groupId } });

  return new NextResponse(null, { status: 204 });
}
