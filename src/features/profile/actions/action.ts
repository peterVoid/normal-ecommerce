"use server";

import { UserGender } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types";
import { headers } from "next/headers";
import { UpdateBiodataSchema } from "../schemas/schema";

export async function updateProfileImage(
  imageUrl: string
): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const updatedUserAuth = await auth.api.updateUser({
      headers: await headers(),
      body: {
        image: imageUrl,
      },
    });

    if (!updatedUserAuth?.status) {
      return {
        success: false,
        message: "Failed to update user",
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: imageUrl,
      },
    });

    return {
      success: true,
      message: "Profile image updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update profile image",
    };
  }
}

export async function updateBiodata(data: {
  displayName?: string;
  gender?: UserGender;
  dateOfBirth?: Date;
}): Promise<ActionResponse> {
  try {
    const validatedData = UpdateBiodataSchema.safeParse({
      displayName: data.displayName,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
    });

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid data",
      };
    }

    const { displayName, gender, dateOfBirth } = validatedData.data;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const updatedUserAuth = await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: displayName,
        gender,
        dateOfBirth,
      },
    });

    if (!updatedUserAuth?.status) {
      return {
        success: false,
        message: "Failed to update user",
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        gender: true,
        dateOfBirth: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: displayName || user.name,
        gender: gender || user.gender,
        dateOfBirth: dateOfBirth || user.dateOfBirth,
      },
    });

    return {
      success: true,
      message: "Biodata updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update biodata",
    };
  }
}
