import { NextResponse } from "next/server";
import { COOKIE, signToken } from "./auth";
import { publicUser } from "@/services/auth.service";
import type { User } from "@/types";

export async function authResponse(user: User, status = 200) {
  const res = NextResponse.json({ user: publicUser(user) }, { status });
  res.cookies.set(COOKIE, await signToken({ sub: user.id, role: user.role }), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}