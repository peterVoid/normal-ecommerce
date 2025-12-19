"use client";

import { GetAllProductsProps } from "@/app/(consumer)/products/page";
import { FeaturedProductCard } from "@/components/homepage/featured-product-card";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortOption } from "@/constants";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductListingProps {
  products: GetAllProductsProps[];
  totalPages: number;
  currentPage: string;
}

export function ProductListing({
  products,
  currentPage,
  totalPages,
}: ProductListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filteringProducts, setFilteringProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || SortOption.NEWEST
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("sort", sortOption);
    router.push(`?${params.toString()}`);
  }, [sortOption]);

  useEffect(() => {
    const sortedProducts = [...products].sort((a, b) => {
      if (SortOption.NEWEST === sortOption)
        return (
          new Date(`${b.createdAt}`).getTime() -
          new Date(`${a.createdAt}`).getTime()
        );
      if (SortOption.PRICE_ASC === sortOption)
        return Number(a.price.toString()) - Number(b.price.toString());
      if (SortOption.PRICE_DESC === sortOption)
        return Number(b.price.toString()) - Number(a.price.toString());
      return 0;
    });

    setFilteringProducts(sortedProducts);
  }, [sortOption]);

  return (
    <div className="flex flex-col gap-12">
      <div className="sticky top-24 z-30 bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start"></div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="text-sm font-bold uppercase hidden sm:block">
            Showing{" "}
            <span className="text-blue-600">{filteringProducts.length}</span>{" "}
            Products
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-white border-2 border-black font-bold uppercase h-10 gap-2 hover:bg-yellow-400 hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                Sort By: {sortOption.replace("-", " ")}
                <ChevronDownIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-0 mt-1"
            >
              <DropdownMenuItem
                onClick={() => setSortOption(SortOption.NEWEST)}
                className="font-bold uppercase focus:bg-pink-400 focus:text-white rounded-none cursor-pointer p-3 border-b border-gray-100"
              >
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption(SortOption.PRICE_ASC)}
                className="font-bold uppercase focus:bg-pink-400 focus:text-white rounded-none cursor-pointer p-3 border-b border-gray-100"
              >
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption(SortOption.PRICE_DESC)}
                className="font-bold uppercase focus:bg-pink-400 focus:text-white rounded-none cursor-pointer p-3"
              >
                Price: High to Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {filteringProducts.length > 0 ? (
            <motion.div
              key={selectedCategory + sortOption}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteringProducts.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 border-4 border-dashed border-gray-300 bg-gray-50 rounded-lg text-center"
            >
              <h3 className="text-2xl font-black uppercase text-gray-400 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-500">
                Try changing the category or clear filters.
              </p>
              <Button
                onClick={() => setSelectedCategory("all")}
                className="mt-6 border-2 border-black bg-white text-black hover:bg-black hover:text-white"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-8 gap-2">
        <Pagination totalPages={totalPages} page={currentPage} />
      </div>
    </div>
  );
}
