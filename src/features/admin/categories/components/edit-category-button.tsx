"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/generated/prisma/client";
import { cleanSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { updateCategory } from "../actions/action";
import { updateCategorySchema } from "../schemas/schema";

export function EditCategoryButton({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category.name || "",
      description: category.description || "",
      slug: category.slug || "",
      image: category.image || "",
      isActive: category.isActive || false,
    },
  });

  const handleSubmit = async (e: z.infer<typeof updateCategorySchema>) => {
    const { message, success } = await updateCategory({
      data: e,
      cId: category.id,
    });

    if (success) {
      toast.success(message);
      setOpen(false);
      form.reset();
    } else {
      toast.error(message);
    }
  };

  useEffect(() => {
    form.setValue("slug", cleanSlug(form.watch("name")));
  }, [form.watch("name")]);

  useEffect(() => {
    form.setValue("isActive", category.isActive);
  }, [category.isActive]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="size-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] border-2 border-border shadow-shadow">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Edit Category
          </DialogTitle>
          <DialogDescription className="text-base">
            Edit category to organize your menu items.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
                  <Input
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      className="text-red-500"
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="slug"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                  <Input {...field} className="pointer-events-none" disabled />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="resize-none"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      className="text-red-500"
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="isActive"
              render={({
                field: { value, onChange, ...field },
                fieldState,
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex flex-col justify-center gap-1.5">
                    <FieldLabel htmlFor={field.name}>Is Active</FieldLabel>
                    <Checkbox
                      {...field}
                      id={field.name}
                      checked={value}
                      onCheckedChange={onChange}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError
                        className="text-red-500"
                        errors={[fieldState.error]}
                      />
                    )}
                  </div>
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                disabled={form.formState.isSubmitting}
                className="bg-white text-black"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
