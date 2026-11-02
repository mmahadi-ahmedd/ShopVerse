import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const gsi = (n: number) => ({
  IndexName: `GSI${n}`,
  KeySchema: [
    { AttributeName: `GSI${n}PK`, KeyType: "HASH" as const },
    { AttributeName: `GSI${n}SK`, KeyType: "RANGE" as const },
  ],
  Projection: { ProjectionType: "ALL" as const },
});

(async () => {
  await client.send(
    new CreateTableCommand({
      TableName: process.env.DDB_TABLE,
      BillingMode: "PAY_PER_REQUEST",
      AttributeDefinitions: [
        { AttributeName: "PK", AttributeType: "S" },
        { AttributeName: "SK", AttributeType: "S" },
        ...[1, 2, 3].flatMap((n) => [
          { AttributeName: `GSI${n}PK`, AttributeType: "S" as const },
          { AttributeName: `GSI${n}SK`, AttributeType: "S" as const },
        ]),
      ],
      KeySchema: [
        { AttributeName: "PK", KeyType: "HASH" },
        { AttributeName: "SK", KeyType: "RANGE" },
      ],
      GlobalSecondaryIndexes: [gsi(1), gsi(2), gsi(3)],
    })
  );
  console.log("Table created");
})();