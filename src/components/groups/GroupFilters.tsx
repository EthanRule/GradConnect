"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GroupCard } from "@/components/groups/GroupCard";
import { FIELD_OPTIONS } from "@/lib/validations";

type Group = {
  id: string;
  name: string;
  description: string | null;
  platform: string;
  projectType: string | null;
  isOpen: boolean;
  maxMembers: number;
  maxPerMajor: number;
  lookingForMajors: string[];
  aiUsage: string;
  githubRepo?: string | null;
  _count: { members: number };
  members: {
    user: {
      profile: { major: string } | null;
    };
  }[];
};

export function GroupFilters({ groups }: { groups: Group[] }) {
  const [search, setSearch] = useState("");
  const [major, setMajor] = useState("all");
  const [projectType, setProjectType] = useState("all");
  const [aiUsage, setAiUsage] = useState("all");
  const [platform, setPlatform] = useState("all");

  const projectTypes = useMemo(
    () =>
      Array.from(
        new Set(groups.map((g) => g.projectType).filter(Boolean) as string[]),
      ),
    [groups],
  );
  const aiOptions = useMemo(
    () => Array.from(new Set(groups.map((g) => g.aiUsage))).sort(),
    [groups],
  );
  const platformOptions = useMemo(
    () => Array.from(new Set(groups.map((g) => g.platform))).sort(),
    [groups],
  );

  const filtered = useMemo(() => {
    return groups.filter((g) => {
      const matchesSearch =
        !search || g.name.toLowerCase().includes(search.toLowerCase());

      const matchesMajor =
        major === "all" ||
        g.members.filter((m) => m.user.profile?.major === major).length <
          g.maxPerMajor;
      const matchesProjectType =
        projectType === "all" || g.projectType === projectType;
      const matchesAi = aiUsage === "all" || g.aiUsage === aiUsage;
      const matchesPlatform = platform === "all" || g.platform === platform;

      return (
        matchesSearch &&
        matchesMajor &&
        matchesProjectType &&
        matchesAi &&
        matchesPlatform
      );
    });
  }, [groups, search, major, projectType, aiUsage, platform]);

  return (
    <div>
      <div className="mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-zinc-900/60 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-amber-500"
          />
        </div>

        <Select value={major} onValueChange={setMajor}>
          <SelectTrigger className="w-full bg-zinc-900/60 border-white/10 text-white">
            <SelectValue placeholder="Filter by your field" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            className="max-h-60 bg-zinc-900 border-white/10 text-white"
          >
            <SelectItem value="all" className="focus:bg-white/10">
              All fields / trades
            </SelectItem>
            {FIELD_OPTIONS.map((m) => (
              <SelectItem key={m} value={m} className="focus:bg-white/10">
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={projectType} onValueChange={setProjectType}>
          <SelectTrigger className="w-full bg-zinc-900/60 border-white/10 text-white">
            <SelectValue placeholder="Project type" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            className="max-h-60 bg-zinc-900 border-white/10 text-white"
          >
            <SelectItem value="all">All project types</SelectItem>
            {projectTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={aiUsage} onValueChange={setAiUsage}>
          <SelectTrigger className="w-full bg-zinc-900/60 border-white/10 text-white">
            <SelectValue placeholder="AI usage" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            className="max-h-60 bg-zinc-900 border-white/10 text-white"
          >
            <SelectItem value="all">All AI styles</SelectItem>
            {aiOptions.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="w-full bg-zinc-900/60 border-white/10 text-white">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            className="max-h-60 bg-zinc-900 border-white/10 text-white"
          >
            <SelectItem value="all">All platforms</SelectItem>
            {platformOptions.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-12 text-center">
          <p className="text-zinc-400">No teams match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}
