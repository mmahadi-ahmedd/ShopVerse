import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AppError } from "@/utils/errors";
import type { Role } from "@/types";

export const COOKIE = "token";
const key = () => new TextEncoder().encode(process.env.JWT_SECRET);

export type Session = { sub: string; role: Role };

export const signToken = (s: Session) =>
  new SignJWT({ role: s.role }).setSubject(s.sub).setIssuedAt().setExpirationTime("7d").setProtectedHeader({ alg: "HS256" }).sign(key());

export async function verifyToken(token?: string): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return { sub: payload.sub!, role: payload.role as Role };
  } catch {
    return null;
  }
}

export async function getSession() {
  return verifyToken((await cookies()).get(COOKIE)?.value);
}

export async function requireRole(...roles: Role[]) {
  const s = await getSession();
  if (!s) throw new AppError(401, "Not authenticated");
  if (roles.length && !roles.includes(s.role)) throw new AppError(403, "Forbidden");
  return s;
}