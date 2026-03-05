"use client"

import { useState } from "react"
import { Search, X, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MAJOR_OPTIONS } from "@/lib/validations"

type Props = {
  selected: string[]
  onChange: (majors: string[]) => void
  label?: string
}

export function MajorMultiSelect({ selected, onChange, label }: Props) {
  const [search, setSearch] = useState("")

  const filtered = MAJOR_OPTIONS.filter(
    (m) => m.toLowerCase().includes(search.toLowerCase())
  )

  function toggle(major: string) {
    if (selected.includes(major)) {
      onChange(selected.filter((m) => m !== major))
    } else {
      onChange([...selected, major])
    }
  }

  function remove(major: string) {
    onChange(selected.filter((m) => m !== major))
  }

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-sm text-zinc-300">{label}</p>
      )}

      {/* Selected badges */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((m) => (
            <Badge
              key={m}
              variant="secondary"
              className="bg-violet-600/20 text-violet-300 border border-violet-500/30 text-xs gap-1 pr-1"
            >
              {m}
              <button
                type="button"
                onClick={() => remove(m)}
                className="ml-0.5 rounded hover:text-violet-100"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search majors..."
          className="w-full rounded-md border border-white/10 bg-zinc-800 py-1.5 pl-8 pr-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
      </div>

      {/* Options list */}
      <div className="max-h-44 overflow-y-auto rounded-lg border border-white/10 bg-zinc-800/60">
        {filtered.length === 0 ? (
          <p className="px-3 py-2 text-xs text-zinc-500">No majors found</p>
        ) : (
          filtered.map((m) => {
            const isSelected = selected.includes(m)
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggle(m)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-white/5 ${
                  isSelected ? "text-violet-300" : "text-zinc-400"
                }`}
              >
                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    isSelected
                      ? "border-violet-500 bg-violet-600"
                      : "border-white/20 bg-transparent"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
                {m}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
