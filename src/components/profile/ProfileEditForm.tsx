"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { FIELD_OPTIONS } from "@/lib/validations";

type ProfileData = {
  name: string;
  bio: string;
  major: string;
  skills: string[];
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
};

type Props = {
  initialData?: Partial<ProfileData> & { name?: string | null };
  returnTo?: string;
};

export function ProfileEditForm({ initialData, returnTo }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const [form, setForm] = useState<ProfileData>({
    name: initialData?.name ?? "",
    bio: initialData?.bio ?? "",
    major: initialData?.major ?? "",
    skills: initialData?.skills ?? [],
    linkedin: initialData?.linkedin ?? "",
    github: initialData?.github ?? "",
    twitter: initialData?.twitter ?? "",
    website: initialData?.website ?? "",
  });

  function set(field: keyof ProfileData, value: string | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed || form.skills.includes(trimmed) || form.skills.length >= 20)
      return;
    set("skills", [...form.skills, trimmed]);
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    set(
      "skills",
      form.skills.filter((s) => s !== skill),
    );
  }

  function handleSkillKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!form.major) {
      toast.error("Please select your field or trade.");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Failed to save profile.");
      return;
    }

    toast.success("Profile saved!");
    router.push(returnTo || "/profile");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-zinc-300">
          Full name <span className="text-red-400">*</span>
        </Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Alex Johnson"
          required
          className="border-white/15 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500"
        />
      </div>

      {/* Field / Trade */}
      <div className="space-y-2">
        <Label className="text-zinc-300">
          Field / Trade <span className="text-red-400">*</span>
        </Label>
        <Select value={form.major} onValueChange={(v) => set("major", v)}>
          <SelectTrigger className="border-white/15 bg-white/5 text-white focus:ring-amber-500">
            <SelectValue placeholder="Select your field or trade..." />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {FIELD_OPTIONS.map((field) => (
              <SelectItem key={field} value={field}>
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-zinc-300">
          Bio
        </Label>
        <Textarea
          id="bio"
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          placeholder="Tell your team what you're about and what you want to build..."
          maxLength={500}
          rows={3}
          className="border-white/15 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500 resize-none"
        />
        <p className="text-right text-xs text-zinc-600">
          {form.bio.length}/500
        </p>
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <Label className="text-zinc-300">Skills</Label>
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder="e.g. React, Python, Figma — press Enter to add"
            className="border-white/15 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addSkill}
            className="border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            Add
          </Button>
        </div>
        {form.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {form.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="gap-1 bg-amber-600/15 text-amber-300"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-0.5 rounded-full hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <p className="text-xs text-zinc-600">{form.skills.length}/20 skills</p>
      </div>

      {/* Social links */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-zinc-300">
          Links <span className="text-zinc-600">(optional)</span>
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="github" className="text-xs text-zinc-500">
              GitHub URL
            </Label>
            <Input
              id="github"
              value={form.github}
              onChange={(e) => set("github", e.target.value)}
              placeholder="https://github.com/username"
              className="border-white/15 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="linkedin" className="text-xs text-zinc-500">
              LinkedIn URL
            </Label>
            <Input
              id="linkedin"
              value={form.linkedin}
              onChange={(e) => set("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="border-white/15 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="twitter" className="text-xs text-zinc-500">
              Twitter / X URL
            </Label>
            <Input
              id="twitter"
              value={form.twitter}
              onChange={(e) => set("twitter", e.target.value)}
              placeholder="https://x.com/username"
              className="border-white/15 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="website" className="text-xs text-zinc-500">
              Website URL
            </Label>
            <Input
              id="website"
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="https://yoursite.com"
              className="border-white/15 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-500 text-white"
        disabled={saving}
      >
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save profile
      </Button>
    </form>
  );
}
