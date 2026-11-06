import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE } from "@/lib/auth";

const GUARDS: Record<string, string> = { "/admin": "admin", "/seller": "seller", "/dashboard": "user" };
const HOME: Record<string, string> = { admin: "/admin", seller: "/seller", user: "/dashboard" };

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await verifyToken(req.cookies.get(COOKIE)?.value);
  const guard = Object.keys(GUARDS).find((p) => pathname.startsWith(p));

  if (guard) {
    if (!session) return NextResponse.redirect(new URL("/login", req.url));
    if (session.role !== GUARDS[guard]) return NextResponse.redirect(new URL(HOME[session.role], req.url));
  }
  if (session && (pathname === "/login" || pathname === "/register"))
    return NextResponse.redirect(new URL(HOME[session.role], req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/seller/:path*", "/dashboard/:path*", "/login", "/register"] };