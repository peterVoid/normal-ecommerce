"use client";

import { Button } from "@/components/ui/button";
import { useCartItem } from "@/hooks/use-cart-item";
import { formatRupiah } from "@/lib/format";
import { CartItemType } from "@/types";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { setCartItems, incrementQuantity, decrementQuantity } = useCartItem();
  const [currentItem, setCurrentItem] = useState(item);

  useEffect(() => {
    setCartItems((prev) => [...prev, currentItem]);
  }, []);

  const handleIncrementQuantity = () => {
    incrementQuantity(currentItem.id);
    setCurrentItem((prev) => ({
      ...prev,
      quantity: prev.quantity + 1,
    }));
  };

  const handleDecrementQuantity = () => {
    if (currentItem.quantity <= 1) return;

    decrementQuantity(currentItem.id);
    setCurrentItem((prev) => ({
      ...prev,
      quantity: prev.quantity - 1,
    }));
  };

  return (
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 border-2 border-border bg-white p-4 shadow-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_var(--border)] transition-all">
      <div className="relative aspect-square w-full sm:w-24 shrink-0 overflow-hidden border-2 border-border">
        <Image
          src={item.product.images[0]?.src}
          alt={item.product.name}
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 w-full">
        <div className="flex justify-between items-start w-full">
          <h3 className="font-heading text-lg sm:text-xl line-clamp-2">
            {item.product.name}
          </h3>
          <button className="text-muted-foreground hover:text-red-500 transition-colors sm:hidden">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <p className="text-lg font-bold">{formatRupiah(item.product.price)}</p>

        <div className="mt-2 flex items-center justify-between sm:justify-start gap-6">
          <div className="flex items-center gap-4 bg-background border-2 border-border p-1">
            <Button
              disabled={currentItem.quantity <= 1}
              className="p-1 hover:bg-muted disabled:opacity-50 transition-colors size-8"
              onClick={handleDecrementQuantity}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-4 text-center font-bold">
              {currentItem.quantity}
            </span>
            <Button
              className="p-1 hover:bg-muted transition-colors size-8"
              onClick={handleIncrementQuantity}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <button
            className="hidden sm:block p-2 hover:bg-red-100 text-muted-foreground hover:text-red-500 border-2 border-transparent hover:border-border transition-all"
            title="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
