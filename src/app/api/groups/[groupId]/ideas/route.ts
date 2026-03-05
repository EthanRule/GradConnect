import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ideaSchema } from "@/lib/validations"

type Params = { params: Promise<{ groupId: string }> }

export async function GET(_: Request, { params }: Params) {
  const { groupId } = await params

  const ideas = await db.projectIdea.findMany({
    where: { groupId },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { votes: true } },
      votes: { select: { userId: true } },
    },
    orderBy: { votes: { _count: "desc" } },
  })

  return NextResponse.json(ideas)
}

export async function POST(req: Request, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { groupId } = await params

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.user.id } },
  })
  if (!membership) {
    return NextResponse.json({ error: "Must be a member to post ideas" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = ideaSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
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
  })

  return NextResponse.json(idea, { status: 201 })
}
