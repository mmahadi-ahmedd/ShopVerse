import { PutCommand, GetCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLE } from "./client";
import { clean } from "./util";
import type { Product } from "@/types";

export const putProduct = (p: Product) =>
  ddb.send(new PutCommand({
    TableName: TABLE,
    Item: {
      PK: `PRODUCT#${p.id}`, SK: "META",
      GSI1PK: "PRODUCTS", GSI1SK: p.createdAt,
      GSI2PK: `CAT#${p.categoryId}`, GSI2SK: p.createdAt,
      GSI3PK: `SELLER#${p.sellerId}`, GSI3SK: p.createdAt,
      titleLower: p.title.toLowerCase(), ...p,
    },
  }));

export async function getProduct(id: string) {
  const r = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: `PRODUCT#${id}`, SK: "META" } }));
  return r.Item ? clean<Product>(r.Item) : null;
}

export const deleteProduct = (id: string) =>
  ddb.send(new DeleteCommand({ TableName: TABLE, Key: { PK: `PRODUCT#${id}`, SK: "META" } }));

export interface ProductQuery {
  index: "GSI1" | "GSI2" | "GSI3";
  pk: string; q?: string; min?: number; max?: number; limit: number; cursor?: string;
}

export async function queryProducts(o: ProductQuery) {
  const values: Record<string, unknown> = { ":pk": o.pk };
  const names: Record<string, string> = {};
  const filters: string[] = [];
  if (o.q) { filters.push("contains(titleLower, :q)"); values[":q"] = o.q.toLowerCase(); }
  if (o.min !== undefined) { filters.push("#price >= :min"); values[":min"] = o.min; names["#price"] = "price"; }
  if (o.max !== undefined) { filters.push("#price <= :max"); values[":max"] = o.max; names["#price"] = "price"; }

  let key: Record<string, unknown> | undefined = o.cursor
    ? JSON.parse(Buffer.from(o.cursor, "base64url").toString())
    : undefined;
  const items: Product[] = [];

  do {
    const r = await ddb.send(new QueryCommand({
      TableName: TABLE, IndexName: o.index,
      KeyConditionExpression: `${o.index}PK = :pk`,
      FilterExpression: filters.length ? filters.join(" AND ") : undefined,
      ExpressionAttributeNames: Object.keys(names).length ? names : undefined,
      ExpressionAttributeValues: values,
      ScanIndexForward: false,
      Limit: o.limit - items.length,
      ExclusiveStartKey: key,
    }));
    items.push(...(r.Items ?? []).map((i) => clean<Product>(i)));
    key = r.LastEvaluatedKey;
  } while (items.length < o.limit && key);

  return { items, nextCursor: key ? Buffer.from(JSON.stringify(key)).toString("base64url") : null };
}