import { Pagination } from "@/components/pagination";
import { PAGE_SIZE } from "@/constants";
import { getCategories } from "@/dal/getCategories";
import { AddNewCategoryButton } from "@/features/admin/categories/components/add-new-category-button";
import { CategoriesTable } from "@/features/admin/categories/components/categories-table";
import { PageProps } from "@/types";

export default async function Page(props: PageProps) {
  const pageNumber = (await props.searchParams)?.page as string | undefined;

  const skip = ((pageNumber ? Number(pageNumber) : 1) - 1) * PAGE_SIZE;
  const { data: categories, metadata } = await getCategories({
    take: PAGE_SIZE,
    skip,
  });

  return (
    <div className="container pt-8">
      <div className="w-full space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading">Categories</h1>
            <p className="text-muted-foreground mt-1">
              Manage your food categories
            </p>
          </div>
          <AddNewCategoryButton />
        </div>

        <div className="w-full overflow-hidden rounded-base border-2 border-border bg-secondary-background shadow-shadow">
          <div className="overflow-x-auto">
            <CategoriesTable categories={categories} skip={skip} />
          </div>

          <div className="flex items-center justify-between border-t-2 border-border bg-secondary-background p-4">
            <div className="text-sm font-base text-gray-600">
              Showing <strong>{skip + 1}</strong> of{" "}
              <strong>{metadata.totalPages}</strong> categories
            </div>
            <div className="flex gap-2">
              <Pagination
                page={pageNumber}
                totalPages={metadata.totalPages}
                hasNextPage={metadata.hasNextPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
