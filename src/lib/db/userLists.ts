import { PutCommand, GetCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLE } from "./client";
import { clean } from "./util";

export type Kind = "CART" | "WISH";

export const putEntry = (userId: string, kind: Kind, productId: string, data: Record<string, unknown>, onlyIfNew = false) =>
  ddb.send(new PutCommand({
    TableName: TABLE,
    Item: { PK: `USER#${userId}`, SK: `${kind}#${productId}`, productId, ...data },
    ConditionExpression: onlyIfNew ? "attribute_not_exists(PK)" : undefined,
  }));

export async function getEntry<T>(userId: string, kind: Kind, productId: string) {
  const r = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: `USER#${userId}`, SK: `${kind}#${productId}` } }));
  return r.Item ? clean<T>(r.Item) : null;
}

export async function listEntries<T>(userId: string, kind: Kind) {
  const r = await ddb.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: { ":pk": `USER#${userId}`, ":sk": `${kind}#` },
  }));
  return (r.Items ?? []).map((i) => clean<T>(i));
}

export const deleteEntry = (userId: string, kind: Kind, productId: string) =>
  ddb.send(new DeleteCommand({ TableName: TABLE, Key: { PK: `USER#${userId}`, SK: `${kind}#${productId}` } }));