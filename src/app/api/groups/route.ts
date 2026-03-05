import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { groupSchema } from "@/lib/validations";
import { isProfileBuildReady } from "@/lib/profile";
import { applyRateLimit, getClientIp } from "@/lib/rate-limit";
import { trackServerEvent } from "@/lib/analytics";
import { hasFieldCapacity } from "@/lib/group-rules";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const major = searchParams.get("major");
  const search = searchParams.get("search");

  const groups = await db.group.findMany({
    where: {
      isOpen: true,
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
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
  });

  // If filtering by major, only include groups that have room for that major
  const filtered = major
    ? groups.filter((g) => {
        return hasFieldCapacity(g.members, major, g.maxPerMajor);
      })
    : groups;

  return NextResponse.json(filtered);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(req);
  const rl = applyRateLimit(
    `create-group:${session.user.id}:${ip}`,
    8,
    60 * 60 * 1000,
  );
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many team creations. Please try again later." },
      { status: 429 },
    );
  }

  const body = await req.json();
  const parsed = groupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const {
    name,
    description,
    initialProjectIdea,
    projectType,
    platform,
    platformLink,
    lookingForMajors,
    aiUsage,
    githubRepo,
  } = parsed.data;

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
    select: { major: true, skills: true },
  });
  if (!isProfileBuildReady(profile)) {
    return NextResponse.json(
      {
        error:
          "Complete your profile first (field/trade + at least one skill) before creating a team.",
      },
      { status: 400 },
    );
  }

  const group = await db.group.create({
    data: {
      name,
      description,
      initialProjectIdea,
      projectType,
      platform,
      platformLink,
      lookingForMajors: lookingForMajors ?? [],
      aiUsage: (aiUsage as "AI" | "AI_HYBRID" | "NO_AI") ?? "AI_HYBRID",
      githubRepo: githubRepo || null,
      members: {
        create: {
          userId: session.user.id,
          role: "CREATOR",
        },
      },
    },
  });

  await trackServerEvent("team_created", session.user.id, {
    groupId: group.id,
    aiUsage: group.aiUsage,
  });

  return NextResponse.json(group, { status: 201 });
}
