import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getUserOrderDetails(orderId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect("/signin");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: session.user.id },
    include: {
      address: true,
      orderItems: {
        include: {
          product: {
            include: {
              category: true,
              images: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return redirect("/");
  }

  return {
    ...order,
    orderItems: order.orderItems.map((item) => ({
      ...item,
      product: serializeProduct(item.product),
    })),
  };
}

export async function getUserOrders(cursor?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect("/signin");
  }

  const ITEMS_PER_PAGE = 10;

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: ITEMS_PER_PAGE + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });

  const hasMore = orders.length > ITEMS_PER_PAGE;
  const items = hasMore ? orders.slice(0, -1) : orders;
  const nextCursor = hasMore ? orders[ITEMS_PER_PAGE - 1].id : undefined;

  const serializedItems = items.map((order) => ({
    ...order,
    orderItems: order.orderItems.map((item) => ({
      ...item,
      product: serializeProduct(item.product),
    })),
  }));

  return {
    items: serializedItems,
    nextCursor,
    hasMore,
  };
}

export async function getOrderDetails(orderId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect("/signin");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return redirect("/");
  }

  return order;
}
