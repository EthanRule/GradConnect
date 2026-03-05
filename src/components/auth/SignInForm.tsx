"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Github, Chrome, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    setLoading(false)

    if (result?.error) {
      toast.error("Invalid email or password.")
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  async function handleOAuth(provider: "github" | "google") {
    setOauthLoading(provider)
    await signIn(provider, { callbackUrl })
  }

  return (
    <div className="w-full space-y-6">
      {/* OAuth buttons */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          onClick={() => handleOAuth("github")}
          disabled={!!oauthLoading}
        >
          {oauthLoading === "github" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Github className="mr-2 h-4 w-4" />
          )}
          Continue with GitHub
        </Button>
        <Button
          variant="outline"
          className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          onClick={() => handleOAuth("google")}
          disabled={!!oauthLoading}
        >
          {oauthLoading === "google" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Chrome className="mr-2 h-4 w-4" />
          )}
          Continue with Google
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Separator className="flex-1 bg-white/10" />
        <span className="text-xs text-zinc-500">or continue with email</span>
        <Separator className="flex-1 bg-white/10" />
      </div>

      {/* Credentials form */}
      <form onSubmit={handleCredentials} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-300">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-white/15 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-violet-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-zinc-300">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-white/15 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-violet-500"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-500 text-white"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-violet-400 hover:text-violet-300">
          Sign up free
        </Link>
      </p>
    </div>
  )
}
