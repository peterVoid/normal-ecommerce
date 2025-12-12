import { updateWishlist } from "@/features/wishlist/actions/action";
import { Heart, Loader2Icon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: string;
  isWishlist: boolean;
}

export function WishlistButton({ productId, isWishlist }: WishlistButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleWishlistClick = () => {
    startTransition(async () => {
      const response = await updateWishlist(productId);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
    });
  };

  return (
    <button
      className="flex h-14 w-14 items-center justify-center border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-50 transition-all hover:translate-y-[-2px] active:translate-y-0 active:shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleWishlistClick}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2Icon className="size-6 animate-spin" />
      ) : isWishlist ? (
        <Heart className="h-6 w-6" fill="red" />
      ) : (
        <Heart className="h-6 w-6" />
      )}
    </button>
  );
}
