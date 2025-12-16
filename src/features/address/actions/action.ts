"use server";

import { ActionResponse } from "@/types";
import { AddressSchema, AddressSchemaType } from "../schemas/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MAX_ADDRESS } from "@/constants";

export async function deleteAddress(id: string): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    await prisma.address.delete({
      where: { id },
    });

    revalidatePath("/profile/address");

    return {
      success: true,
      message: "Address deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete address",
    };
  }
}

export async function setMainAddress(id: string): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { mainAddress: false },
    });

    await prisma.address.update({
      where: { id },
      data: { mainAddress: true },
    });

    revalidatePath("/profile/address");

    return {
      success: true,
      message: "Address updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update address",
    };
  }
}

export async function updateAddress(
  data: AddressSchemaType,
  id: string
): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const validatedData = AddressSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid data",
      };
    }

    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      return {
        success: false,
        message: "Address not found",
      };
    }

    let { main_address, ...addressData } = validatedData.data;

    if (main_address) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { mainAddress: false },
      });
    }

    await prisma.address.update({
      where: { id },
      data: {
        mainAddress: main_address,
        provinceId: addressData.province_id,
        cityId: addressData.city_id,
        subdistrict: addressData.subdistrict,
        completeAddress: addressData.complete_address,
        receiverName: addressData.receiver_name,
        phoneNumber: addressData.phone_number,
        label: addressData.label,
        province: addressData.province,
        city: addressData.city,
        postalCode: addressData.postal_code,
        subdistrictId: addressData.subdistrict_id,
      },
    });

    revalidatePath("/profile/address");

    return {
      success: true,
      message: "Address updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update address",
    };
  }
}

export async function addNewAddress(
  data: AddressSchemaType
): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const validatedData = AddressSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid data",
      };
    }

    let { main_address, ...addressData } = validatedData.data;

    const addressCount = await prisma.address.count({
      where: { userId: session.user.id },
    });

    if (addressCount === 0) {
      main_address = true;
    } else if (addressCount === MAX_ADDRESS) {
      return {
        success: false,
        message: "You have reached the maximum number of addresses",
      };
    }

    if (main_address && addressCount > 0) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { mainAddress: false },
      });
    }

    await prisma.address.create({
      data: {
        userId: session.user.id,
        mainAddress: main_address,
        provinceId: addressData.province_id,
        cityId: addressData.city_id,
        subdistrict: addressData.subdistrict,
        completeAddress: addressData.complete_address,
        receiverName: addressData.receiver_name,
        phoneNumber: addressData.phone_number,
        label: addressData.label,
        province: addressData.province,
        city: addressData.city,
        postalCode: addressData.postal_code,
        subdistrictId: addressData.subdistrict_id,
      },
    });

    revalidatePath("/profile/address");

    return {
      success: true,
      message: "Address added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to add new address",
    };
  }
}
