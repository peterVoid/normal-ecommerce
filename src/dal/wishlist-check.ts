import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function checkWishlist(productId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return false;

  const wishlist = await prisma.wishlist.findUnique({
    where: {
      wishlist_unique: {
        productId,
        userId: session.user.id,
      },
    },
  });

  return !!wishlist;
}
