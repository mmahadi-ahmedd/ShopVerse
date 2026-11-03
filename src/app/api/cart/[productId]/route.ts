import { NextResponse } from "next/server";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { updateCartQuantity, removeFromCart } from "@/services/cart.service";

type Ctx = { params: Promise<{ productId: string }> };

export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const s = await requireRole("user");
  return NextResponse.json(await updateCartQuantity(s.sub, (await params).productId, await req.json()));
});

export const DELETE = route(async (_r: Request, { params }: Ctx) => {
  const s = await requireRole("user");
  return NextResponse.json(await removeFromCart(s.sub, (await params).productId));
});