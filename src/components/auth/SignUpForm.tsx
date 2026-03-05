"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Github, Chrome, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function SignUpForm() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.")
      return
    }

    setLoading(true)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error ?? "Registration failed.")
      setLoading(false)
      return
    }

    // Auto sign in after successful registration
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      toast.error("Account created but sign-in failed. Please sign in manually.")
      router.push("/sign-in")
    } else {
      toast.success("Welcome to GradConnect!")
      router.push("/profile/edit")
      router.refresh()
    }
  }

  async function handleOAuth(provider: "github" | "google") {
    setOauthLoading(provider)
    await signIn(provider, { callbackUrl: "/profile/edit" })
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
        <span className="text-xs text-zinc-500">or sign up with email</span>
        <Separator className="flex-1 bg-white/10" />
      </div>

      {/* Registration form */}
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-zinc-300">Full name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Alex Johnson"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-white/15 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-300">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-white/15 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-zinc-300">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-white/15 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-amber-600 hover:bg-amber-500 text-white"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create free account
        </Button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-amber-400 hover:text-amber-300">
          Sign in
        </Link>
      </p>

      <p className="text-center text-xs text-zinc-600">
        By signing up, you agree to build cool things with your team.
      </p>
    </div>
  )
}

