import { getProductByKey } from "@/dal/getProducts";
import { checkWishlist } from "@/dal/wishlist-check";
import { AddToCartForm } from "@/features/products/components/add-to-cart-form";
import { ProductGallery } from "@/features/products/components/product-gallery";
import { ProductInfo } from "@/features/products/components/product-info";
import { PageProps } from "@/types";
import { notFound } from "next/navigation";

export default async function Page({ params }: PageProps) {
  const slug = (await params)?.slug as string;
  const product = await getProductByKey(slug);

  if (!product) {
    notFound();
  }

  const productImages = product.images.map((img: any) => ({
    src: img.src,
    alt: img.alt || product.name,
  }));

  if (productImages.length === 0) {
    productImages.push({
      src: "/placeholder-product.jpg",
      alt: product.name,
    });
  }

  const isWishlist = await checkWishlist(product.id);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="w-full">
          <ProductGallery images={productImages} />
        </div>

        <div className="flex flex-col h-fit border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <ProductInfo
            title={product.name}
            price={product.price}
            description={product.description}
            category={product.category?.name}
          />

          <div className="my-8 h-px w-full bg-neutral-200" />

          <AddToCartForm
            productId={product.id}
            stock={product.stock}
            isWishlist={isWishlist}
          />
        </div>
      </div>

      <div className="mt-24">
        <h2 className="mb-8 text-2xl font-black uppercase tracking-tight md:text-3xl">
          You might also like
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] w-full border-2 border-black bg-neutral-100 flex items-center justify-center"
            >
              <span className="font-bold text-neutral-400">
                Related Product {i}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
