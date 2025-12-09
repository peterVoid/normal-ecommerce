import { Product } from "@/generated/prisma/client";
import { clsx, type ClassValue } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanSlug(slug: string) {
  return slugify(slug, {
    lower: true,
    strict: true, // remove symbols automatically
    trim: true,
  });
}

export function parseNumberInput(input: string): number | undefined {
  if (input.trim() === "") return undefined;

  const normalized = input.replace(",", ".");

  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) return;

  return parsed;
}

export function serializeProduct(product: any) {
  return {
    ...product,
    price: product.price.toString(),
    weight: product.weight?.toString() ?? null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}
