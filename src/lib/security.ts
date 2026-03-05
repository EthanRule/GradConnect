export function getConfiguredOrigin() {
  const raw = process.env.NEXTAUTH_URL
  if (!raw) return null
  try {
    return new URL(raw).origin
  } catch {
    return null
  }
}

export function sanitizeInternalPath(
  value: string | null | undefined,
  fallback = "/profile"
) {
  if (!value) return fallback
  if (!value.startsWith("/")) return fallback
  if (value.startsWith("//")) return fallback
  return value
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export function sanitizeHttpUrl(value: string, fallback: string) {
  try {
    const parsed = new URL(value)
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString()
    }
    return fallback
  } catch {
    return fallback
  }
}
