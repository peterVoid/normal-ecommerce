"use server";

import { ITEMS_PER_PAGE } from "@/constants";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { ProductWithImages } from "@/types";

export async function getProductsByCategoryAction(
  slug: string,
  cursor?: string,
  q?: string
) {
  try {
    const isValidQ = q && q.trim() !== "" && typeof q === "string";

    const products = await prisma.product.findMany({
      where: {
        category: { slug },
        ...(isValidQ && { name: { contains: q, mode: "insensitive" } }),
      },
      include: {
        images: true,
      },
      take: ITEMS_PER_PAGE + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: {
        createdAt: "desc",
      },
    });

    const hasMore = products.length > ITEMS_PER_PAGE;
    const items = hasMore ? products.slice(0, -1) : products;
    const nextCursor =
      items.length > 0 ? items[items.length - 1].id : undefined;

    const serializedProducts: ProductWithImages[] = items.map((product) =>
      serializeProduct(product)
    );

    return {
      success: true,
      data: {
        products: serializedProducts,
        hasMore,
        nextCursor,
      },
    };
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return {
      success: false,
      message: "Failed to fetch products",
      data: {
        products: [],
        hasMore: false,
        nextCursor: undefined,
      },
    };
  }
}
