import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Brutal Shop",
  description: "Brutal Shop - The Ultimate Shopping Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!}
      ></Script>
      <body className={`${dmSans.className} antialiased`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
