import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 pt-16">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute left-1/4 top-2/3 h-[300px] w-[300px] rounded-full bg-pink-600/8 blur-3xl" />
        <div className="absolute right-1/4 top-1/4 h-[250px] w-[250px] rounded-full bg-indigo-600/8 blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>The AI opportunity is massive — and wide open</span>
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          The AI gold rush{" "}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            is here.
          </span>
          <br />
          You need a team.
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-400 sm:text-xl">
          Over 40% of recent graduates are unemployed or underemployed. Meanwhile, AI is
          creating the biggest startup opportunity in history — but{" "}
          <span className="text-zinc-200">only teams can fully harness it.</span> One person
          with AI is powerful. A diverse team with AI is unstoppable.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/sign-up">
            <Button
              size="lg"
              className="group h-12 gap-2 bg-violet-600 px-8 text-base hover:bg-violet-500 text-white"
            >
              Build Your Team
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/groups">
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-white/20 px-8 text-base text-zinc-300 hover:border-white/40 hover:bg-white/5 hover:text-white"
            >
              Browse Open Teams
            </Button>
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-sm text-zinc-600">
          Free forever · Open source · No experience required
        </p>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
    </section>
  )
}
