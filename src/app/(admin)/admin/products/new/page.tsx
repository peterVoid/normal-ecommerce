import { getProductCategories } from "@/dal/getCategories";
import { AddNewProductForm } from "@/features/admin/products/components/add-new-product-form";

export default async function Page() {
  const categories = await getProductCategories();

  return (
    <div className="container mx-auto px-3 py-4">
      <h1 className="text-3xl font-heading">Add New Product</h1>
      <p className="text-muted-foreground mt-1">Add a new product</p>
      <AddNewProductForm categories={categories} />
    </div>
  );
}
