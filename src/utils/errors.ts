import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export const route =
  <A extends unknown[]>(fn: (...a: A) => Promise<Response>) =>
  async (...args: A) => {
    try {
      return await fn(...args);
    } catch (e) {
      if (e instanceof AppError) return NextResponse.json({ error: e.message }, { status: e.status });
      if (e instanceof ZodError) return NextResponse.json({ error: "Validation failed", details: e.flatten().fieldErrors }, { status: 400 });
      console.error(e);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };