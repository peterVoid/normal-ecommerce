import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
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
  });

  const total = await prisma.category.count();

  return {
    data: categories,
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
