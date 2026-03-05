import Link from "next/link"
import { Users } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Brand */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link href="/" className="flex items-center gap-2 font-semibold text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600">
                <Users className="h-3.5 w-3.5 text-white" />
              </div>
              <span>GradConnect</span>
            </Link>
            <p className="text-center text-sm text-zinc-500 md:text-left">
              Build together. Ship together. Win together.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link href="/groups" className="text-sm text-zinc-500 transition-colors hover:text-white">
              Browse Teams
            </Link>
            <Link href="/sign-up" className="text-sm text-zinc-500 transition-colors hover:text-white">
              Join Free
            </Link>
            <Link href="/#how-it-works" className="text-sm text-zinc-500 transition-colors hover:text-white">
              How It Works
            </Link>
            <a
              href="https://github.com/your-org/gradconnect"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 transition-colors hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-8 text-center">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} GradConnect. Open source. Built by grads, for grads.
          </p>
        </div>
      </div>
    </footer>
  )
}

