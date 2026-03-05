"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LeaveGroupButton({ groupId }: { groupId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function leave() {
    if (!confirm("Leave this team? You'll need a new invite link to rejoin.")) return
    setLoading(true)
    try {
      const res = await fetch(`/api/groups/${groupId}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error((data as { error?: string }).error ?? "Failed to leave")
        return
      }
      toast.success("You left the team")
      router.push("/dashboard")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={leave}
      disabled={loading}
      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50"
    >
      <LogOut className="mr-1.5 h-4 w-4" />
      {loading ? "Leaving..." : "Leave Team"}
    </Button>
  )
}
