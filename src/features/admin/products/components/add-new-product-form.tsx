"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Uploader } from "@/components/uploader";
import { Category } from "@/generated/prisma/client";
import { formatRupiah, parseRupiah } from "@/lib/format";
import { cleanSlug, parseNumberInput } from "@/lib/utils";
import { ProductEditProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, Variants } from "framer-motion";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createProduct, updateProduct } from "../actions/action";
import { CreateProductSchema, createProductSchema } from "../schemas/schema";
import { useRouter } from "next/navigation";

interface AddNewProductFormProps {
  categories: Category[];
  product?: ProductEditProps["product"];
  isEditMode?: boolean;
}

export function AddNewProductForm({
  categories,
  product,
  isEditMode = false,
}: AddNewProductFormProps) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      categoryId: product?.categoryId || "",
      isActive: product?.isActive || false,
      stock: Number(product?.stock) || 0,
      price: Number(product?.price) || 0,
      weight: Number(product?.weight) || null,
      description: product?.description || "",
      image:
        product?.images.map((image) => ({ id: image.id, key: image.key })) ||
        [],
      slug: product?.slug || "",
      name: product?.name || "",
    },
  });

  const productName = form.watch("name");

  const onSubmit = async (data: CreateProductSchema) => {
    try {
      const response = isEditMode
        ? await updateProduct(data, product?.id!)
        : await createProduct(data);

      if (response.success) {
        router.push("/admin/products");
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "Failed to " + (isEditMode ? "update" : "create") + " product"
      );
    }
  };

  useEffect(() => {
    form.setValue("slug", cleanSlug(productName));
  }, [productName]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto py-8"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={itemVariants}>
              <Card className="bg-white border-2">
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          placeholder="e.g. Wireless Headphones"
                          className="bg-zinc-50 border-2 hover:bg-white transition-colors"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.error && (
                          <FieldError
                            className="text-destructive mt-1"
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
                        <Input
                          type="text"
                          value={field.value}
                          className="bg-zinc-200/50 text-muted-foreground border-2"
                          aria-invalid={fieldState.invalid}
                          disabled
                        />
                        {fieldState.error && (
                          <FieldError
                            className="text-destructive mt-1"
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field: { value, ...field }, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Description
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          {...field}
                          value={value ?? ""}
                          placeholder="Describe your product..."
                          aria-invalid={fieldState.invalid}
                          rows={6}
                          className="resize-none bg-zinc-50 border-2 hover:bg-white transition-colors"
                        />
                        {fieldState.error && (
                          <FieldError
                            className="text-destructive mt-1"
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white border-2">
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <Controller
                    control={form.control}
                    name="image"
                    render={({ field: { value, onChange }, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Uploader
                          maxFiles={3}
                          onChange={onChange}
                          disabled={
                            value
                              ? value.length >= 3
                              : form.formState.isSubmitting
                          }
                          isEditMode={isEditMode}
                          images={product?.images ?? []}
                        />
                        {fieldState.error && (
                          <FieldError
                            className="text-destructive mt-1"
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Settings & Pricing */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <Card className="bg-white border-2">
                <CardHeader>
                  <CardTitle>Status & Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Controller
                    control={form.control}
                    name="isActive"
                    render={({
                      field: { value, onChange, ...field },
                      fieldState,
                    }) => (
                      <div className="flex flex-row items-center justify-between rounded-lg border-2 p-4 shadow-sm bg-zinc-50 hover:bg-white transition-colors">
                        <div className="space-y-0.5">
                          <FieldLabel
                            htmlFor={field.name}
                            className="text-base"
                          >
                            Active Status
                          </FieldLabel>
                          <div className="text-[0.8rem] text-muted-foreground">
                            Product will be visible in the store
                          </div>
                        </div>
                        <Checkbox
                          id={field.name}
                          {...field}
                          checked={value}
                          onCheckedChange={onChange}
                        />
                      </div>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="categoryId"
                    render={({
                      field: { onChange, onBlur, ...field },
                      fieldState,
                    }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                        <Select {...field} onValueChange={onChange}>
                          <SelectTrigger
                            onBlur={onBlur}
                            className="bg-zinc-50 border-2 hover:bg-white transition-colors"
                          >
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id}
                                defaultValue={field.value || ""}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.error && (
                          <FieldError
                            className="text-destructive mt-1"
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white border-2">
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Controller
                    control={form.control}
                    name="price"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Price (Rp)</FieldLabel>
                        <Input
                          id={field.name}
                          type="text"
                          inputMode="numeric"
                          value={formatRupiah(field.value)}
                          onChange={(e) => {
                            const raw = parseRupiah(e.target.value);
                            field.onChange(raw);
                          }}
                          className="bg-zinc-50 border-2 hover:bg-white transition-colors"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.error && (
                          <FieldError
                            className="text-destructive mt-1"
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="stock"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Stock</FieldLabel>
                        <Input
                          type="number"
                          min={1}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          value={field.value === 0 ? 1 : field.value}
                          className="bg-zinc-50 border-2 hover:bg-white transition-colors"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.error && (
                          <FieldError
                            className="text-destructive mt-1"
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="weight"
                    render={({
                      field: { value, onChange, ...field },
                      fieldState,
                    }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Weight (g)</FieldLabel>
                        <Input
                          {...field}
                          type="text"
                          id={field.name}
                          value={value ?? ""}
                          onChange={(e) =>
                            onChange(parseNumberInput(e.target.value))
                          }
                          inputMode="decimal"
                          className="bg-zinc-50 border-2 hover:bg-white transition-colors"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.error && (
                          <FieldError
                            className="text-destructive mt-1"
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {isEditMode
                  ? "Updating..."
                  : form.formState.isSubmitting
                  ? "Creating..."
                  : "Create Product"}
              </Button>
            </motion.div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
