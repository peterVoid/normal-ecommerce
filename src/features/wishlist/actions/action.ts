"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function updateWishlist(
  productId: string
): Promise<ActionResponse> {
  try {
    let message = "";

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const existingWishlist = await prisma.wishlist.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    if (existingWishlist) {
      await prisma.wishlist.delete({
        where: {
          id: existingWishlist.id,
        },
      });
      message = "Product removed from wishlist";
    } else {
      await prisma.wishlist.create({
        data: {
          userId: session.user.id,
          productId,
        },
      });
      message = "Product added to wishlist";
    }

    revalidatePath(`/product/${productId}`);

    return {
      success: true,
      message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update wishlist",
    };
  }
}
