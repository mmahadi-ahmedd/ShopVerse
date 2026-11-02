export function clean<T>(item: Record<string, unknown>): T {
  return Object.fromEntries(
    Object.entries(item).filter(([k]) => !/^(PK|SK|GSI\dPK|GSI\dSK|titleLower)$/.test(k))
  ) as T;
}