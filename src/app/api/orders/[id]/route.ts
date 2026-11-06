import { NextResponse } from "next/server";
import { z } from "zod";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { updateOrderStatus } from "@/services/order.service";

export const PATCH = route(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await requireRole("admin");
  const { status } = z.object({ status: z.enum(["processing", "shipped", "delivered"]) }).parse(await req.json());
  await updateOrderStatus((await params).id, status);
  return NextResponse.json({ ok: true });
});