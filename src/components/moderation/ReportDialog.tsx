"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
  targetType: "USER" | "GROUP"
  targetId: string
  targetLabel: string
  triggerLabel?: string
  className?: string
}

export function ReportDialog({
  targetType,
  targetId,
  targetLabel,
  triggerLabel = "Report",
  className,
}: Props) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (reason.trim().length < 3) {
      toast.error("Please enter a short reason.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          reason: reason.trim(),
          details: details.trim() || undefined,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error((data as { error?: string }).error ?? "Failed to submit report")
        return
      }
      toast.success("Report submitted. Thanks for helping keep teams safe.")
      setOpen(false)
      setReason("")
      setDetails("")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={className ?? "text-zinc-500 hover:text-red-300"}
        >
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-zinc-950 text-white">
        <DialogHeader>
          <DialogTitle>Report {targetLabel}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Tell us what happened. A moderator will review this report.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (required)"
            maxLength={120}
            className="border-white/15 bg-white/5 text-white placeholder:text-zinc-600"
          />
          <Textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Details (optional)"
            maxLength={1200}
            rows={4}
            className="border-white/15 bg-white/5 text-white placeholder:text-zinc-600"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-white/15 bg-white/5 text-zinc-300"
          >
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-500 text-white"
          >
            {loading ? "Submitting..." : "Submit report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
