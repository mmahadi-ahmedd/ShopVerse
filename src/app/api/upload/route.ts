import { NextResponse } from "next/server";
import { z } from "zod";
import { route } from "@/utils/errors";
import { requireRole } from "@/lib/auth";
import { createUploadUrl, EXT, MAX_SIZE } from "@/lib/s3";

const schema = z.object({
  contentType: z.string().refine((t) => t in EXT, "Only JPEG, PNG or WebP allowed"),
  size: z.number().int().positive().max(MAX_SIZE, "Max file size is 5MB"),
});

export const POST = route(async (req: Request) => {
  const s = await requireRole("seller", "admin");
  const { contentType, size } = schema.parse(await req.json());
  return NextResponse.json(await createUploadUrl(s.sub, contentType, size));
});