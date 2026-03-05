import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { groupSchema } from "@/lib/validations"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const major = searchParams.get("major")
  const search = searchParams.get("search")

  const groups = await db.group.findMany({
    where: {
      isOpen: true,
      ...(search
        ? { name: { contains: search, mode: "insensitive" } }
        : {}),
    },
    include: {
      _count: { select: { members: true } },
      members: {
        include: {
          user: { include: { profile: { select: { major: true } } } },
        },
        orderBy: { joinedAt: "asc" },
        take: 5,
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // If filtering by major, only include groups that have room for that major
  const filtered = major
    ? groups.filter((g) => {
        const majorCount = g.members.filter(
          (m) => m.user.profile?.major === major
        ).length
        return majorCount < g.maxPerMajor
      })
    : groups

  return NextResponse.json(filtered)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = groupSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  const { name, description, initialProjectIdea, projectType, platform, platformLink } =
    parsed.data

  const group = await db.group.create({
    data: {
      name,
      description,
      initialProjectIdea,
      projectType,
      platform,
      platformLink,
      members: {
        create: {
          userId: session.user.id,
          role: "CREATOR",
        },
      },
    },
  })

  return NextResponse.json(group, { status: 201 })
}
