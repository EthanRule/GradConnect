import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { randomUUID } from "crypto"
import { applyRateLimit, getClientIp } from "@/lib/rate-limit"

type Params = { params: Promise<{ groupId: string }> }

// GET — return current invite token (members only)
export async function GET(_: Request, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { groupId } = await params

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.user.id } },
  })
  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const group = await db.group.findUnique({
    where: { id: groupId },
    select: { inviteToken: true },
  })

  return NextResponse.json({ inviteToken: group?.inviteToken })
}

// POST — regenerate invite token (creator only)
export async function POST(req: Request, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const ip = getClientIp(req)
  const rl = applyRateLimit(`regen-invite:${session.user.id}:${ip}`, 20, 60 * 60 * 1000)
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many invite regenerations. Please try again later." },
      { status: 429 }
    )
  }

  const { groupId } = await params

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.user.id } },
  })
  if (!membership || membership.role !== "CREATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const group = await db.group.update({
    where: { id: groupId },
    data: { inviteToken: randomUUID() },
    select: { inviteToken: true },
  })

  return NextResponse.json({ inviteToken: group.inviteToken })
}
