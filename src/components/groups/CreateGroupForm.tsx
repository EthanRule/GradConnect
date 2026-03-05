"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PROJECT_TYPES, AI_USAGE_OPTIONS } from "@/lib/validations"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MajorMultiSelect } from "@/components/groups/MajorMultiSelect"

const PLATFORMS = [
  { value: "DISCORD", label: "Discord" },
  { value: "SLACK", label: "Slack" },
  { value: "MICROSOFT_TEAMS", label: "Microsoft Teams" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "TELEGRAM", label: "Telegram" },
] as const

const STEP_TITLES = ["Team basics", "Your project idea", "Communication"]
const TOTAL_STEPS = 3

type FormData = {
  name: string
  description: string
  initialProjectIdea: string
  projectType: string
  aiUsage: string
  platform: string
  platformLink: string
  githubRepo: string
  lookingForMajors: string[]
}

export function CreateGroupForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    initialProjectIdea: "",
    projectType: "",
    aiUsage: "AI_HYBRID",
    platform: "",
    platformLink: "",
    githubRepo: "",
    lookingForMajors: [],
  })

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function canAdvance() {
    if (step === 1) return form.name.trim().length > 0
    if (step === 2) return form.initialProjectIdea.trim().length >= 10
    if (step === 3) return form.platform !== ""
    return false
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          initialProjectIdea: form.initialProjectIdea,
          projectType: form.projectType || undefined,
          platform: form.platform,
          platformLink: form.platformLink || undefined,
          lookingForMajors: form.lookingForMajors,
          aiUsage: form.aiUsage || undefined,
          githubRepo: form.githubRepo || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? "Failed to create team")
        return
      }

      toast.success("Team created!")
      router.push(`/groups/${data.id}`)
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
          <span>{STEP_TITLES[step - 1]}</span>
          <span>
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-violet-600 transition-all"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Team basics */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-zinc-300">
              Team name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. AI Health Startup"
              maxLength={100}
              className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-zinc-300">
              Short description{" "}
              <span className="text-zinc-600">(optional)</span>
            </Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What's the vibe? What are you building?"
              maxLength={500}
              rows={3}
              className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <MajorMultiSelect
              selected={form.lookingForMajors}
              onChange={(majors) => setForm((f) => ({ ...f, lookingForMajors: majors }))}
              label="Looking for these majors (optional)"
            />
            <p className="text-xs text-zinc-600">
              Let prospective members know which fields you need.
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Project idea */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="projectType" className="text-zinc-300">
              Project type <span className="text-zinc-600">(optional)</span>
            </Label>
            <Select value={form.projectType} onValueChange={(v) => set("projectType", v)}>
              <SelectTrigger className="bg-zinc-800 border-white/10 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto bg-zinc-900 border-white/10 text-white">
                {PROJECT_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="focus:bg-white/10">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-zinc-300">AI usage</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {AI_USAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set("aiUsage", opt.value)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                    form.aiUsage === opt.value
                      ? "border-violet-500 bg-violet-600/20 text-violet-300"
                      : "border-white/10 bg-zinc-800/60 text-zinc-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="idea" className="text-zinc-300">
              Initial project idea <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="idea"
              value={form.initialProjectIdea}
              onChange={(e) => set("initialProjectIdea", e.target.value)}
              placeholder="Describe the project you have in mind. Your team will vote on ideas later — this is just to attract the right people."
              maxLength={1000}
              rows={5}
              className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500 resize-none"
            />
            <p className="text-xs text-zinc-600">
              {form.initialProjectIdea.length} / 1000
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Platform */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-zinc-300">
              Communication platform <span className="text-red-400">*</span>
            </Label>
            <p className="text-xs text-zinc-500">
              Where will your team chat and collaborate?
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-3">
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => set("platform", p.value)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                    form.platform === p.value
                      ? "border-violet-500 bg-violet-600/20 text-violet-300"
                      : "border-white/10 bg-zinc-800/60 text-zinc-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="platformLink" className="text-zinc-300">
              Invite link <span className="text-zinc-600">(optional)</span>
            </Label>
            <Input
              id="platformLink"
              value={form.platformLink}
              onChange={(e) => set("platformLink", e.target.value)}
              placeholder="https://discord.gg/..."
              className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="githubRepo" className="text-zinc-300">
              GitHub repo <span className="text-zinc-600">(optional)</span>
            </Label>
            <Input
              id="githubRepo"
              value={form.githubRepo}
              onChange={(e) => set("githubRepo", e.target.value)}
              placeholder="https://github.com/yourteam/project"
              className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 1}
          className="text-zinc-400 hover:text-white"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        {step < TOTAL_STEPS ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
            className="bg-violet-600 hover:bg-violet-500 text-white"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canAdvance() || loading}
            className="bg-violet-600 hover:bg-violet-500 text-white"
          >
            {loading ? "Creating..." : "Create Team"}
          </Button>
        )}
      </div>
    </div>
  )
}
