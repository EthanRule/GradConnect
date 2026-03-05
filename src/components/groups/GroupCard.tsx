import Link from "next/link"
import { Users, MessageSquare, Github } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const AI_USAGE_LABELS: Record<string, { label: string; className: string }> = {
  AI: { label: "AI", className: "bg-blue-500/15 text-blue-400" },
  AI_HYBRID: { label: "AI Hybrid", className: "bg-amber-500/15 text-amber-400" },
  NO_AI: { label: "No AI", className: "bg-zinc-800 text-zinc-400" },
}

const PLATFORM_LABELS: Record<string, string> = {
  DISCORD: "Discord",
  SLACK: "Slack",
  MICROSOFT_TEAMS: "Teams",
  WHATSAPP: "WhatsApp",
  TELEGRAM: "Telegram",
}

type GroupCardProps = {
  group: {
    id: string
    name: string
    description: string | null
    platform: string
    projectType: string | null
    isOpen: boolean
    maxMembers: number
    lookingForMajors: string[]
    aiUsage: string
    githubRepo?: string | null
    _count: { members: number }
    members: { user: { profile: { major: string } | null } }[]
  }
}

export function GroupCard({ group }: GroupCardProps) {
  const currentMajors = Array.from(
    new Set(group.members.map((m) => m.user.profile?.major).filter(Boolean) as string[])
  )

  return (
    <Link href={`/groups/${group.id}`}>
      <div className="group h-full rounded-2xl border border-white/10 bg-zinc-900/60 p-5 transition-colors hover:border-violet-500/30 hover:bg-violet-600/5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white group-hover:text-violet-300 line-clamp-1">
            {group.name}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
              group.isOpen
                ? "bg-green-500/15 text-green-400"
                : "bg-zinc-800 text-zinc-500"
            }`}
          >
            {group.isOpen ? "Open" : "Full"}
          </span>
        </div>

        {group.description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-zinc-400">
            {group.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {group.projectType && (
            <Badge
              variant="secondary"
              className="bg-violet-600/15 text-violet-300 border-0 text-xs"
            >
              {group.projectType}
            </Badge>
          )}
          {AI_USAGE_LABELS[group.aiUsage] && (
            <Badge
              variant="secondary"
              className={`border-0 text-xs ${AI_USAGE_LABELS[group.aiUsage].className}`}
            >
              {AI_USAGE_LABELS[group.aiUsage].label}
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="bg-zinc-800 text-zinc-400 border-0 text-xs"
          >
            <MessageSquare className="mr-1 h-3 w-3" />
            {PLATFORM_LABELS[group.platform] ?? group.platform}
          </Badge>
          {group.githubRepo && (
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 border-0 text-xs">
              <Github className="mr-1 h-3 w-3" />
              GitHub
            </Badge>
          )}
        </div>

        {currentMajors.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-zinc-500 mb-1">Has:</p>
            <div className="flex flex-wrap gap-1">
              {currentMajors.slice(0, 4).map((m) => (
                <span key={m} className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                  {m}
                </span>
              ))}
              {currentMajors.length > 4 && (
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                  +{currentMajors.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {group.lookingForMajors.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-zinc-500 mb-1">Seeking:</p>
            <div className="flex flex-wrap gap-1">
              {group.lookingForMajors.slice(0, 3).map((m) => (
                <span key={m} className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                  {m}
                </span>
              ))}
              {group.lookingForMajors.length > 3 && (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                  +{group.lookingForMajors.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500">
          <Users className="h-3.5 w-3.5" />
          <span>
            {group._count.members} / {group.maxMembers} members
          </span>
        </div>
      </div>
    </Link>
  )
}
