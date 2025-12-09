import { getProductCategories } from "@/dal/getCategories";
import { getProductById } from "@/dal/getProducts";
import { AddNewProductForm } from "@/features/admin/products/components/add-new-product-form";
import { PageProps, ProductEditProps } from "@/types";

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const categories = await getProductCategories();
  const product: ProductEditProps["product"] = await getProductById(
    id as string
  );

  return (
    <div className="container mx-auto px-3 py-4">
      <h1 className="text-3xl font-heading">Edit Product</h1>
      <p className="text-muted-foreground mt-1">Edit a product</p>
      <AddNewProductForm
        categories={categories}
        product={product}
        isEditMode={true}
      />
    </div>
  );
}
