"use client"

import { useState } from "react"
import { toast } from "sonner"

type VoteState = {
  count: number
  hasVoted: boolean
}

export function useVote(
  groupId: string,
  ideaId: string,
  initial: VoteState
) {
  const [state, setState] = useState(initial)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    if (loading) return
    setLoading(true)

    const optimistic: VoteState = {
      count: state.hasVoted ? state.count - 1 : state.count + 1,
      hasVoted: !state.hasVoted,
    }
    setState(optimistic)

    try {
      const method = state.hasVoted ? "DELETE" : "POST"
      const res = await fetch(
        `/api/groups/${groupId}/ideas/${ideaId}/vote`,
        { method }
      )

      if (!res.ok) {
        // Revert
        setState(state)
        const data = await res.json().catch(() => ({}))
        toast.error((data as { error?: string }).error ?? "Failed to vote")
      }
    } catch {
      setState(state)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return { ...state, toggle, loading }
}
