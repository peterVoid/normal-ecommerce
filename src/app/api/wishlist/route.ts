import { PAGE_SIZE } from "@/constants";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const getCursor = req.nextUrl.searchParams.get("cursor");

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlists = await prisma.wishlist.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          include: {
            images: {
              where: {
                isMain: true,
              },
              take: 1,
            },
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: PAGE_SIZE + 1,
      ...(getCursor &&
        getCursor !== "undefined" && {
          cursor: { id: getCursor },
          skip: 1,
        }),
    });

    const hasMore = wishlists.length > PAGE_SIZE;

    const items = hasMore ? wishlists.slice(0, -1) : wishlists;

    const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

    return NextResponse.json({ items, cursor: nextCursor, hasMore });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error }, { status: 500 });
  }
}
