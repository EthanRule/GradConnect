type RateLimitEntry = {
  count: number
  resetAt: number
}

type RateLimitResult = {
  ok: boolean
  remaining: number
  resetAt: number
}

const globalForRateLimit = globalThis as unknown as {
  rateLimitStore?: Map<string, RateLimitEntry>
}

const store = globalForRateLimit.rateLimitStore ?? new Map<string, RateLimitEntry>()
if (!globalForRateLimit.rateLimitStore) {
  globalForRateLimit.rateLimitStore = store
}

export function applyRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const current = store.get(key)

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { ok: true, remaining: limit - 1, resetAt }
  }

  if (current.count >= limit) {
    return { ok: false, remaining: 0, resetAt: current.resetAt }
  }

  current.count += 1
  store.set(key, current)
  return { ok: true, remaining: limit - current.count, resetAt: current.resetAt }
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for")
  if (!fwd) return "unknown"
  return fwd.split(",")[0]?.trim() || "unknown"
}
