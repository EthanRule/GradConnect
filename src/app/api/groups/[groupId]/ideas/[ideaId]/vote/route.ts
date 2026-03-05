import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyMutationOrigin } from "@/lib/security-server";

type Params = { params: Promise<{ groupId: string; ideaId: string }> };

export async function POST(req: Request, { params }: Params) {
  const originError = verifyMutationOrigin(req);
  if (originError) return originError;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { groupId, ideaId } = await params;

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.user.id } },
  });
  if (!membership) {
    return NextResponse.json(
      { error: "Must be a member to vote" },
      { status: 403 },
    );
  }

  const vote = await db.vote.upsert({
    where: { ideaId_userId: { ideaId, userId: session.user.id } },
    update: {},
    create: { ideaId, userId: session.user.id },
  });

  return NextResponse.json(vote, { status: 201 });
}

export async function DELETE(req: Request, { params }: Params) {
  const originError = verifyMutationOrigin(req);
  if (originError) return originError;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ideaId } = await params;

  await db.vote
    .delete({
      where: { ideaId_userId: { ideaId, userId: session.user.id } },
    })
    .catch(() => null); // Ignore if vote doesn't exist

  return new NextResponse(null, { status: 204 });
}

