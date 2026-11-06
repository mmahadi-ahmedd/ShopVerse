import { NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { route } from "@/utils/errors";
import { ddb, TABLE } from "@/lib/db/client";

export const POST = route(async (req: Request) => {
  const { email } = z.object({ email: z.string().trim().toLowerCase().email() }).parse(await req.json());
  await ddb.send(new PutCommand({
    TableName: TABLE,
    Item: { PK: `NEWSLETTER#${email}`, SK: "SUB", email, createdAt: new Date().toISOString() },
  }));
  return NextResponse.json({ ok: true }, { status: 201 });
});