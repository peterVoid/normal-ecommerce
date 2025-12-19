import { getPublicCategoryBySlug } from "@/dal/getCategories";
import { CategoryProductContent } from "@/features/categories/components/category-product-content";
import { PageProps, ProductWithAvailability } from "@/types";
import { notFound } from "next/navigation";

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const qSearchParams = await searchParams;

  if (!slug || typeof slug !== "string") {
    notFound();
  }

  const category = await getPublicCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const bannerColors = [
    "bg-emerald-400",
    "bg-amber-400",
    "bg-violet-400",
    "bg-rose-400",
    "bg-sky-400",
    "bg-lime-400",
  ];
  const bannerColor =
    bannerColors[Math.abs(category.id.length % bannerColors.length)];

  return (
    <div className="min-h-screen bg-[#FDFDFD] relative font-sans pt-20">
      <div className="inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[24px_24px] opacity-5 pointer-events-none fixed" />

      <div
        className={`${bannerColor} border-y-4 border-black py-20 px-4 md:px-8 relative overflow-hidden`}
      >
        <div className="absolute top-8 right-12 w-32 h-32 bg-white rounded-none border-4 border-black -rotate-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hidden lg:block" />
        <div className="absolute -bottom-10 left-32 w-24 h-24 bg-black rounded-full border-4 border-white/20 hidden lg:block" />
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white border-2 border-black rotate-45" />

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col gap-4 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="bg-black text-white px-3 py-1 font-black text-xs uppercase tracking-[0.2em]">
                Category
              </span>
              <div className="h-[2px] w-12 bg-black" />
            </div>

            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none italic pb-2 drop-shadow-[4px_4px_0px_rgba(255,255,255,1)]">
              {category.name}
            </h1>

            <p className="text-xl md:text-2xl font-bold bg-white/40 backdrop-blur-sm border-l-8 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
              Explore our selection of {category.name}. From the boldest designs
              to the most unique pieces, find exactly what fits your brutal
              lifestyle.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-20 relative z-10">
        <CategoryProductContent
          categorySlug={slug}
          categoryName={category.name}
          minPrice={qSearchParams?.minPrice as string | undefined}
          maxPrice={qSearchParams?.maxPrice as string | undefined}
          searchQuery={qSearchParams?.q as string | undefined}
          availability={
            qSearchParams?.availability as ProductWithAvailability | undefined
          }
        />
      </div>
    </div>
  );
}
