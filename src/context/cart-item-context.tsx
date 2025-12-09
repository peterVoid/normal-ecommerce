"use client";

import { CartItemContext } from "@/hooks/use-cart-item";
import { CartItemType } from "@/types";
import { useState } from "react";

export interface CartItemContextType {
  cartItems: CartItemType[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemType[]>>;
  incrementQuantity: (cartItemId: string) => void;
  decrementQuantity: (cartItemId: string) => void;
}

export function CartItemContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const incrementQuantity = (cartItemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (cartItemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  return (
    <CartItemContext.Provider
      value={{
        cartItems,
        setCartItems,
        incrementQuantity,
        decrementQuantity,
      }}
    >
      {children}
    </CartItemContext.Provider>
  );
}
