import { NextResponse } from "next/server";
import { route, AppError } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { getUserById } from "@/lib/db/users";
import { startCheckout } from "@/services/order.service";

export const POST = route(async (req: Request) => {
  const s = await requireRole("user");
  const user = await getUserById(s.sub);
  if (!user) throw new AppError(401, "Not authenticated");
  return NextResponse.json(await startCheckout({ id: user.id, email: user.email }, await req.json()));
});