import { NextResponse } from "next/server";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { removeDiscount } from "@/services/discount.service";

export const DELETE = route(async (_r: Request, { params }: { params: Promise<{ id: string }> }) => {
  const s = await requireRole("seller", "admin");
  await removeDiscount(s, (await params).id);
  return NextResponse.json({ ok: true });
});