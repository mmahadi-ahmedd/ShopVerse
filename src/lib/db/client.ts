import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const g = globalThis as unknown as { ddb?: DynamoDBDocumentClient };

export const ddb =
  g.ddb ??
  DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION }), {
    marshallOptions: { removeUndefinedValues: true },
  });
if (process.env.NODE_ENV !== "production") g.ddb = ddb;

export const TABLE = process.env.DDB_TABLE!;