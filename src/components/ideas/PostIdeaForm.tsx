"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Lightbulb } from "lucide-react"

export function PostIdeaForm({ groupId }: { groupId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/groups/${groupId}/ideas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Failed to post idea")
        return
      }
      toast.success("Idea posted!")
      setTitle("")
      setDescription("")
      setOpen(false)
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="border-dashed border-violet-500/40 bg-violet-600/5 text-violet-300 hover:bg-violet-600/10 hover:text-violet-200 w-full"
      >
        <Lightbulb className="mr-2 h-4 w-4" />
        Post a project idea
      </Button>
    )
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-violet-500/30 bg-violet-600/5 p-4 space-y-3"
    >
      <div className="space-y-1.5">
        <Label htmlFor="idea-title" className="text-zinc-300 text-sm">
          Title
        </Label>
        <Input
          id="idea-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. AI-powered job application tracker"
          maxLength={150}
          required
          className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="idea-desc" className="text-zinc-300 text-sm">
          Description
        </Label>
        <Textarea
          id="idea-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explain the problem it solves and how it works..."
          maxLength={1000}
          rows={3}
          required
          className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500 resize-none"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setOpen(false)}
          className="text-zinc-500 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || title.trim().length === 0 || description.trim().length < 10}
          className="bg-violet-600 hover:bg-violet-500 text-white"
        >
          {loading ? "Posting..." : "Post idea"}
        </Button>
      </div>
    </form>
  )
}
