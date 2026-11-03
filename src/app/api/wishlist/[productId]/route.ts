import { NextResponse } from "next/server";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { removeFromWishlist } from "@/services/cart.service";

export const DELETE = route(async (_r: Request, { params }: { params: Promise<{ productId: string }> }) => {
  const s = await requireRole("user");
  return NextResponse.json(await removeFromWishlist(s.sub, (await params).productId));
});