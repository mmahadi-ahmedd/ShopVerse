import { NextResponse } from "next/server";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { listSellerProducts } from "@/services/catalog.service";

export const GET = route(async (req: Request) => {
  const s = await requireRole("seller", "admin");
  return NextResponse.json(await listSellerProducts(s, new URL(req.url).searchParams));
});