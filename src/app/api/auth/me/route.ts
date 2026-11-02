import { NextResponse } from "next/server";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { getUserById } from "@/lib/db/users";
import { publicUser } from "@/services/auth.service";

export const GET = route(async () => {
  const s = await requireRole();
  const user = await getUserById(s.sub);
  return NextResponse.json({ user: user ? publicUser(user) : null });
});