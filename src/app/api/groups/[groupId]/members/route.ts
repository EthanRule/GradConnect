import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type Params = { params: Promise<{ groupId: string }> }

export async function GET(_: Request, { params }: Params) {
  const { groupId } = await params

  const members = await db.groupMember.findMany({
    where: { groupId },
    include: {
      user: {
        select: { id: true, name: true, image: true, profile: true },
      },
    },
    orderBy: { joinedAt: "asc" },
  })

  return NextResponse.json(members)
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { groupId } = await params
  const body = await req.json().catch(() => ({}))
  const { userId: targetUserId } = body as { userId?: string }

  const myMembership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.user.id } },
  })

  if (!myMembership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  // Leaving (no targetUserId or targeting self)
  if (!targetUserId || targetUserId === session.user.id) {
    if (myMembership.role === "CREATOR") {
      return NextResponse.json(
        { error: "Creator cannot leave — delete the group instead" },
        { status: 400 }
      )
    }
    await db.groupMember.delete({
      where: { groupId_userId: { groupId, userId: session.user.id } },
    })

    // Re-open group if it was full
    await db.group.update({
      where: { id: groupId },
      data: { isOpen: true },
    })

    return new NextResponse(null, { status: 204 })
  }

  // Kicking another member (creator only)
  if (myMembership.role !== "CREATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const targetMembership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: targetUserId } },
  })
  if (!targetMembership) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 })
  }
  if (targetMembership.role === "CREATOR") {
    return NextResponse.json({ error: "Cannot kick the creator" }, { status: 400 })
  }

  await db.groupMember.delete({
    where: { groupId_userId: { groupId, userId: targetUserId } },
  })

  await db.group.update({
    where: { id: groupId },
    data: { isOpen: true },
  })

  return new NextResponse(null, { status: 204 })
}
