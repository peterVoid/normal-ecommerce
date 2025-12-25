"use server";

import { getUserOrders } from "@/dal/getOrders";

export async function getUserOrdersAction(cursor?: string) {
  return getUserOrders(cursor);
}
