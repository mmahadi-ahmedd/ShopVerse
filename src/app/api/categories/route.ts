import { NextResponse } from "next/server";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { listCategories } from "@/lib/db/categories";
import { createCategory } from "@/services/catalog.service";

export const GET = route(async () => NextResponse.json({ items: await listCategories() }));

export const POST = route(async (req: Request) => {
  await requireRole("admin");
  return NextResponse.json(await createCategory(await req.json()), { status: 201 });
});