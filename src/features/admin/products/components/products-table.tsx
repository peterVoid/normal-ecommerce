"use client";

import { AlertDialogActionButton } from "@/components/alert-dialog-action-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateString, formatRupiah } from "@/lib/format";
import { ProductTableProps } from "@/types";
import { Edit2Icon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteProduct } from "../actions/action";

export function ProductsTable({ products, skip }: ProductTableProps) {
  const [isDeleting, startDeleting] = useTransition();

  const handleDeleteProduct = async (pID: string) => {
    startDeleting(async () => {
      const { success, message } = await deleteProduct(pID);

      if (!success) {
        toast.error(message);
      } else {
        toast.success(message);
      }
    });
  };

  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-main text-main-foreground border-b-2 border-border font-heading">
        <tr>
          <th className="p-4 font-bold">#</th>
          <th className="p-4 font-bold w-[20%]">Product</th>
          <th className="p-4 font-bold">Price</th>
          <th className="p-4 font-bold">Stock</th>
          <th className="p-4 font-bold">Status</th>
          <th className="p-4 font-bold">Date</th>
          <th className="p-4 font-bold text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, i) => (
          <tr
            key={product.id}
            className="border-b-2 border-border transition-colors last:border-0 hover:bg-main/10"
          >
            <td className="p-4 font-bold">{i + skip + 1}</td>
            <td className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-base border-2 border-border bg-white">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0].src}
                      alt={product.images[0].alt || product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-muted-foreground">
                      No Img
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-tight">
                    {product.name}
                  </span>
                  <div className="mt-1 flex gap-2">
                    <Badge variant="neutral" className="px-1 py-0 text-[10px]">
                      {product.category.name}
                    </Badge>
                  </div>
                </div>
              </div>
            </td>
            <td className="p-4 font-base text-muted-foreground">
              {formatRupiah(product.price)}
            </td>
            <td className="p-4 font-base">
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold ${
                    product.stock <= 10 ? "text-red-600" : "text-gray-700"
                  }`}
                >
                  {product.stock}
                </span>
                <span className="text-xs text-muted-foreground">in stock</span>
              </div>
            </td>
            <td className="p-4">
              <Badge variant={product.isActive ? "default" : "neutral"}>
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
            </td>
            <td className="p-4 font-base text-muted-foreground text-xs">
              <div className="flex flex-col">
                <span>{formatDateString(product.createdAt)}</span>
                <span className="text-[10px] opacity-70">Created</span>
              </div>
            </td>
            <td className="p-4 text-right">
              <div className="flex justify-end gap-2">
                <Button size="icon" className="size-8" asChild>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Edit2Icon className="size-4" />
                  </Link>
                </Button>
                <AlertDialogActionButton
                  action={() => handleDeleteProduct(product.id)}
                  buttonContent={
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </>
                  }
                  dialogTitle="Delete Product"
                  dialogDescription="Are you sure you want to delete this product? This action cannot be undone."
                  triggerButtonSize="icon"
                  disabled={isDeleting}
                  isPending={isDeleting}
                  className="h-8 w-8 bg-white transition-colors hover:bg-red-200"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
