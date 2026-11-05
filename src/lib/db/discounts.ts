import { PutCommand, GetCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLE } from "./client";
import { clean } from "./util";
import type { Discount } from "@/types";

export const putDiscount = (d: Discount) =>
  ddb.send(new PutCommand({
    TableName: TABLE,
    Item: {
      PK: `DISCOUNT#${d.id}`, SK: "META",
      GSI1PK: "DISCOUNTS", GSI1SK: d.createdAt,
      GSI2PK: `PRODDISC#${d.productId}`, GSI2SK: d.startsAt,
      GSI3PK: `SELLERDISC#${d.sellerId}`, GSI3SK: d.createdAt,
      ...d,
    },
  }));

export async function getDiscount(id: string) {
  const r = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: `DISCOUNT#${id}`, SK: "META" } }));
  return r.Item ? clean<Discount>(r.Item) : null;
}

export const deleteDiscount = (id: string) =>
  ddb.send(new DeleteCommand({ TableName: TABLE, Key: { PK: `DISCOUNT#${id}`, SK: "META" } }));

async function queryAll(index: "GSI1" | "GSI2" | "GSI3", pk: string) {
  const items: Discount[] = [];
  let key: Record<string, unknown> | undefined;
  do {
    const r = await ddb.send(new QueryCommand({
      TableName: TABLE, IndexName: index,
      KeyConditionExpression: `${index}PK = :pk`, ExpressionAttributeValues: { ":pk": pk },
      ExclusiveStartKey: key,
    }));
    items.push(...(r.Items ?? []).map((i) => clean<Discount>(i)));
    key = r.LastEvaluatedKey;
  } while (key);
  return items;
}

export const listAllDiscounts = () => queryAll("GSI1", "DISCOUNTS");
export const listSellerDiscounts = (sellerId: string) => queryAll("GSI3", `SELLERDISC#${sellerId}`);
export const listProductDiscounts = (productId: string) => queryAll("GSI2", `PRODDISC#${productId}`);