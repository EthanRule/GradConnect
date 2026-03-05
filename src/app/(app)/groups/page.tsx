import Link from "next/link";
import { db } from "@/lib/db";
import { GroupFilters } from "@/components/groups/GroupFilters";
import { Users } from "lucide-react";
import { auth } from "@/lib/auth";
import { isProfileBuildReady } from "@/lib/profile";
import { sortGroupsByMatch } from "@/lib/matching";

export const dynamic = "force-dynamic";
export const metadata = { title: "Browse Teams — GradConnect" };

export default async function GroupsPage() {
  const session = await auth();
  const [groups, myProfile] = await Promise.all([
    db.group.findMany({
      where: { isOpen: true },
      select: {
        id: true,
        name: true,
        description: true,
        platform: true,
        projectType: true,
        isOpen: true,
        maxMembers: true,
        maxPerMajor: true,
        lookingForMajors: true,
        aiUsage: true,
        githubRepo: true,
        _count: { select: { members: true } },
        members: {
          select: {
            user: { select: { profile: { select: { major: true } } } },
          },
          orderBy: { joinedAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    session?.user?.id
      ? db.profile.findUnique({
          where: { userId: session.user.id },
          select: { major: true, skills: true },
        })
      : Promise.resolve(null),
  ]);

  const sortedGroups = myProfile
    ? sortGroupsByMatch(groups, myProfile).map((x) => x.group)
    : groups;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Browse Teams</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Find an open team that fits your skills, or{" "}
          <Link
            href="/groups/new"
            className="text-amber-400 hover:text-amber-300"
          >
            create your own
          </Link>
          .
        </p>
      </div>

      {session?.user?.id && !isProfileBuildReady(myProfile) && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-600/10 p-4">
          <p className="text-sm text-amber-200">
            Complete your profile (field/trade + at least one skill) for better
            team matching and to join teams.
          </p>
          <Link
            href="/profile/edit"
            className="mt-2 inline-block text-sm text-amber-300 underline hover:text-amber-200"
          >
            Complete profile
          </Link>
        </div>
      )}

      {sortedGroups.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-12 text-center">
          <Users className="mx-auto mb-4 h-10 w-10 text-zinc-600" />
          <h2 className="text-lg font-semibold text-white">
            No open teams yet
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Be the first to create one.
          </p>
        </div>
      ) : (
        <GroupFilters groups={sortedGroups} />
      )}
    </div>
  );
}
