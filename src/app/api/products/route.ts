import { NextResponse } from "next/server";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { createProduct, listProducts } from "@/services/catalog.service";

export const GET = route(async (req: Request) =>
  NextResponse.json(await listProducts(new URL(req.url).searchParams)));

export const POST = route(async (req: Request) => {
  const s = await requireRole("seller", "admin");
  return NextResponse.json(await createProduct(s, await req.json()), { status: 201 });
});