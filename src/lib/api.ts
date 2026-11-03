export async function api<T>(url: string, method = "GET", body?: unknown): Promise<T> {
  const r = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const detail = data.details ? (Object.values(data.details).flat()[0] as string) : null;
    throw new Error(detail ?? data.error ?? "Something went wrong");
  }
  return data as T;
}