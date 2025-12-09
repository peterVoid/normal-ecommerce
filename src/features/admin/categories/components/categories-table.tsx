"use client";

import { AlertDialogActionButton } from "@/components/alert-dialog-action-button";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/generated/prisma/client";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCategory } from "../actions/action";
import { EditCategoryButton } from "./edit-category-button";

export function CategoriesTable({
  categories,
  skip,
}: {
  categories: Category[];
  skip: number;
}) {
  const [isDeleting, startDeleting] = useTransition();

  const handleDeleteCategory = async (cID: string) => {
    startDeleting(async () => {
      const { success, message } = await deleteCategory({ id: cID });

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
          <th className="p-4 font-bold">Name</th>
          <th className="p-4 font-bold">Slug</th>
          <th className="p-4 font-bold">Description</th>
          <th className="p-4 font-bold">Image</th>
          <th className="p-4 font-bold">Is Active</th>
          <th className="p-4 font-bold">Created At</th>
          <th className="p-4 font-bold text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category, i) => (
          <tr
            key={category.id}
            className="border-b-2 border-border transition-colors last:border-0 hover:bg-main/10"
          >
            <td className="p-4 font-bold">{i + skip + 1}</td>
            <td className="p-4 font-bold text-lg">{category.name}</td>
            <td className="p-4 font-base text-muted-foreground">
              <Badge variant="neutral">{category.slug}</Badge>
            </td>
            <td className="p-4 font-base text-muted-foreground italic">
              {category.description ?? "No description"}
            </td>
            <td className="p-4 font-base text-muted-foreground italic">
              {category.image ?? "No image"}
            </td>
            <td className="p-4 font-base text-muted-foreground">
              <Badge variant={category.isActive ? "default" : "neutral"}>
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            </td>
            <td className="p-4">
              {category.createdAt.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </td>

            <td className="p-4 text-right">
              <div className="flex justify-end gap-2">
                <EditCategoryButton category={category} />
                <AlertDialogActionButton
                  action={() => handleDeleteCategory(category.id)}
                  buttonContent={
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </>
                  }
                  dialogTitle="Delete Category"
                  dialogDescription="Are you sure you want to delete this category?"
                  triggerButtonSize="icon"
                  disabled={isDeleting}
                  isPending={isDeleting}
                  className="h-8 w-8 hover:bg-red-200 transition-colors bg-white"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
