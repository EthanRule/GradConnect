import { db } from "@/lib/db"
import { GroupFilters } from "@/components/groups/GroupFilters"
import { Users } from "lucide-react"

export const dynamic = "force-dynamic"
export const metadata = { title: "Browse Teams — GradConnect" }

export default async function GroupsPage() {
  const groups = await db.group.findMany({
    where: { isOpen: true },
    include: {
      _count: { select: { members: true } },
      members: {
        include: {
          user: { include: { profile: { select: { major: true } } } },
        },
        orderBy: { joinedAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Browse Teams</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Find an open team that fits your skills, or{" "}
          <a href="/groups/new" className="text-violet-400 hover:text-violet-300">
            create your own
          </a>
          .
        </p>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-12 text-center">
          <Users className="mx-auto mb-4 h-10 w-10 text-zinc-600" />
          <h2 className="text-lg font-semibold text-white">No open teams yet</h2>
          <p className="mt-2 text-sm text-zinc-400">Be the first to create one.</p>
        </div>
      ) : (
        <GroupFilters groups={groups} />
      )}
    </div>
  )
}
