"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECT_TYPES, AI_USAGE_OPTIONS } from "@/lib/validations";
import { Separator } from "@/components/ui/separator";
import { MajorMultiSelect } from "@/components/groups/MajorMultiSelect";

const PLATFORMS = [
  { value: "DISCORD", label: "Discord" },
  { value: "SLACK", label: "Slack" },
  { value: "MICROSOFT_TEAMS", label: "Microsoft Teams" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "TELEGRAM", label: "Telegram" },
] as const;

type Group = {
  id: string;
  name: string;
  description: string | null;
  initialProjectIdea: string;
  projectType: string | null;
  platform: string;
  platformLink: string | null;
  lookingForMajors: string[];
  aiUsage: string;
  githubRepo: string | null;
};

export function GroupSettingsForm({ group }: { group: Group }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lookingForMajors, setLookingForMajors] = useState<string[]>(
    group.lookingForMajors,
  );
  const [form, setForm] = useState({
    name: group.name,
    description: group.description ?? "",
    initialProjectIdea: group.initialProjectIdea,
    projectType: group.projectType ?? "",
    platform: group.platform,
    platformLink: group.platformLink ?? "",
    aiUsage: group.aiUsage,
    githubRepo: group.githubRepo ?? "",
  });

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/groups/${group.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          initialProjectIdea: form.initialProjectIdea,
          projectType: form.projectType || undefined,
          platform: form.platform,
          platformLink: form.platformLink || undefined,
          lookingForMajors,
          aiUsage: form.aiUsage || undefined,
          githubRepo: form.githubRepo || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to save");
        return;
      }
      toast.success("Settings saved");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function deleteGroup() {
    if (!confirm("Delete this team permanently? This cannot be undone."))
      return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/groups/${group.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Failed to delete");
        return;
      }
      toast.success("Team deleted");
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-zinc-300">
            Team name
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            maxLength={100}
            required
            className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-amber-500"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="desc" className="text-zinc-300">
            Description
          </Label>
          <Textarea
            id="desc"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            maxLength={500}
            rows={3}
            className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-amber-500 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="idea" className="text-zinc-300">
            Initial project idea
          </Label>
          <Textarea
            id="idea"
            value={form.initialProjectIdea}
            onChange={(e) => set("initialProjectIdea", e.target.value)}
            maxLength={1000}
            rows={4}
            required
            className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-amber-500 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-zinc-300">Project type</Label>
          <Select
            value={form.projectType}
            onValueChange={(v) => set("projectType", v)}
          >
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
                    ? "border-amber-500 bg-amber-600/20 text-amber-300"
                    : "border-white/10 bg-zinc-800/60 text-zinc-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-zinc-300">Platform</Label>
          <Select
            value={form.platform}
            onValueChange={(v) => set("platform", v)}
          >
            <SelectTrigger className="bg-zinc-800 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto bg-zinc-900 border-white/10 text-white">
              {PLATFORMS.map((p) => (
                <SelectItem
                  key={p.value}
                  value={p.value}
                  className="focus:bg-white/10"
                >
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="githubRepo" className="text-zinc-300">
            GitHub repo
          </Label>
          <Input
            id="githubRepo"
            value={form.githubRepo}
            onChange={(e) => set("githubRepo", e.target.value)}
            placeholder="https://github.com/yourteam/project"
            className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-amber-500"
          />
        </div>

        <MajorMultiSelect
          label="Looking for these fields / trades"
          selected={lookingForMajors}
          onChange={setLookingForMajors}
        />

        <div className="space-y-1.5">
          <Label htmlFor="link" className="text-zinc-300">
            Platform invite link
          </Label>
          <Input
            id="link"
            value={form.platformLink}
            onChange={(e) => set("platformLink", e.target.value)}
            placeholder="https://discord.gg/..."
            className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-amber-500"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-600 hover:bg-amber-500 text-white"
      >
        {loading ? "Saving..." : "Save changes"}
      </Button>

      <Separator className="bg-white/10" />

      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="text-sm font-semibold text-red-400">Danger zone</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Permanently delete this team and all its data.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={deleteGroup}
          disabled={deleting}
          className="mt-4 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          {deleting ? "Deleting..." : "Delete team"}
        </Button>
      </div>
    </form>
  );
}

