import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberCard } from "@/components/groups/MemberCard";
import { InviteSection } from "@/components/groups/InviteSection";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { PostIdeaForm } from "@/components/ideas/PostIdeaForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings, ExternalLink, Github } from "lucide-react";
import { JoinGroupButton } from "@/components/groups/JoinGroupButton";
import { LeaveGroupButton } from "@/components/groups/LeaveGroupButton";
import { KickMemberButton } from "@/components/groups/KickMemberButton";
import { ReportDialog } from "@/components/moderation/ReportDialog";

const AI_USAGE_LABELS: Record<string, { label: string; className: string }> = {
  AI: { label: "AI", className: "bg-blue-500/15 text-blue-400" },
  AI_HYBRID: {
    label: "AI Hybrid",
    className: "bg-amber-500/15 text-amber-400",
  },
  NO_AI: { label: "No AI", className: "bg-zinc-800 text-zinc-500" },
};

const PLATFORM_LABELS: Record<string, string> = {
  DISCORD: "Discord",
  SLACK: "Slack",
  MICROSOFT_TEAMS: "Microsoft Teams",
  WHATSAPP: "WhatsApp",
  TELEGRAM: "Telegram",
};

type Params = { params: Promise<{ groupId: string }> };

export default async function GroupDetailPage({ params }: Params) {
  const { groupId } = await params;
  const session = await auth();

  const group = await db.group.findUnique({
    where: { id: groupId },
    include: {
      _count: { select: { members: true } },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              createdAt: true,
              profile: true,
            },
          },
        },
        orderBy: { joinedAt: "asc" },
      },
      projectIdeas: {
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { votes: true } },
          votes: { select: { userId: true } },
        },
        orderBy: { votes: { _count: "desc" } },
      },
    },
  });

  if (!group) notFound();

  const myMembership = session?.user?.id
    ? group.members.find((m) => m.userId === session!.user!.id)
    : null;
  const isMember = !!myMembership;
  const isCreator = myMembership?.role === "CREATOR";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Back */}
      <Link
        href="/groups"
        className="mb-6 flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Browse Teams
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{group.name}</h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                group.isOpen
                  ? "bg-green-500/15 text-green-400"
                  : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {group.isOpen ? "Open" : "Full"}
            </span>
          </div>
          {group.description && (
            <p className="mt-2 text-zinc-400">{group.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {group.projectType && (
              <Badge
                variant="secondary"
                className="bg-amber-600/15 text-amber-300 border-0"
              >
                {group.projectType}
              </Badge>
            )}
            {AI_USAGE_LABELS[group.aiUsage] && (
              <Badge
                variant="secondary"
                className={`border-0 ${AI_USAGE_LABELS[group.aiUsage].className}`}
              >
                {AI_USAGE_LABELS[group.aiUsage].label}
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="bg-zinc-800 text-zinc-400 border-0"
            >
              {PLATFORM_LABELS[group.platform] ?? group.platform}
            </Badge>
            <span className="text-sm text-zinc-500">
              {group._count.members} / {group.maxMembers} members · max{" "}
              {group.maxPerMajor} per field / trade
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {session?.user?.id && !isCreator && (
            <ReportDialog
              targetType="GROUP"
              targetId={groupId}
              targetLabel="team"
              triggerLabel="Report"
              className="text-zinc-500 hover:text-red-300"
            />
          )}
          {isCreator && (
            <Link href={`/groups/${groupId}/settings`}>
              <Button
                variant="outline"
                size="sm"
                className="border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10"
              >
                <Settings className="mr-1.5 h-4 w-4" />
                Settings
              </Button>
            </Link>
          )}
          {!isMember && group.isOpen && session?.user?.id && (
            <JoinGroupButton groupId={groupId} />
          )}
          {!session?.user?.id && group.isOpen && (
            <Link href={`/sign-in?callbackUrl=/groups/${groupId}`}>
              <Button
                className="bg-amber-600 hover:bg-amber-500 text-white"
                size="sm"
              >
                Join Team
              </Button>
            </Link>
          )}
          {isMember && !isCreator && <LeaveGroupButton groupId={groupId} />}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Initial idea */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Initial Concept
            </h2>
            <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
              <p className="text-sm text-zinc-300 leading-relaxed">
                {group.initialProjectIdea}
              </p>
            </div>
          </div>

          {/* Ideas + voting (members only) */}
          {isMember && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Project Ideas
              </h2>

              <div className="space-y-3">
                {group.projectIdeas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    groupId={groupId}
                    idea={idea}
                    currentUserId={session?.user?.id ?? null}
                    isCreator={isCreator}
                  />
                ))}

                <PostIdeaForm groupId={groupId} />
              </div>
            </div>
          )}

          {/* Invite section (members only) */}
          {isMember && (
            <InviteSection
              groupId={groupId}
              inviteToken={group.inviteToken}
              isCreator={isCreator}
            />
          )}
        </div>

        {/* Members sidebar */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Members ({group._count.members})
          </h2>
          <div className="space-y-2">
            {group.members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                kickButton={
                  isCreator && member.role !== "CREATOR" ? (
                    <KickMemberButton
                      groupId={groupId}
                      userId={member.userId}
                      userName={member.user.name ?? "this member"}
                    />
                  ) : undefined
                }
              />
            ))}
          </div>

          {/* Platform link (members only) */}
          {isMember && group.platformLink && (
            <a
              href={group.platformLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/40 p-3 text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Open {PLATFORM_LABELS[group.platform] ?? group.platform}
            </a>
          )}

          {/* GitHub repo (visible to all) */}
          {group.githubRepo && (
            <a
              href={group.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/40 p-3 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
