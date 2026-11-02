import { NextResponse } from "next/server";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { getProductDetail, updateProduct, deleteProduct } from "@/services/catalog.service";

type Ctx = { params: Promise<{ id: string }> };

export const GET = route(async (_r: Request, { params }: Ctx) =>
  NextResponse.json(await getProductDetail((await params).id)));

export const PUT = route(async (req: Request, { params }: Ctx) => {
  const s = await requireRole("seller", "admin");
  return NextResponse.json(await updateProduct(s, (await params).id, await req.json()));
});

export const DELETE = route(async (_r: Request, { params }: Ctx) => {
  const s = await requireRole("seller", "admin");
  await deleteProduct(s, (await params).id);
  return NextResponse.json({ ok: true });
});