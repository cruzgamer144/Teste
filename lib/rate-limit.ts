const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 60;

const store = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(key: string) {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || entry.expiresAt < now) {
    store.set(key, { count: 1, expiresAt: now + WINDOW_MS });
    return { success: true };
  }
  if (entry.count >= MAX_REQUESTS) {
    return { success: false };
  }
  entry.count += 1;
  store.set(key, entry);
  return { success: true };
}
