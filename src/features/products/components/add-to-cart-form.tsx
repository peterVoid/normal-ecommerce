"use client";

import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/wishlist-button";
import {
  addToCart,
  updateCartItemQuantity,
} from "@/features/carts/actions/action";
import { useCartItem } from "@/hooks/use-cart-item";
import { Minus, Plus, Share2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

interface AddToCartFormProps {
  productId: string;
  stock: number;
  isWishlist: boolean;
}

export function AddToCartForm({
  productId,
  stock,
  isWishlist,
}: AddToCartFormProps) {
  const { cartItems } = useCartItem();
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  const increment = () => {
    if (quantity < stock) setQuantity((q) => q + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCart = () => {
    const currentCartItem = cartItems.find(
      (cartItem) => cartItem.productId === productId
    );

    startTransition(async () => {
      if (currentCartItem) {
        await updateCartItemQuantity(
          currentCartItem.id,
          currentCartItem.quantity + quantity
        );
      } else {
        await addToCart(productId, quantity);
      }
    });
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-bold uppercase tracking-wider">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button
              onClick={decrement}
              disabled={quantity <= 1}
              className="flex h-12 w-12 items-center justify-center border-r-2 border-black hover:bg-neutral-100 disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex h-12 w-16 items-center justify-center font-bold text-lg">
              {quantity}
            </div>
            <button
              onClick={increment}
              disabled={quantity >= stock}
              className="flex h-12 w-12 items-center justify-center border-l-2 border-black hover:bg-neutral-100 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm text-neutral-500">
            {stock > 0 ? `${stock} items available` : "Out of stock"}
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          className="flex-1 h-14 text-lg font-black uppercase tracking-wider border-2 border-black bg-cyan-400 text-black hover:bg-cyan-500 hover:translate-y-[-2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={stock === 0 || isPending}
          onClick={handleAddToCart}
        >
          {isPending ? "Adding to cart..." : "Add to Cart"}
        </Button>
        <WishlistButton productId={productId} isWishlist={isWishlist} />
        <button className="flex h-14 w-14 items-center justify-center border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-50 transition-all hover:translate-y-[-2px] active:translate-y-0 active:shadow-none">
          <Share2 className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
