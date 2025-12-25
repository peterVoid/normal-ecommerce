"use client";

import { OrderStatus } from "@/generated/prisma/enums";
import { useTransition } from "react";
import { updateOrderStatus } from "@/app/(admin)/admin/orders/actions";
import { OrderStatusBadge } from "./order-status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UpdateStatusDropdownProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function UpdateStatusDropdown({
  orderId,
  currentStatus,
}: UpdateStatusDropdownProps) {
  const [isPending, startTransition] = useTransition();

  // Filter out DELIVERED as it might be user controlled, or we could include it but add a warning.
  // Based on request "status arrived/sampai itu biarkan user yang mengubahnya", we hide DELIVERED from quick selection.
  // We also keep the current status in the list even if it is DELIVERED so it displays correctly,
  // but we don't allow selecting it again if it's not the current one (logic below simplifies to showing allowed next states).

  const allowedStatuses = Object.values(OrderStatus).filter(
    (status) => status !== "DELIVERED"
  );

  const handleStatusUpdate = (status: OrderStatus) => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status);
      if (result.success) {
        toast.success(`Order status updated to ${status}`);
      } else {
        toast.error("Failed to update status");
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <OrderStatusBadge status={currentStatus} className="border-0 p-0" />
          )}
          <ChevronDown className="size-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(allowedStatuses as OrderStatus[]).map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusUpdate(status)}
            disabled={status === currentStatus}
            className="flex items-center gap-2"
          >
            <OrderStatusBadge status={status} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
