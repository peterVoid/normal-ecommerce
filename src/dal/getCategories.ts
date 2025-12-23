import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type GetCategoriesType = Awaited<ReturnType<typeof getCategories>>;

export async function getCategories({
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
    redirect("/signin");
  }

  const categories = await prisma.category.findMany({
    take,
    skip,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      image: true,
      products: true,
    },
  });

  const total = await prisma.category.count();

  const serialiseCategoryProducts = categories.map((category) => ({
    ...category,
    products: category.products.map((product) => serializeProduct(product)),
  }));

  return {
    data: serialiseCategoryProducts,
    metadata: {
      hasNextPage: take + skip < total,
      totalPages: Math.ceil(total / take),
    },
  };
}

export async function getProductCategories() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
}

export async function getPublicCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
}

export async function getPublicCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  return category;
}
