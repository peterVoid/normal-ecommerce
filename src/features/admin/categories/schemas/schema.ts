import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only letters, numbers, and dashes"
    ),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const deleteCategorySchema = z.object({
  id: z.string().min(1),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only letters, numbers, and dashes"
    ),
  description: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  image: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  isActive: z.boolean().optional(),
});

export const PROJECT_STATUES = ["draft", "active", "finished"] as const;

export const testSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z
    .string()
    .optional()
    .transform((val) => (val === "" ? null : val)),
  status: z.enum(PROJECT_STATUES),
  notifications: z.object({
    sms: z.boolean(),
    email: z.boolean(),
    push: z.boolean(),
  }),
  users: z
    .array(z.object({ email: z.email() }))
    .min(1)
    .max(5),
});
