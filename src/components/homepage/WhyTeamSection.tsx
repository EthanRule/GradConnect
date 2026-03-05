import { Brain, DollarSign, Shield, TrendingUp, Zap, Globe } from "lucide-react"

const benefits = [
  {
    icon: Brain,
    title: "Diverse thinking beats solo AI prompting",
    description:
      "A CS grad codes it. A marketing grad positions it. A design grad makes it beautiful. AI handles the execution. No single person can think of everything — a team can.",
  },
  {
    icon: DollarSign,
    title: "Economically smarter than going alone",
    description:
      "Split costs, share the workload, and move faster than any solo founder with AI. Your $20/month Cursor subscription goes further when five people are shipping off it.",
  },
  {
    icon: Shield,
    title: "Accountability you can't fake",
    description:
      "It's easy to quit when it's just you. It's harder when five people are counting on you showing up. Teams ship. Solo founders procrastinate.",
  },
  {
    icon: TrendingUp,
    title: "Investors fund teams",
    description:
      "97% of VC-backed companies have co-founders. Solo founders are a red flag. A diverse team signals execution ability, resilience, and market coverage.",
  },
  {
    icon: Zap,
    title: "AI multiplies team output exponentially",
    description:
      "One person with AI can do the work of five. Five people with AI can do the work of fifty. The leverage compounds. The speed compounds. The output compounds.",
  },
  {
    icon: Globe,
    title: "Your degree is more valuable in a team",
    description:
      "Employers want specialists who collaborate. Building real products with a team proves you can do both — and gives you something far more impressive than class projects.",
  },
]

export function WhyTeamSection() {
  return (
    <section className="bg-zinc-900/50 py-24 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-amber-400">
            Why collaborate
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Solo + AI is powerful.
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-amber-400 bg-clip-text text-transparent">
              Team + AI is unstoppable.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            The biggest mistake recent grads make is trying to compete alone in a world that
            rewards collaboration.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group rounded-2xl border border-white/8 bg-white/3 p-6 transition-colors hover:border-amber-500/30 hover:bg-amber-600/5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/15">
                <benefit.icon className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="mb-2 font-semibold text-white">{benefit.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

