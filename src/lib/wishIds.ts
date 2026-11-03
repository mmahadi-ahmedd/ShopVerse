import { getSession } from "./auth";
import { listEntries } from "./db/userLists";

export async function getWishIds() {
  const s = await getSession();
  if (s?.role !== "user") return new Set<string>();
  return new Set((await listEntries<{ productId: string }>(s.sub, "WISH")).map((e) => e.productId));
}