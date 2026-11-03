import { NextResponse } from "next/server";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { getCart, addToCart } from "@/services/cart.service";

export const GET = route(async () => NextResponse.json(await getCart((await requireRole("user")).sub)));

export const POST = route(async (req: Request) => {
  const s = await requireRole("user");
  return NextResponse.json(await addToCart(s.sub, await req.json()), { status: 201 });
});