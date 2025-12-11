"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, MapPin, Shield, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const sidebarItems = [
  {
    title: "PROFILE",
    href: "/profile",
    icon: User,
  },
  {
    title: "WISHLIST",
    href: "/profile/wishlist",
    icon: Heart,
  },
  {
    title: "ADDRESS",
    href: "/profile/address",
    icon: MapPin,
  },
  {
    title: "SECURITY",
    href: "/profile/security",
    icon: Shield,
  },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <aside className="w-full md:w-[300px] shrink-0 font-base">
      <div className="flex flex-col gap-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-6 rounded-none">
        <h2 className="text-xl font-heading mb-6 uppercase tracking-tight">
          My Account
        </h2>
        <nav className="flex flex-col gap-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 border-2 border-black rounded-none transition-all font-bold uppercase text-sm",
                    isActive
                      ? "bg-cyan-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]"
                      : "bg-white hover:bg-gray-50 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </div>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-4 py-3 border-2 border-black rounded-none transition-all font-bold uppercase text-sm w-full",
              "bg-red-600 text-white hover:bg-red-700 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5"
            )}
          >
            <LogOut className="h-5 w-5" />
            LOGOUT
          </button>
        </nav>
      </div>
    </aside>
  );
}
