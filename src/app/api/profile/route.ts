import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profileSchema } from "@/lib/validations";
import { isProfileBuildReady } from "@/lib/profile";
import { trackServerEvent } from "@/lib/analytics";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
    include: { user: { select: { name: true, email: true, image: true } } },
  });

  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = profileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { name, bio, major, skills, linkedin, github, twitter, website } =
    parsed.data;
  const before = await db.profile.findUnique({
    where: { userId: session.user.id },
    select: { major: true, skills: true },
  });

  const [profile] = await Promise.all([
    db.profile.upsert({
      where: { userId: session.user.id },
      update: { bio, major, skills, linkedin, github, twitter, website },
      create: {
        userId: session.user.id,
        bio,
        major,
        skills,
        linkedin,
        github,
        twitter,
        website,
      },
    }),
    db.user.update({
      where: { id: session.user.id },
      data: { name },
    }),
  ]);

  if (!isProfileBuildReady(before) && isProfileBuildReady(profile)) {
    await trackServerEvent("profile_completed", session.user.id, {
      source: "profile_edit",
    });
  }

  return NextResponse.json(profile);
}
