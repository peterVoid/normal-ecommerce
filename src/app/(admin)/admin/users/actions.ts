"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function deleteUser(userId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.isAdmin) {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: { select: { orders: true } },
      },
    });

    if (!userToDelete) {
      return { success: false, error: "User not found" };
    }

    if (session.user.id === userId) {
      return { success: false, error: "Cannot delete your own account" };
    }

    if (userToDelete.isAdmin) {
      return {
        success: false,
        error: "Cannot delete admin users. Demote them first.",
      };
    }

    if (userToDelete._count.orders > 0) {
      return {
        success: false,
        error: "Cannot delete user with active orders. Data preservation rule.",
      };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function toggleAdminRole(userId: string, makeAdmin: boolean) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.isAdmin) {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    if (session.user.id === userId && !makeAdmin) {
      return { success: false, error: "Cannot remove your own admin role" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: makeAdmin },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error toggling admin role:", error);
    return { success: false, error: "Failed to update user role" };
  }
}
