import { NextResponse } from "next/server";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { createDiscount, listDiscountsFor } from "@/services/discount.service";

export const GET = route(async () => {
  const s = await requireRole("seller", "admin");
  return NextResponse.json({ items: await listDiscountsFor(s) });
});

export const POST = route(async (req: Request) => {
  const s = await requireRole("seller", "admin");
  return NextResponse.json(await createDiscount(s, await req.json()), { status: 201 });
});