import { NextResponse } from "next/server"
import { getConfiguredOrigin } from "@/lib/security"

export function verifyMutationOrigin(req: Request): NextResponse | null {
  const expectedOrigin = getConfiguredOrigin()
  const origin = req.headers.get("origin")

  // If origin isn't sent (non-browser client), allow.
  if (!origin) return null

  if (!expectedOrigin || origin !== expectedOrigin) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
  }

  return null
}
