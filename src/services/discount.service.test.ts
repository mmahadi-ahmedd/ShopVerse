import { describe, it, expect } from "vitest";
import { finalPrice, statusOf } from "./discount.service";
import { slugify } from "@/utils/slug";
import type { Discount } from "@/types";

const make = (startsAt: string, endsAt: string): Discount =>
  ({ id: "1", sellerId: "s", productId: "p", percent: 20, image: "x", startsAt, endsAt, createdAt: startsAt });
const now = Date.parse("2026-11-06T12:00:00Z");

describe("finalPrice", () => {
  it("applies the percentage and rounds to cents", () => {
    expect(finalPrice(19.99, 10)).toBe(17.99);
    expect(finalPrice(100, 25)).toBe(75);
  });
});

describe("statusOf", () => {
  it("is upcoming before the start", () => expect(statusOf(make("2026-11-07T00:00:00Z", "2026-11-08T00:00:00Z"), now)).toBe("upcoming"));
  it("is active between start and end", () => expect(statusOf(make("2026-11-06T00:00:00Z", "2026-11-07T00:00:00Z"), now)).toBe("active"));
  it("is ended after the end", () => expect(statusOf(make("2026-11-04T00:00:00Z", "2026-11-05T00:00:00Z"), now)).toBe("ended"));
});

describe("slugify", () => {
  it("makes url-safe slugs", () => expect(slugify("  Wireless Mouse (2.4GHz)! ")).toBe("wireless-mouse-2-4ghz"));
});