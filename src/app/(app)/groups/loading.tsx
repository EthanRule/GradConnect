import { Skeleton } from "@/components/ui/skeleton"

export default function GroupsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <Skeleton className="h-8 w-40 bg-zinc-800" />
        <Skeleton className="mt-2 h-4 w-64 bg-zinc-800" />
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-10 flex-1 bg-zinc-800" />
        <Skeleton className="h-10 w-full sm:w-56 bg-zinc-800" />
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-5 w-32 bg-zinc-800" />
              <Skeleton className="h-5 w-12 rounded-full bg-zinc-800" />
            </div>
            <Skeleton className="mt-2 h-4 w-full bg-zinc-800" />
            <Skeleton className="mt-1 h-4 w-3/4 bg-zinc-800" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full bg-zinc-800" />
              <Skeleton className="h-5 w-20 rounded-full bg-zinc-800" />
            </div>
            <Skeleton className="mt-3 h-4 w-24 bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
