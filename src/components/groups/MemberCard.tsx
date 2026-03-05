import Link from "next/link"
import Image from "next/image"
import { Crown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type MemberCardProps = {
  member: {
    role: string
    user: {
      id: string
      name: string | null
      image: string | null
      profile: {
        major: string
        skills: string[]
        bio: string | null
      } | null
    }
  }
  kickButton?: React.ReactNode
}

export function MemberCard({ member, kickButton }: MemberCardProps) {
  const { user, role } = member
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  return (
    <div className="relative">
      {kickButton}
    <Link href={`/users/${user.id}`}>
      <div className="group flex items-start gap-3 rounded-xl border border-white/10 bg-zinc-900/40 p-4 transition-colors hover:border-amber-500/30 hover:bg-amber-600/5">
        {/* Avatar */}
        <div className="relative shrink-0">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? ""}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600/30 text-sm font-semibold text-amber-300">
              {initials}
            </div>
          )}
          {role === "CREATOR" && (
            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400">
              <Crown className="h-2.5 w-2.5 text-yellow-900" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-white group-hover:text-amber-300">
              {user.name ?? "Anonymous"}
            </p>
          </div>
          {user.profile?.major && (
            <p className="mt-0.5 text-xs text-zinc-500">{user.profile.major}</p>
          )}
          {user.profile?.skills && user.profile.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {user.profile.skills.slice(0, 4).map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-zinc-800 text-zinc-400 border-0 text-xs py-0"
                >
                  {skill}
                </Badge>
              ))}
              {user.profile.skills.length > 4 && (
                <span className="text-xs text-zinc-600">
                  +{user.profile.skills.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
    </div>
  )
}

