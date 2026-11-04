import { ScanCommand, GetCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLE } from "./client";
import { AppError } from "@/utils/errors";
import type { User } from "@/types";
import { clean } from "./util";

export async function createUser(u: User) {
  try {
    await ddb.send(
      new TransactWriteCommand({
        TransactItems: [
          { Put: { TableName: TABLE, Item: { PK: `EMAIL#${u.email}`, SK: "USER", userId: u.id }, ConditionExpression: "attribute_not_exists(PK)" } },
          { Put: { TableName: TABLE, Item: { PK: `USER#${u.id}`, SK: "PROFILE", ...u } } },
        ],
      })
    );
    } catch (e) {
    if (e instanceof Error && e.name === "TransactionCanceledException")
      throw new AppError(409, "Email already registered");
    throw e;
  }
}

export async function listUsers() {
  const items: User[] = [];
  let key: Record<string, unknown> | undefined;
  do {
    const r = await ddb.send(new ScanCommand({
      TableName: TABLE, FilterExpression: "SK = :p",
      ExpressionAttributeValues: { ":p": "PROFILE" }, ExclusiveStartKey: key,
    }));
    items.push(...(r.Items ?? []).map((i) => clean<User>(i)));
    key = r.LastEvaluatedKey;
  } while (key);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getUserById(id: string) {
  const r = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: `USER#${id}`, SK: "PROFILE" } }));
  return r.Item ? clean<User>(r.Item) : null;
}

export async function getUserByEmail(email: string) {
  const r = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: `EMAIL#${email}`, SK: "USER" } }));
  return r.Item ? getUserById(r.Item.userId) : null;
}