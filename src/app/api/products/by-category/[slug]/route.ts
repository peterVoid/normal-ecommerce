import { ITEMS_PER_PAGE } from "@/constants";
import { getPublicCategoryBySlug } from "@/dal/getCategories";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;

    const cursor = searchParams.get("cursor") || undefined;
    const validCursor = typeof cursor === "string" && cursor !== "undefined";

    const q = decodeURIComponent(searchParams.get("q") || "");
    const validQ = typeof q === "string" && q !== "";

    const minPrice = searchParams.get("minPrice") || undefined;
    const validMinPrice =
      typeof minPrice === "string" && minPrice !== "undefined";

    const maxPrice = searchParams.get("maxPrice") || undefined;
    const validMaxPrice =
      typeof maxPrice === "string" && maxPrice !== "undefined";

    const availability = searchParams.get("availability") || undefined;
    const validAvailability =
      typeof availability === "string" && availability !== "undefined";

    const category = await getPublicCategoryBySlug(slug);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        category: { slug },
        ...(validQ && {
          name: {
            contains: q,
            mode: "insensitive",
          },
        }),
        ...(validMinPrice || validMaxPrice
          ? {
              price: {
                ...(validMinPrice && {
                  gte: new Prisma.Decimal(minPrice),
                }),
                ...(validMaxPrice && {
                  lte: new Prisma.Decimal(maxPrice),
                }),
              },
            }
          : undefined),
        ...(validAvailability && availability === "in_stock"
          ? {
              stock: {
                gte: 1,
              },
            }
          : availability === "out_of_stock"
          ? {
              stock: {
                equals: 0,
              },
            }
          : undefined),
      },
      include: {
        images: true,
      },
      take: ITEMS_PER_PAGE + 1,
      ...(validCursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: {
        createdAt: "desc",
      },
    });

    const hasMore = products.length > ITEMS_PER_PAGE;
    const items = hasMore ? products.slice(0, ITEMS_PER_PAGE) : products;
    const nextCursor = hasMore ? products[ITEMS_PER_PAGE - 1].id : undefined;

    const serializedProducts = items.map((product) =>
      serializeProduct(product)
    );

    const data = {
      products: serializedProducts,
      hasMore,
      nextCursor,
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
