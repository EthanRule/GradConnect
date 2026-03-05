import { Skeleton } from "@/components/ui/skeleton"

export default function GroupDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Skeleton className="mb-6 h-4 w-28 bg-zinc-800" />

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-48 bg-zinc-800" />
            <Skeleton className="h-5 w-12 rounded-full bg-zinc-800" />
          </div>
          <Skeleton className="mt-2 h-4 w-80 bg-zinc-800" />
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full bg-zinc-800" />
            <Skeleton className="h-5 w-20 rounded-full bg-zinc-800" />
          </div>
        </div>
        <Skeleton className="h-9 w-24 bg-zinc-800" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Initial concept */}
          <div>
            <Skeleton className="mb-3 h-4 w-32 bg-zinc-800" />
            <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4 space-y-2">
              <Skeleton className="h-4 w-full bg-zinc-800" />
              <Skeleton className="h-4 w-full bg-zinc-800" />
              <Skeleton className="h-4 w-2/3 bg-zinc-800" />
            </div>
          </div>

          {/* Ideas */}
          <div>
            <Skeleton className="mb-3 h-4 w-28 bg-zinc-800" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <div className="flex gap-3">
                    <Skeleton className="h-14 w-12 rounded-lg bg-zinc-800" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40 bg-zinc-800" />
                      <Skeleton className="h-4 w-full bg-zinc-800" />
                      <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Members sidebar */}
        <div>
          <Skeleton className="mb-3 h-4 w-24 bg-zinc-800" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-zinc-900/40 p-4 flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full bg-zinc-800 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-28 bg-zinc-800" />
                  <Skeleton className="h-3 w-20 bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
