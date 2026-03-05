import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24 px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-violet-400">
          Stop waiting
        </p>
        <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
          Your team is out there.
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your idea is waiting.
          </span>
        </h2>
        <p className="mb-10 text-lg text-zinc-400">
          Every month you wait is a month another team ships. The AI tools are
          here. The market is open. The only thing missing is the right group of
          people around you.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/sign-up">
            <Button
              size="lg"
              className="group h-12 gap-2 bg-violet-600 px-10 text-base hover:bg-violet-500 text-white"
            >
              Create Your Team Today
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/groups">
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-white/20 px-8 text-base text-zinc-300 hover:border-white/40 hover:bg-white/5 hover:text-white"
            >
              See Open Teams
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-zinc-600">
          Free forever · Open source · Max 20 per team · Max 5 per field / trade
        </p>
      </div>
    </section>
  );
}
