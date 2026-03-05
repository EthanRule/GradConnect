import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendGroupFullEmail } from "@/lib/email";
import { isProfileBuildReady } from "@/lib/profile";
import { applyRateLimit, getClientIp } from "@/lib/rate-limit";
import { trackServerEvent } from "@/lib/analytics";
import { hasFieldCapacity } from "@/lib/group-rules";

type Params = { params: Promise<{ groupId: string }> };

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { groupId } = await params;
  const body = await req.json().catch(() => ({}));
  const { token } = body as { token?: string };
  const ip = getClientIp(req);
  const rl = applyRateLimit(
    `join-group:${session.user.id}:${ip}`,
    40,
    60 * 60 * 1000,
  );
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many join attempts. Please try again later." },
      { status: 429 },
    );
  }

  const group = await db.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: {
          user: { include: { profile: { select: { major: true } } } },
        },
      },
    },
  });

  if (!group)
    return NextResponse.json({ error: "Group not found" }, { status: 404 });

  // Token provided → validate it; no token → require group to be open
  if (token) {
    if (group.inviteToken !== token) {
      return NextResponse.json(
        { error: "Invalid invite link" },
        { status: 403 },
      );
    }
  } else if (!group.isOpen) {
    return NextResponse.json(
      { error: "This group is not accepting new members" },
      { status: 403 },
    );
  }

  // Already a member?
  const alreadyMember = group.members.some(
    (m) => m.userId === session.user!.id,
  );
  if (alreadyMember) {
    return NextResponse.json({ error: "Already a member" }, { status: 409 });
  }

  // Member cap
  if (group.members.length >= group.maxMembers) {
    return NextResponse.json({ error: "This group is full" }, { status: 409 });
  }

  // Field/trade cap
  const userProfile = await db.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!isProfileBuildReady(userProfile)) {
    return NextResponse.json(
      {
        error:
          "Complete your profile first (field/trade + at least one skill) before joining a team.",
      },
      { status: 400 },
    );
  }

  if (userProfile?.major) {
    if (
      !hasFieldCapacity(group.members, userProfile.major, group.maxPerMajor)
    ) {
      return NextResponse.json(
        {
          error: `This group already has ${group.maxPerMajor} members with the same field/trade (${userProfile.major})`,
        },
        { status: 409 },
      );
    }
  }

  // Add member
  const member = await db.groupMember.create({
    data: { groupId, userId: session.user.id },
  });
  await trackServerEvent("team_joined", session.user.id, { groupId });

  // Check if now full → send email (idempotent via filledNotifiedAt)
  const newCount = group.members.length + 1;
  if (newCount >= group.maxMembers) {
    const updates: { isOpen: boolean; filledNotifiedAt?: Date } = {
      isOpen: false,
    };

    if (!group.filledNotifiedAt) {
      const creator = group.members.find((m) => m.role === "CREATOR");
      if (creator) {
        const creatorUser = await db.user.findUnique({
          where: { id: creator.userId },
        });
        if (creatorUser?.email) {
          await sendGroupFullEmail({
            to: creatorUser.email,
            creatorName: creatorUser.name ?? "Creator",
            groupName: group.name,
            groupUrl: `${process.env.NEXTAUTH_URL}/groups/${groupId}`,
            memberCount: group.maxMembers,
          });
          updates.filledNotifiedAt = new Date();
        }
      }
    }

    await db.group.update({ where: { id: groupId }, data: updates });
  }

  return NextResponse.json(member, { status: 201 });
}
