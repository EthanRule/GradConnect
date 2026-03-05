import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { ProfileCard } from "@/components/profile/ProfileCard"
import { ArrowLeft } from "lucide-react"

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  })

  if (!user) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/groups"
        className="mb-6 flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <ProfileCard
        user={{ id: user.id, name: user.name, image: user.image, createdAt: user.createdAt }}
        profile={user.profile}
      />
    </div>
  )
}
