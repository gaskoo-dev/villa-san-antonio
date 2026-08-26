type RateLimitEntry = {
  count: number
  resetAt: number
}

type RateLimitStore = Map<string, RateLimitEntry>

const globalRateLimit = globalThis as typeof globalThis & {
  __vsaRateLimitStore?: RateLimitStore
}

const store = globalRateLimit.__vsaRateLimitStore ?? new Map<string, RateLimitEntry>()
globalRateLimit.__vsaRateLimitStore = store

const MAX_TRACKED_CLIENTS = 5_000

export function consumeRateLimit(
  key: string,
  options: { limit: number; windowMs: number },
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now()

  if (store.size >= MAX_TRACKED_CLIENTS) {
    for (const [storedKey, entry] of store) {
      if (entry.resetAt <= now) store.delete(storedKey)
    }
    if (store.size >= MAX_TRACKED_CLIENTS) {
      store.delete(store.keys().next().value as string)
    }
  }

  const current = store.get(key)
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (current.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    }
  }

  current.count += 1
  return { allowed: true, retryAfterSeconds: 0 }
}
