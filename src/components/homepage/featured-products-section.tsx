import { formatRupiah } from "@/lib/format";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { ProductEditProps } from "@/types";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { FeaturedProductCard } from "./featured-product-card";
import Image from "next/image";

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    take: 6,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: true,
      category: true,
    },
  });

  const serializedProducts = products.map((product) =>
    serializeProduct(product)
  );

  return serializedProducts;
}

export async function FeaturedProductsSection() {
  const products =
    (await getFeaturedProducts()) as ProductEditProps["product"][];

  return (
    <section className="container mx-auto px-7 py-20">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="bg-pink-500 text-white font-bold text-xs px-2 py-1 uppercase w-fit mb-2 border-2 border-black">
            Handpicked
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase leading-[0.9]">
            Featured <br /> Products
          </h2>
        </div>
        <Button
          variant="noShadow"
          className="bg-white border-4 border-black font-bold h-12 px-8 hover:bg-black hover:text-white transition-colors"
        >
          VIEW ALL
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <FeaturedProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
