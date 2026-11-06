import { GetCommand, QueryCommand, TransactWriteCommand, BatchGetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLE } from "./client";
import { clean } from "./util";
import type { Order, OrderLine, OrderStatus } from "@/types";

export interface SellerGroup { orderId: string; sellerId: string; items: OrderLine[]; subtotal: number; createdAt: string }
const round = (n: number) => Math.round(n * 100) / 100;
const META = (id: string) => ({ PK: `ORDER#${id}`, SK: "META" });

export async function createOrder(order: Order) {
  const groups = new Map<string, OrderLine[]>();
  for (const i of order.items) groups.set(i.sellerId, [...(groups.get(i.sellerId) ?? []), i]);
  await ddb.send(new TransactWriteCommand({
    TransactItems: [
      { Put: { TableName: TABLE, Item: {
        ...META(order.id), GSI1PK: "ORDERS", GSI1SK: order.createdAt,
        GSI2PK: `USERORD#${order.userId}`, GSI2SK: order.createdAt, ...order } } },
      ...[...groups].map(([sellerId, items]) => ({ Put: { TableName: TABLE, Item: {
        PK: `ORDER#${order.id}`, SK: `SELLER#${sellerId}`, GSI3PK: `SELLERORD#${sellerId}`, GSI3SK: order.createdAt,
        orderId: order.id, sellerId, items, createdAt: order.createdAt,
        subtotal: round(items.reduce((n, i) => n + i.price * i.quantity, 0)) } } })),
    ],
  }));
}

export async function getOrder(id: string) {
  const r = await ddb.send(new GetCommand({ TableName: TABLE, Key: META(id) }));
  return r.Item ? clean<Order>(r.Item) : null;
}

export async function getOrdersByIds(ids: string[]) {
  const unique = [...new Set(ids)].slice(0, 100);
  if (!unique.length) return [];
  const r = await ddb.send(new BatchGetCommand({ RequestItems: { [TABLE]: { Keys: unique.map(META) } } }));
  return (r.Responses?.[TABLE] ?? []).map((i) => clean<Order>(i));
}

async function queryOrders(index: "GSI1" | "GSI2", pk: string) {
  const items: Order[] = [];
  let key: Record<string, unknown> | undefined;
  do {
    const r = await ddb.send(new QueryCommand({
      TableName: TABLE, IndexName: index, ScanIndexForward: false,
      KeyConditionExpression: `${index}PK = :pk`, ExpressionAttributeValues: { ":pk": pk }, ExclusiveStartKey: key,
    }));
    items.push(...(r.Items ?? []).map((i) => clean<Order>(i)));
    key = r.LastEvaluatedKey;
  } while (key);
  return items;
}

export const listAllOrders = () => queryOrders("GSI1", "ORDERS");
export const listUserOrders = (userId: string) => queryOrders("GSI2", `USERORD#${userId}`);

export async function listSellerGroups(sellerId: string) {
  const r = await ddb.send(new QueryCommand({
    TableName: TABLE, IndexName: "GSI3", ScanIndexForward: false, Limit: 100,
    KeyConditionExpression: "GSI3PK = :pk", ExpressionAttributeValues: { ":pk": `SELLERORD#${sellerId}` },
  }));
  return (r.Items ?? []).map((i) => clean<SellerGroup>(i));
}

export const setOrderStatus = (id: string, status: OrderStatus) =>
  ddb.send(new UpdateCommand({
    TableName: TABLE, Key: META(id), UpdateExpression: "SET #s = :s",
    ConditionExpression: "attribute_exists(PK)",
    ExpressionAttributeNames: { "#s": "status" }, ExpressionAttributeValues: { ":s": status },
  }));

export const setStripeSession = (id: string, sessionId: string) =>
  ddb.send(new UpdateCommand({
    TableName: TABLE, Key: META(id), UpdateExpression: "SET stripeSessionId = :s",
    ExpressionAttributeValues: { ":s": sessionId },
  }));

/** Atomically: pending_payment -> paid AND decrement stock for every line (fails if any stock is short). */
export const payOrder = (order: Order) =>
  ddb.send(new TransactWriteCommand({
    TransactItems: [
      { Update: {
        TableName: TABLE, Key: META(order.id),
        UpdateExpression: "SET #s = :paid, paidAt = :t", ConditionExpression: "#s = :pending",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: { ":paid": "paid", ":pending": "pending_payment", ":t": new Date().toISOString() },
      } },
      ...order.items.map((i) => ({ Update: {
        TableName: TABLE, Key: { PK: `PRODUCT#${i.productId}`, SK: "META" },
        UpdateExpression: "SET stock = stock - :q", ConditionExpression: "stock >= :q",
        ExpressionAttributeValues: { ":q": i.quantity },
      } })),
    ],
  }));