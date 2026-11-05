import { GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLE } from "./client";

const KEY = { PK: "CONFIG", SK: "FEATURED_DISCOUNT" };

export async function getFeaturedId() {
  const r = await ddb.send(new GetCommand({ TableName: TABLE, Key: KEY }));
  return (r.Item?.discountId as string | undefined) ?? null;
}

export const setFeaturedId = (discountId: string) =>
  ddb.send(new PutCommand({ TableName: TABLE, Item: { ...KEY, discountId, updatedAt: new Date().toISOString() } }));

export const clearFeatured = () => ddb.send(new DeleteCommand({ TableName: TABLE, Key: KEY }));