import { getProductByKey, getRelatedProducts } from "@/dal/getProducts";
import { checkWishlist } from "@/dal/wishlist-check";
import { AddToCartForm } from "@/features/products/components/add-to-cart-form";
import { ProductGallery } from "@/features/products/components/product-gallery";
import { ProductInfo } from "@/features/products/components/product-info";
import { PageProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
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

  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id,
    4
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans mt-12">
      <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px] opacity-10 pointer-events-none" />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <ProductGallery images={productImages} />
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-neutral-200/80 rotate-1 transform border-l-2 border-r-2 border-neutral-300"></div>

              <ProductInfo
                title={product.name}
                price={product.price}
                description={product.description}
                category={product.category?.name}
              />

              <div className="my-8 h-1 w-full bg-black border-dashed border-t-2 border-white" />

              <AddToCartForm
                productId={product.id}
                stock={product.stock}
                isWishlist={isWishlist}
              />
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-32 border-t-4 border-black pt-16">
            <div className="flex items-center gap-4 mb-12">
              <div className="bg-yellow-400 border-4 border-black px-4 py-1 font-black uppercase text-sm -rotate-2">
                Don't Miss Out
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight italic">
                You might also like
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => {
                const mainImage =
                  relatedProduct.images.find((img: any) => img.isMain) ||
                  relatedProduct.images[0];
                const imageUrl = mainImage?.src || "/placeholder-product.jpg";
                const isSale = relatedProduct.status === "USED";

                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/product/${relatedProduct.slug}`}
                    className="group relative aspect-3/4 w-full border-4 border-black bg-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all cursor-pointer"
                  >
                    {isSale && (
                      <div className="absolute top-4 left-4 bg-pink-500 text-white text-xs font-bold px-2 py-1 border-2 border-black z-10">
                        SALE
                      </div>
                    )}

                    <div className="relative w-full h-full">
                      <Image
                        src={imageUrl}
                        alt={relatedProduct.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-black text-lg text-white uppercase mb-2 line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <div className="bg-yellow-400 text-black px-3 py-1 font-bold inline-block border-2 border-black">
                          Rp{" "}
                          {Number(relatedProduct.price).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
