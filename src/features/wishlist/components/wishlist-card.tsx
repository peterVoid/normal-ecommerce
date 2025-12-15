"use client";

import { addToCart } from "@/features/carts/actions/action";
import { updateWishlist } from "@/features/wishlist/actions/action";
import {
  Category,
  Image as PrismaImage,
  Product,
  Wishlist,
} from "@/generated/prisma/client";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export type WishlistItemExtended = Wishlist & {
  product: Product & {
    images: PrismaImage[];
    category: Category;
  };
};

interface WishlistCardProps {
  item: WishlistItemExtended;
  onRemove: (id: string) => void;
}

export function WishlistCard({ item, onRemove }: WishlistCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isRemoving, startRemoving] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const { message, success } = await addToCart(item.product.id, 1);
      if (!success) {
        toast.error(message);
      } else {
        toast.success(message);
      }
    });
  };

  const handleRemove = async () => {
    startRemoving(async () => {
      const { success, message } = await updateWishlist(item.product.id);
      if (success) {
        onRemove(item.id);
        toast.success(message);
      } else {
        toast.error(message);
      }
    });
  };

  return (
    <div className="group relative flex flex-col h-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="bg-yellow-400 border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {item.product.category.name}
        </div>
      </div>

      <Button
        onClick={(e) => {
          e.preventDefault();
          handleRemove();
        }}
        disabled={isRemoving}
        size="icon"
        className="absolute top-4 right-4 z-20 h-10 w-10 border-2 border-black bg-white text-black hover:bg-red-500 hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
      >
        <Trash2 className="h-5 w-5" />
      </Button>

      <Link
        href={`/product/${item.product.slug}`}
        className="block relative aspect-square border-b-4 border-black overflow-hidden bg-gray-100"
      >
        {item.product.images?.[0] ? (
          <Image
            src={item.product.images[0].src}
            alt={item.product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase">
            No Image
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-grow p-5 space-y-4">
        <Link
          href={`/product/${item.product.slug}`}
          className="block space-y-1"
        >
          <h3 className="font-black text-2xl uppercase leading-tight line-clamp-2 hover:underline decoration-4 underline-offset-4 decoration-yellow-400">
            {item.product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-300 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-500 uppercase">
              Price
            </span>
            <span className="text-xl font-black bg-black text-white px-2 py-0.5 transform -rotate-2 inline-block">
              {formatRupiah(item.product.price.toString())}
            </span>
          </div>
        </div>

        <Button
          className={cn(
            "w-full h-12 border-2 border-black font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2",
            "bg-purple-500 text-white hover:bg-purple-600"
          )}
          onClick={handleAddToCart}
          disabled={isPending}
        >
          <ShoppingCart className="h-5 w-5" />
          {isPending ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
