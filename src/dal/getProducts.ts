import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getProductByKey(key: string) {
  const products = await prisma.product.findFirst({
    where: {
      OR: [
        {
          id: key,
        },
        {
          slug: key,
        },
      ],
    },
    include: {
      category: true,
      images: true,
    },
  });

  const serializedProducts = serializeProduct(products);

  return serializedProducts;
}

export async function getProducts({
  take,
  skip,
}: {
  take: number;
  skip: number;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect("/signin");
  }

  const products = await prisma.product.findMany({
    take,
    skip,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      images: {
        select: {
          id: true,
          key: true,
          alt: true,
          src: true,
        },
      },
    },
  });

  const total = await prisma.product.count();

  const serializedProducts = products.map((product) => ({
    ...product,
    ...serializeProduct(product),
  }));

  return {
    data: serializedProducts,
    metadata: {
      hasNextPage: take + skip < total,
      totalPages: Math.ceil(total / take),
    },
  };
}

export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string,
  limit: number = 4
) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: {
        not: currentProductId,
      },
      isActive: true,
    },
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      images: {
        select: {
          id: true,
          key: true,
          alt: true,
          src: true,
          isMain: true,
        },
      },
    },
  });

  const serializedProducts = products.map((product) => ({
    ...product,
    ...serializeProduct(product),
  }));

  return serializedProducts;
}
