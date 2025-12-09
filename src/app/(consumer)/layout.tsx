import { Navbar } from "@/components/layouts/navbar";
import { CartItemContextProvider } from "@/context/cart-item-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CartItemContextProvider>
      <div>
        <Navbar />
        {children}
      </div>
    </CartItemContextProvider>
  );
}
