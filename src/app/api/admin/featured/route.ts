import { NextResponse } from "next/server";
import { z } from "zod";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { setFeatured, unsetFeatured } from "@/services/discount.service";

export const POST = route(async (req: Request) => {
  await requireRole("admin");
  const { discountId } = z.object({ discountId: z.string().min(1) }).parse(await req.json());
  await setFeatured(discountId);
  return NextResponse.json({ ok: true });
});

export const DELETE = route(async () => {
  await requireRole("admin");
  await unsetFeatured();
  return NextResponse.json({ ok: true });
});