import { CartItem } from "@/features/carts/components/cart-item";
import { EmptyCart } from "@/features/carts/components/empty-cart";
import { OrderSummary } from "@/features/carts/components/order-summary";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { CartItemType } from "@/types";
import { headers } from "next/headers";

async function getCartItems() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return [];

  const existingCart = await prisma.cart.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  if (!existingCart) return [];

  const getCartItems = await prisma.cartItem.findMany({
    where: {
      cartId: existingCart.id,
    },
    include: {
      product: {
        include: {
          images: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializeCartItems = getCartItems.map((item) => ({
    ...item,
    product: serializeProduct(item.product),
  }));

  return serializeCartItems as CartItemType[];
}

export default async function CartPage() {
  const cartItems = await getCartItems();

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-base">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="inline-block bg-chart-5 px-3 py-0.5 text-[10px] font-bold uppercase text-white border-2 border-border shadow-shadow -rotate-2 mb-2">
            Checkout
          </div>
          <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-tighter">
            Your Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <OrderSummary />
          </div>
        )}
      </div>
    </div>
  );
}
