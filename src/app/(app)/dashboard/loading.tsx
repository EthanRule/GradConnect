import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 bg-zinc-800" />
          <Skeleton className="mt-2 h-4 w-36 bg-zinc-800" />
        </div>
        <Skeleton className="h-9 w-28 bg-zinc-800" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
            <div className="flex items-start justify-between">
              <Skeleton className="h-5 w-36 bg-zinc-800" />
              <Skeleton className="h-5 w-16 rounded-full bg-zinc-800" />
            </div>
            <Skeleton className="mt-2 h-4 w-full bg-zinc-800" />
            <div className="mt-3 flex gap-3">
              <Skeleton className="h-4 w-24 bg-zinc-800" />
              <Skeleton className="h-4 w-12 bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
