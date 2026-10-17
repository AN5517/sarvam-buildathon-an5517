export const BASE_URL = process.env.SARVAM_BASE_URL || "https://api.sarvam.ai";

export function getKey(): string | null {
  const k = (process.env.SARVAM_API_KEY || "").trim();
  if (!k || k.startsWith("your_")) return null;
  return k;
}

export const hasKey = () => getKey() !== null;

export async function sarvamFetch(path: string, init: RequestInit): Promise<Response> {
  const key = getKey();
  if (!key) throw new Error("SARVAM_API_KEY not set");
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { ...(init.headers || {}), "api-subscription-key": key },
  });
  if (!res.ok) {
    // Never include headers/keys in errors; body only.
    const body = (await res.text()).slice(0, 300);
    throw new Error(`Sarvam ${path} failed: ${res.status} ${body}`);
  }
  return res;
}
