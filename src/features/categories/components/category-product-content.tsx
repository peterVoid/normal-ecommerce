"use client";

import { FeaturedProductCard } from "@/components/homepage/featured-product-card";
import { ProductWithAvailability, ProductWithImages } from "@/types";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getProductsByCategoryAction } from "../actions/action";
import { ListingControls } from "./listing-controls";

interface CategoryProductContentProps {
  minPrice?: string;
  maxPrice?: string;
  searchQuery?: string;
  categorySlug: string;
  categoryName: string;
  availability?: ProductWithAvailability;
}

export function CategoryProductContent({
  minPrice,
  maxPrice,
  categorySlug,
  categoryName,
  searchQuery,
  availability,
}: CategoryProductContentProps) {
  const router = useRouter();

  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef, {
    margin: "0px 0px 400px 0px",
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const url = new URLSearchParams();
        url.set("cursor", nextCursor || "");
        url.set("q", searchQuery || "");
        url.set("minPrice", minPrice || "");
        url.set("maxPrice", maxPrice || "");
        url.set("availability", availability || "");

        const response = await fetch(
          `/api/products/by-category/${categorySlug}?${url.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (data.success && data.data) {
          setProducts(data.data.products);
          setHasMore(data.data.hasMore);
          setNextCursor(data.data.nextCursor);
        }
      } catch (error) {
        console.log({ error });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [searchQuery, minPrice, maxPrice, availability]);

  useEffect(() => {
    if (isInView && hasMore && !isLoading) {
      handleLoadMore();
    }
  }, [isInView, hasMore, isLoading, nextCursor]);

  const handleLoadMore = async () => {
    setIsLoading(true);
    const result = await getProductsByCategoryAction(
      categorySlug,
      nextCursor,
      searchQuery
    );

    if (result.success && result.data) {
      setProducts((prev) => [...prev, ...result.data.products]);
      setHasMore(result.data.hasMore);
      setNextCursor(result.data.nextCursor);
    } else {
      toast.error(result.message || "Failed to load more products");
    }
    setIsLoading(false);
  };

  const handleSearch = async (q: string) => {
    const value = q.trim();

    const params = new URLSearchParams(window.location.search);
    if (!value) {
      params.delete("q");
    } else {
      params.set("q", encodeURIComponent(value));
    }
    const query = params.toString();
    router.push(`?${query}`);
  };

  const handleFilter = (
    minPrice: string,
    maxPrice: string,
    availability: ProductWithAvailability
  ) => {
    const params = new URLSearchParams(window.location.search);
    if (minPrice) {
      params.set("minPrice", minPrice);
    }
    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    }
    if (availability) {
      params.set("availability", availability);
    }
    const query = params.toString();
    router.push(`?${query}`);
  };

  const handleResetFilter = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("availability");
    const query = params.toString();
    router.push(`?${query}`);
  };

  return (
    <div className="flex flex-col gap-12">
      <ListingControls
        searchQuery={searchQuery || ""}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onResetFilter={handleResetFilter}
        initMinPrice={minPrice || ""}
        initMaxPrice={maxPrice || ""}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: (index % 4) * 0.1 }}
            >
              <FeaturedProductCard
                product={
                  {
                    ...product,
                    price: product.price as any,
                    weight: product.weight as any,
                    category: { name: categoryName } as any,
                  } as any
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div ref={loadMoreRef} className="h-4 -mt-4 pointer-events-none" />

      {hasMore && (
        <div className="flex justify-center py-12">
          <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="font-black uppercase tracking-widest text-sm">
              Loading More...
            </span>
          </div>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="text-center py-12 border-t-4 border-black border-dashed">
          <p className="font-black uppercase text-xl italic text-neutral-400">
            You've reached the end of {categoryName}
          </p>
        </div>
      )}

      {products.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-4xl font-black uppercase mb-4 italic">
            No Products Yet!
          </h2>
          <p className="text-neutral-500 font-bold max-w-md mx-auto px-4">
            It looks like there are no products in the{" "}
            <span className="text-pink-500">{categoryName}</span> category right
            now. Check back soon for new arrivals!
          </p>
        </div>
      )}
    </div>
  );
}
