"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, RefreshCw } from "lucide-react"

type InviteSectionProps = {
  groupId: string
  inviteToken: string
  isCreator: boolean
}

export function InviteSection({ groupId, inviteToken: initialToken, isCreator }: InviteSectionProps) {
  const [token, setToken] = useState(initialToken)
  const [regenerating, setRegenerating] = useState(false)

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/groups/${groupId}/invite?token=${token}`
      : `/groups/${groupId}/invite?token=${token}`

  async function copyLink() {
    await navigator.clipboard.writeText(inviteUrl)
    toast.success("Invite link copied!")
  }

  async function regenerate() {
    setRegenerating(true)
    try {
      const res = await fetch(`/api/groups/${groupId}/invite`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Failed to regenerate link")
        return
      }
      setToken(data.inviteToken)
      toast.success("Invite link regenerated")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setRegenerating(false)
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
      <h3 className="mb-3 text-sm font-semibold text-white">Invite link</h3>
      <div className="flex gap-2">
        <Input
          readOnly
          value={inviteUrl}
          className="bg-zinc-800 border-white/10 text-zinc-400 text-xs font-mono focus-visible:ring-amber-500"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={copyLink}
          className="shrink-0 border-white/10 bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
          title="Copy invite link"
        >
          <Copy className="h-4 w-4" />
        </Button>
        {isCreator && (
          <Button
            variant="outline"
            size="icon"
            onClick={regenerate}
            disabled={regenerating}
            className="shrink-0 border-white/10 bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            title="Regenerate invite link"
          >
            <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
          </Button>
        )}
      </div>
      {isCreator && (
        <p className="mt-2 text-xs text-zinc-600">
          Share this link with people you want to invite. Regenerate if it&apos;s been
          compromised.
        </p>
      )}
    </div>
  )
}

