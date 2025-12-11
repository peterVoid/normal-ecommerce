import { UserGender } from "@/generated/prisma/enums";
import { z } from "zod";

export const UpdateBiodataSchema = z.object({
  displayName: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z\s]+$/, "Display name can only contain letters and spaces")
    .optional(),
  gender: z.enum(UserGender).optional(),
  dateOfBirth: z.date().optional(),
});

export const DisplayNameInputFormSchema = z.object({
  displayName: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z\s]+$/, "Display name can only contain letters and spaces"),
});

export const GenderSchema = z.enum(UserGender);
