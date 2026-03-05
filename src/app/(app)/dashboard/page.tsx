import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Users, Plus, CheckCircle2, Circle } from "lucide-react";
import { isProfileBuildReady } from "@/lib/profile";
import { sortGroupsByMatch } from "@/lib/matching";
import { GroupCard } from "@/components/groups/GroupCard";

export const metadata = { title: "Dashboard — GradConnect" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const [profile, memberships, ideasPosted, openGroups] = await Promise.all([
    db.profile.findUnique({
      where: { userId: session.user.id },
      select: { major: true, skills: true },
    }),
    db.groupMember.findMany({
      where: { userId: session.user.id },
      include: {
        group: {
          include: { _count: { select: { members: true } } },
        },
      },
      orderBy: { joinedAt: "desc" },
    }),
    db.projectIdea.count({ where: { authorId: session.user.id } }),
    db.group.findMany({
      where: {
        isOpen: true,
        members: { none: { userId: session.user.id } },
      },
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
          take: 20,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  const checklist = [
    {
      id: "profile",
      label: "Complete your profile",
      done: isProfileBuildReady(profile),
      href: "/profile/edit",
    },
    {
      id: "team",
      label: "Join or create a team",
      done: memberships.length > 0,
      href:
        memberships.length > 0
          ? `/groups/${memberships[0]!.group.id}`
          : "/groups",
    },
    {
      id: "idea",
      label: "Post your first project idea",
      done: ideasPosted > 0,
      href:
        memberships.length > 0
          ? `/groups/${memberships[0]!.group.id}`
          : "/groups",
    },
  ] as const;

  const recommendations = sortGroupsByMatch(openGroups, profile)
    .filter((entry) => entry.match.score > 0)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {session.user.name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">Your teams and activity</p>
        </div>
        <Link href="/groups/new">
          <Button className="bg-amber-600 hover:bg-amber-500 text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Team
          </Button>
        </Link>
      </div>

      <div className="mb-8 rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
        <div className="mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Getting Started
          </h2>
          <p className="text-sm text-zinc-500">
            Finish these to activate your account and get better team matches.
          </p>
        </div>
        <div className="grid gap-2">
          {checklist.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center justify-between rounded-lg border border-white/8 bg-zinc-950/40 px-3 py-2 hover:bg-white/5"
            >
              <div className="flex items-center gap-2">
                {item.done ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                ) : (
                  <Circle className="h-4 w-4 text-zinc-500" />
                )}
                <span className={item.done ? "text-zinc-300" : "text-zinc-400"}>
                  {item.label}
                </span>
              </div>
              <span className="text-xs text-zinc-500">
                {item.done ? "Done" : "Open"}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="mb-8">
          <div className="mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Recommended Teams
            </h2>
            <p className="text-sm text-zinc-500">
              Ranked for your field/trade and current team fit.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map(({ group }) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      )}

      {memberships.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-12 text-center">
          <Users className="mx-auto mb-4 h-10 w-10 text-zinc-600" />
          <h2 className="text-lg font-semibold text-white">No teams yet</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Join an existing team or create your own to get started.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/groups">
              <Button
                variant="outline"
                className="border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
              >
                Browse Teams
              </Button>
            </Link>
            <Link href="/groups/new">
              <Button className="bg-amber-600 hover:bg-amber-500 text-white">
                Create a Team
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {memberships.map(({ group, role }) => (
            <Link key={group.id} href={`/groups/${group.id}`}>
              <div className="group rounded-2xl border border-white/10 bg-zinc-900/60 p-5 transition-colors hover:border-amber-500/30 hover:bg-amber-600/5">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-white group-hover:text-amber-300">
                    {group.name}
                  </h3>
                  {role === "CREATOR" && (
                    <span className="rounded-full bg-amber-600/20 px-2 py-0.5 text-xs text-amber-300">
                      Creator
                    </span>
                  )}
                </div>
                {group.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                    {group.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                  <span>
                    {group._count.members} / {group.maxMembers} members
                  </span>
                  <span>·</span>
                  <span
                    className={
                      group.isOpen ? "text-green-400" : "text-zinc-500"
                    }
                  >
                    {group.isOpen ? "Open" : "Full"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
