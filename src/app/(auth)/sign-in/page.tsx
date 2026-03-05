import { Suspense } from "react"
import Link from "next/link"
import { Users } from "lucide-react"
import { SignInForm } from "@/components/auth/SignInForm"

export const metadata = {
  title: "Sign In — GradConnect",
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/8 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">GradConnect</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-zinc-400">Sign in to your account to continue building</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-8 backdrop-blur-sm">
          <Suspense>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
