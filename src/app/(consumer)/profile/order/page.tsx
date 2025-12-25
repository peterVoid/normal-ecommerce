import { getUserOrders } from "@/dal/getOrders";
import { OrderList } from "@/features/orders/components/order-list";
import { Prisma } from "@/generated/prisma/client";

export type OrderWithOrderItem = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        product: {
          include: {
            images: true;
          };
        };
      };
    };
  };
}>;

export default async function OrderPage() {
  const { items: orders, nextCursor, hasMore } = await getUserOrders();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          My Orders
        </h1>
        <p className="text-muted-foreground font-bold">
          See your purchase history nicely here.
        </p>
      </div>

      <OrderList
        initialOrders={orders}
        initialCursor={nextCursor}
        initialHasMore={hasMore}
      />
    </div>
  );
}
