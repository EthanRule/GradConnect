import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { GroupSettingsForm } from "@/components/groups/GroupSettingsForm"
import { ArrowLeft } from "lucide-react"

type Params = { params: Promise<{ groupId: string }> }

export const metadata = { title: "Team Settings — GradConnect" }

export default async function GroupSettingsPage({ params }: Params) {
  const { groupId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.user.id } },
  })
  if (!membership || membership.role !== "CREATOR") notFound()

  const group = await db.group.findUnique({ where: { id: groupId } })
  if (!group) notFound()

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Link
        href={`/groups/${groupId}`}
        className="mb-6 flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to team
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-white">Team Settings</h1>

      <GroupSettingsForm group={group} />
    </div>
  )
}
