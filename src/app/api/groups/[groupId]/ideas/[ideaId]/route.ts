import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type Params = { params: Promise<{ groupId: string; ideaId: string }> }

export async function DELETE(_: Request, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { groupId, ideaId } = await params

  const idea = await db.projectIdea.findUnique({ where: { id: ideaId } })
  if (!idea || idea.groupId !== groupId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Author can delete their own idea; creator can delete any
  if (idea.authorId !== session.user.id) {
    const membership = await db.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: session.user.id } },
    })
    if (!membership || membership.role !== "CREATOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  await db.projectIdea.delete({ where: { id: ideaId } })

  return new NextResponse(null, { status: 204 })
}
