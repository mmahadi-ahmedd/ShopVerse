import { PutCommand, QueryCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLE } from "./client";
import { clean } from "./util";
import type { Category } from "@/types";

export const putCategory = (c: Category) =>
  ddb.send(new PutCommand({
    TableName: TABLE,
    Item: { PK: `CATEGORY#${c.id}`, SK: "META", GSI1PK: "CATEGORIES", GSI1SK: c.name.toLowerCase(), ...c },
  }));

export async function getCategory(id: string) {
  const r = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: `CATEGORY#${id}`, SK: "META" } }));
  return r.Item ? clean<Category>(r.Item) : null;
}

export async function listCategories() {
  const r = await ddb.send(new QueryCommand({
    TableName: TABLE, IndexName: "GSI1",
    KeyConditionExpression: "GSI1PK = :p", ExpressionAttributeValues: { ":p": "CATEGORIES" },
  }));
  return (r.Items ?? []).map((i) => clean<Category>(i));
}

export const deleteCategory = (id: string) =>
  ddb.send(new DeleteCommand({ TableName: TABLE, Key: { PK: `CATEGORY#${id}`, SK: "META" } }));