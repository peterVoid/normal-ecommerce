"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { WishlistCard, WishlistItemExtended } from "./wishlist-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag } from "lucide-react";

export function WishlistContentPage() {
  const [items, setItems] = useState<WishlistItemExtended[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const fetchWishlist = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`/api/wishlist`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.log({ error });
      toast.error("Failed to fetch wishlist");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (isFetching) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="bg-gray-100 p-8 rounded-full border-4 border-black border-dashed">
          <ShoppingBag className="h-16 w-16 text-gray-400" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-3xl font-black uppercase">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 font-medium text-lg">
            Looks like you haven't added any items to your wishlist yet. Explore
            our products and save your favorites!
          </p>
        </div>
        <Link href="/products">
          <Button className="h-14 px-8 text-lg font-bold border-2 border-black bg-black text-white hover:bg-white hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all uppercase">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="border-b-4 border-black pb-6">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
          My Wishlist <span className="text-purple-600">({items.length})</span>
        </h1>
        <p className="mt-2 text-lg font-medium text-gray-600 max-w-2xl">
          Your curated collection of favorites. Grab them before they're gone!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <WishlistCard key={item.id} item={item} onRemove={handleRemoveItem} />
        ))}
      </div>
    </div>
  );
}
