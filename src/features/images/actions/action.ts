"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types";
import z from "zod";

const uploadImageSchema = z.object({
  imageKey: z.string(),
});

const deleteImageSchema = z.object({
  id: z.string(),
});

export async function deleteImage(imageId: string): Promise<ActionResponse> {
  try {
    const validatedData = deleteImageSchema.safeParse({ id: imageId });

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid image ID",
      };
    }

    const { id } = validatedData.data;

    await prisma.image.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "Image deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete image",
    };
  }
}

export async function uploadImage(key: string): Promise<ActionResponse> {
  try {
    const validatedData = uploadImageSchema.safeParse({ imageKey: key });

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid image URL",
      };
    }

    const { imageKey } = validatedData.data;

    const publicImageURL = `https://uploader.t3.storage.dev/${imageKey}`;

    const image = await prisma.image.create({
      data: {
        src: publicImageURL,
        alt: "",
        isMain: false,
        key,
      },
    });

    return {
      success: true,
      message: "Image uploaded successfully",
      data: image.id,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to upload image",
    };
  }
}
