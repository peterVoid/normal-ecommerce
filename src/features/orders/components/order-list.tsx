"use client";

import { OrderWithOrderItem } from "@/app/(consumer)/profile/order/page";
import { motion, useInView } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getUserOrdersAction } from "../actions/action";
import { OrderCard } from "./order-card";

interface OrderListProps {
  initialOrders: OrderWithOrderItem[];
  initialCursor?: string;
  initialHasMore: boolean;
}

export function OrderList({
  initialOrders,
  initialCursor,
  initialHasMore,
}: OrderListProps) {
  const [orders, setOrders] = useState<OrderWithOrderItem[]>(initialOrders);
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(loadMoreRef, {
    margin: "0px 0px 400px 0px",
  });

  const handleLoadMore = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const { items, nextCursor, hasMore } = await getUserOrdersAction(cursor);
      setOrders((prev) => [...prev, ...items]);
      setCursor(nextCursor);
      setHasMore(hasMore);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, isLoading]);

  useEffect(() => {
    if (isInView && hasMore && !isLoading) {
      handleLoadMore();
    }
  }, [isInView, hasMore, isLoading, handleLoadMore]);

  if (orders.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
        <div className="w-40 h-40 bg-gray-100 border-4 border-black rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-6xl">📦</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tight">
            No Orders Yet
          </h2>
          <p className="text-muted-foreground font-medium max-w-sm mx-auto">
            It looks like you haven't bought anything cool yet. Start shopping!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {orders.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <OrderCard order={order} />
        </motion.div>
      ))}

      <div ref={loadMoreRef} className="h-4 -mt-4 pointer-events-none" />

      {hasMore && (
        <div className="flex justify-center py-12">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
            <Loader2 className="w-6 h-6 animate-spin stroke-[3px]" />
            <span className="font-black uppercase tracking-widest text-sm">
              Loading More Orders...
            </span>
          </div>
        </div>
      )}

      {!hasMore && orders.length > 0 && (
        <div className="text-center py-12 border-t-4 border-black border-dashed">
          <p className="font-black uppercase text-xl italic text-neutral-400">
            You've reached the end of your orders
          </p>
        </div>
      )}
    </div>
  );
}
