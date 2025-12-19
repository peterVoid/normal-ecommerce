import { Navbar } from "@/components/layouts/navbar";
import { CartItemContextProvider } from "@/context/cart-item-context";
import { CheckoutContextProvider } from "@/context/checkout-context";
import { getPublicCategories } from "@/dal/getCategories";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allCategories = await getPublicCategories();
  const categories = allCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <CheckoutContextProvider>
      <CartItemContextProvider>
        <div>
          <Navbar categories={categories} />
          {children}
        </div>
      </CartItemContextProvider>
    </CheckoutContextProvider>
  );
}
