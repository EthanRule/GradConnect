import type { NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

// Edge-safe config — no Prisma/db imports allowed here
export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({ credentials: {} }),
  ],
  pages: {
    signIn: "/sign-in",
    newUser: "/profile/edit",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const protectedPaths = ["/dashboard", "/profile", "/groups/new"]
      const isGroupSettings = /^\/groups\/[^/]+\/settings/.test(nextUrl.pathname)
      const isProtected =
        protectedPaths.some((p) => nextUrl.pathname.startsWith(p)) || isGroupSettings

      if (isProtected && !isLoggedIn) return false
      return true
    },
  },
}
