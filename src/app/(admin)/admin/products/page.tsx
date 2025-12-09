import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE } from "@/constants";
import { getProducts } from "@/dal/getProducts";
import { ProductsTable } from "@/features/admin/products/components/products-table";
import { PageProps } from "@/types";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Page(props: PageProps) {
  const pageNumber = (await props.searchParams)?.page as string | undefined;

  const skip = ((pageNumber ? Number(pageNumber) : 1) - 1) * PAGE_SIZE;
  const { data: products, metadata } = await getProducts({
    take: PAGE_SIZE,
    skip,
  });

  return (
    <div className="container pt-8">
      <div className="w-full space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading">Products</h1>
            <p className="text-muted-foreground mt-1">Manage your products</p>
          </div>
          <Button className="gap-2" asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        <div className="w-full overflow-hidden rounded-base border-2 border-border bg-secondary-background shadow-shadow">
          <div className="overflow-x-auto">
            <ProductsTable products={products} skip={skip} />
          </div>

          <div className="flex items-center justify-between border-t-2 border-border bg-secondary-background p-4">
            <div className="text-sm font-base text-gray-600">
              Showing <strong>{skip + 1}</strong> of{" "}
              <strong>{metadata.totalPages}</strong> products
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
