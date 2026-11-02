import { NextResponse } from "next/server";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { deleteCategory } from "@/lib/db/categories";

export const DELETE = route(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await requireRole("admin");
  await deleteCategory((await params).id);
  return NextResponse.json({ ok: true });
});