"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { X } from "lucide-react"

export function KickMemberButton({
  groupId,
  userId,
  userName,
}: {
  groupId: string
  userId: string
  userName: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function kick() {
    if (!confirm(`Remove ${userName} from the team?`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/groups/${groupId}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error((data as { error?: string }).error ?? "Failed to remove member")
        return
      }
      toast.success(`${userName} removed`)
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={kick}
      disabled={loading}
      title={`Remove ${userName}`}
      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-red-500/15 hover:text-red-400 disabled:cursor-not-allowed"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  )
}
