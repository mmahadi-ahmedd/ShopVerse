import { NextResponse } from "next/server";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { getWishlist, addToWishlist } from "@/services/cart.service";

export const GET = route(async () => NextResponse.json(await getWishlist((await requireRole("user")).sub)));

export const POST = route(async (req: Request) => {
  const s = await requireRole("user");
  return NextResponse.json(await addToWishlist(s.sub, await req.json()), { status: 201 });
});