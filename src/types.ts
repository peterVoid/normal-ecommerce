import { Category, Image, Prisma } from "./generated/prisma/client";

export type ActionResponse = {
  success: boolean;
  message: string;
  data?: string;
};

export type PageProps = {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Serialized product type for Client Components (Decimal -> string, Date -> string)
export type SerializedProduct = Omit<
  Prisma.ProductGetPayload<{
    include: {
      category: {
        select: {
          name: true;
        };
      };
      images: {
        select: {
          alt: true;
          src: true;
        };
        take: 1;
      };
    };
  }>,
  "price" | "weight" | "createdAt" | "updatedAt"
> & {
  price: string;
  weight: string | null;
  createdAt: string;
  updatedAt: string;
};

export interface ProductTableProps {
  products: SerializedProduct[];
  skip: number;
}

export interface ProductEditProps {
  product: Omit<SerializedProduct, "images" | "category"> & {
    images: Image[];
    category: Category;
  };
}
