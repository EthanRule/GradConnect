const stats = [
  {
    value: "40%+",
    label: "Recent grads unemployed or underemployed",
    sublabel: "Class of 2024, Federal Reserve data",
  },
  {
    value: "$15T",
    label: "Projected AI economic impact by 2030",
    sublabel: "McKinsey Global Institute",
  },
  {
    value: "3×",
    label: "More likely to succeed with a co-founder",
    sublabel: "YC portfolio analysis",
  },
  {
    value: "90%",
    label: "Of billion-dollar companies were built by teams",
    sublabel: "Not solo founders",
  },
]

export function StatsSection() {
  return (
    <section className="bg-zinc-950 py-20 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Section label */}
        <p className="mb-12 text-center text-sm font-medium uppercase tracking-widest text-amber-400">
          The opportunity is real
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className="rounded-2xl border border-white/8 bg-white/3 p-6 text-center backdrop-blur-sm"
            >
              <p className="mb-2 text-4xl font-bold text-white">{stat.value}</p>
              <p className="mb-1 text-sm font-medium text-zinc-200">{stat.label}</p>
              <p className="text-xs text-zinc-500">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

