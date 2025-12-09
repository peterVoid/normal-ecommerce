"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types";
import { headers } from "next/headers";

export async function addToCart(
  productId: string,
  quantity: number
): Promise<ActionResponse> {
  try {
    let message = "";

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const existingInCart = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!existingInCart) {
      const createdCart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
      });

      await prisma.cartItem.create({
        data: {
          productId,
          cartId: createdCart.id,
          quantity,
        },
      });

      message = "Successfully added to cart";
    } else {
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: existingInCart.id,
          productId,
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: existingItem.quantity + quantity,
          },
        });

        message = "Successfully updated quantity in cart";
      } else {
        await prisma.cartItem.create({
          data: {
            productId,
            cartId: existingInCart.id,
            quantity,
          },
        });

        message = "Successfully added to cart";
      }
    }

    return {
      success: true,
      message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to add to cart",
    };
  }
}
