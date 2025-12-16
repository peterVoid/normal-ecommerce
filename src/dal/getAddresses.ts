import { MAX_ADDRESS } from "@/constants";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getAddresses() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const addresses = await prisma.address.findMany({
    where: {
      userId: session.user.id,
    },
    take: MAX_ADDRESS,
  });

  return addresses;
}
