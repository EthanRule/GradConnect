"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GroupCard } from "@/components/groups/GroupCard"
import { MAJOR_OPTIONS } from "@/lib/validations"

type Group = {
  id: string
  name: string
  description: string | null
  platform: string
  projectType: string | null
  isOpen: boolean
  maxMembers: number
  maxPerMajor: number
  lookingForMajors: string[]
  _count: { members: number }
  members: {
    user: {
      profile: { major: string } | null
    }
  }[]
}

export function GroupFilters({ groups }: { groups: Group[] }) {
  const [search, setSearch] = useState("")
  const [major, setMajor] = useState("all")

  const filtered = useMemo(() => {
    return groups.filter((g) => {
      const matchesSearch =
        !search || g.name.toLowerCase().includes(search.toLowerCase())

      const matchesMajor =
        major === "all" ||
        g.members.filter((m) => m.user.profile?.major === major).length <
          g.maxPerMajor

      return matchesSearch && matchesMajor
    })
  }, [groups, search, major])

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-zinc-900/60 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
          />
        </div>

        <Select value={major} onValueChange={setMajor}>
          <SelectTrigger className="w-full sm:w-56 bg-zinc-900/60 border-white/10 text-white">
            <SelectValue placeholder="Filter by your major" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto bg-zinc-900 border-white/10 text-white">
            <SelectItem value="all" className="focus:bg-white/10">
              All majors
            </SelectItem>
            {MAJOR_OPTIONS.map((m) => (
              <SelectItem key={m} value={m} className="focus:bg-white/10">
                {m}
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
  )
}
