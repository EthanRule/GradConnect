import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Globe, Pencil } from "lucide-react"

type ProfileCardProps = {
  user: {
    id: string
    name: string | null
    image: string | null
    createdAt?: Date | string
  }
  profile: {
    bio: string | null
    major: string
    skills: string[]
    linkedin: string | null
    github: string | null
    twitter: string | null
    website: string | null
  } | null
  isOwnProfile?: boolean
}

export function ProfileCard({ user, profile, isOwnProfile }: ProfileCardProps) {
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?"

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-amber-600/30">
            <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
            <AvatarFallback className="bg-amber-700 text-white text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold text-white">{user.name ?? "Anonymous"}</h2>
            {profile?.major && (
              <p className="text-sm text-amber-400">{profile.major}</p>
            )}
          </div>
        </div>

        {isOwnProfile && (
          <Link href="/profile/edit">
            <Button
              size="sm"
              variant="outline"
              className="border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
          </Link>
        )}
      </div>

      {/* Bio */}
      {profile?.bio && (
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">{profile.bio}</p>
      )}

      {!profile?.bio && isOwnProfile && (
        <p className="mt-4 text-sm italic text-zinc-600">
          No bio yet.{" "}
          <Link href="/profile/edit" className="text-amber-400 hover:text-amber-300">
            Add one
          </Link>
        </p>
      )}

      {/* Skills */}
      {profile?.skills && profile.skills.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-amber-600/15 text-amber-300 hover:bg-amber-600/25"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Social links */}
      {profile && (profile.github || profile.linkedin || profile.twitter || profile.website) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {profile.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          )}
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
            >
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn
            </a>
          )}
          {profile.twitter && (
            <a
              href={profile.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
            >
              <Twitter className="h-3.5 w-3.5" />
              Twitter
            </a>
          )}
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
            >
              <Globe className="h-3.5 w-3.5" />
              Website
            </a>
          )}
        </div>
      )}
    </div>
  )
}

