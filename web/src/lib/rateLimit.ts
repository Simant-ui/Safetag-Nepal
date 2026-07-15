interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Best-effort in-memory sliding-window limiter — resets per cold start and isn't shared across
 * concurrent serverless instances, unlike Express's version. Good enough for this project's
 * current scale; swap for a Redis/Upstash-backed limiter if real abuse traffic shows up.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}
