"use client";

import { FeaturedProductCard } from "@/components/homepage/featured-product-card";
import { ProductWithImages } from "@/types";
import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Loader2 } from "lucide-react";
import { getProductsByCategoryAction } from "../actions/action";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryProductGridProps {
  initialProducts: ProductWithImages[];
  initialHasMore: boolean;
  initialNextCursor?: string;
  categorySlug: string;
  categoryName: string;
}

export function CategoryProductGrid({
  initialProducts,
  initialHasMore,
  initialNextCursor,
  categorySlug,
  categoryName,
}: CategoryProductGridProps) {
  const [products, setProducts] =
    useState<ProductWithImages[]>(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef);

  useEffect(() => {
    if (isInView && hasMore && !isLoading) {
      handleLoadMore();
    }
  }, [isInView, hasMore, isLoading]);

  const handleLoadMore = async () => {
    setIsLoading(true);
    const result = await getProductsByCategoryAction(categorySlug, nextCursor);

    if (result.success && result.data) {
      setProducts((prev) => [...prev, ...result.data.products]);
      setHasMore(result.data.hasMore);
      setNextCursor(result.data.nextCursor);
    } else {
      toast.error(result.message || "Failed to load more products");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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

      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-12">
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
