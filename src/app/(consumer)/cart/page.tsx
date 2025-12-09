import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { formatRupiah } from "@/lib/format";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";

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

  return serializeCartItems;
}

export default async function CartPage() {
  const cartItems = await getCartItems();

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-base">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="inline-block bg-chart-5 px-3 py-0.5 text-[10px] font-bold uppercase text-white border-2 border-border shadow-shadow rotate-[-2deg] mb-2">
            Checkout
          </div>
          <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-tighter">
            Your Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-border bg-white shadow-shadow p-6 text-center">
            <ShoppingBag className="w-20 h-20 mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <button className="bg-main text-main-foreground px-8 py-3 font-bold border-2 border-border shadow-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 border-2 border-border bg-white p-4 shadow-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_var(--border)] transition-all"
                >
                  <div className="relative aspect-square w-full sm:w-24 shrink-0 overflow-hidden border-2 border-border">
                    <Image
                      src={item.product.images[0]?.src}
                      alt={item.product.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-2 w-full">
                    <div className="flex justify-between items-start w-full">
                      <h3 className="font-heading text-lg sm:text-xl line-clamp-2">
                        {item.product.name}
                      </h3>
                      <button className="text-muted-foreground hover:text-red-500 transition-colors sm:hidden">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-lg font-bold">
                      {formatRupiah(item.product.price)}
                    </p>

                    <div className="mt-2 flex items-center justify-between sm:justify-start gap-6">
                      <div className="flex items-center gap-4 bg-background border-2 border-border p-1">
                        <button
                          disabled={item.quantity <= 1}
                          className="p-1 hover:bg-muted disabled:opacity-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-4 text-center font-bold">
                          {item.quantity}
                        </span>
                        <button className="p-1 hover:bg-muted transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        className="hidden sm:block p-2 hover:bg-red-100 text-muted-foreground hover:text-red-500 border-2 border-transparent hover:border-border transition-all"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="h-fit space-y-4">
              <div className="border-2 border-border bg-white p-5 shadow-shadow">
                <h2 className="text-xl font-heading mb-4 uppercase">
                  Order Summary
                </h2>

                <div className="space-y-4 text-base">
                  <div className="flex justify-between text-lg">
                    <span className="font-heading uppercase">Total</span>
                    <span className="font-heading">${2020}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <button className="w-full bg-chart-5 text-white text-sm font-heading uppercase py-3 border-2 border-border shadow-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px]">
                    Checkout
                  </button>
                  <button className="w-full bg-white text-foreground text-sm font-heading uppercase py-3 border-2 border-border shadow-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px]">
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
