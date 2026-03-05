import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { JoinGroupButton } from "@/components/groups/JoinGroupButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle } from "lucide-react";

const PLATFORM_LABELS: Record<string, string> = {
  DISCORD: "Discord",
  SLACK: "Slack",
  MICROSOFT_TEAMS: "Microsoft Teams",
  WHATSAPP: "WhatsApp",
  TELEGRAM: "Telegram",
};

type Params = {
  params: Promise<{ groupId: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function InvitePage({ params, searchParams }: Params) {
  const { groupId } = await params;
  const { token } = await searchParams;

  if (!token) notFound();

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/sign-in?callbackUrl=/groups/${groupId}/invite?token=${token}`);
  }

  const group = await db.group.findUnique({
    where: { id: groupId, inviteToken: token },
    include: { _count: { select: { members: true } } },
  });

  if (!group) notFound();

  // Already a member → redirect to group
  const existing = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.user.id } },
  });
  if (existing) redirect(`/groups/${groupId}`);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600/20">
            <Users className="h-7 w-7 text-violet-400" />
          </div>

          <h1 className="text-xl font-bold text-white">You&apos;re invited!</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Join <span className="font-semibold text-white">{group.name}</span>{" "}
            on GradConnect
          </p>

          <div className="mt-5 rounded-xl border border-white/10 bg-zinc-800/50 p-4 text-left space-y-2">
            {group.description && (
              <p className="text-sm text-zinc-400">{group.description}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {group.projectType && (
                <Badge
                  variant="secondary"
                  className="bg-violet-600/15 text-violet-300 border-0 text-xs"
                >
                  {group.projectType}
                </Badge>
              )}
              <Badge
                variant="secondary"
                className="bg-zinc-700 text-zinc-400 border-0 text-xs"
              >
                {PLATFORM_LABELS[group.platform] ?? group.platform}
              </Badge>
            </div>
            <p className="text-xs text-zinc-600">
              {group._count.members} / {group.maxMembers} members · max{" "}
              {group.maxPerMajor} per field / trade
            </p>
          </div>

          {group.isOpen ? (
            <div className="mt-6">
              <JoinGroupButton groupId={groupId} token={token} />
              <Link href="/groups" className="mt-3 block">
                <Button
                  variant="ghost"
                  className="w-full text-zinc-500 hover:text-white"
                >
                  Maybe later
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-zinc-500">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">This team is full</span>
              </div>
              <Link href="/groups">
                <Button
                  variant="outline"
                  className="border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10"
                >
                  Browse other teams
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
