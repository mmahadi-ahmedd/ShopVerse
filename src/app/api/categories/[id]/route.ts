import { NextResponse } from "next/server";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { removeCategory } from "@/services/catalog.service";

export const DELETE = route(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await requireRole("admin");
  await removeCategory((await params).id);
  return NextResponse.json({ ok: true });
});