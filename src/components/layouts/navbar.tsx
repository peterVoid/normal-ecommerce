"use client";

import {
  HoverColor,
  hoverColorMap,
  NAVBAR_LINKS,
  NavbarLabel,
} from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const isHomePage = pathname.startsWith("/") && pathname.endsWith("/");

  return (
    <header className="h-14 border-b-4 border-border bg-white flex items-center fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between container mx-auto px-7">
        <div className="flex items-center">
          <Button className="border-2 border-black bg-main" size="sm" asChild>
            <Link href="/" className="font-semibold text-md uppercase">
              BRUTAL SHOP
            </Link>
          </Button>
        </div>
        <nav className="md:flex items-center gap-x-1 hidden">
          <Link href="/">
            <div
              className={`bg-white border-2 border-transparent uppercase text-xs hover:bg-yellow-400 hover:border-black hover:border-2 ${
                pathname === "/products" &&
                "bg-yellow-400 border-2 border-black"
              }`}
              style={{
                padding: "5px 20px",
              }}
            >
              All
            </div>
          </Link>

          {NAVBAR_LINKS.map((nLink) => {
            const isActive =
              nLink.label !== NavbarLabel.Categories && pathname === nLink.href;

            return (
              <Button
                key={nLink.label}
                variant="noShadow"
                className="bg-white border-none uppercase text-xs"
                size="sm"
              >
                {nLink.label === NavbarLabel.Categories ? (
                  <div className="p-1 border-2 border-transparent flex items-center gap-x-0.5 hover:bg-green-400 hover:border-black hover:border-2">
                    {nLink.label}
                    <ChevronDownIcon className="size-4" />
                  </div>
                ) : (
                  <div
                    className={cn(
                      `border-2 border-transparent hover:border-2 p-1 hover:border-black ${
                        isActive && "bg-red-900"
                      }`,
                      nLink.hoverColor === HoverColor.Blue &&
                        hoverColorMap[nLink.hoverColor],
                      nLink.hoverColor === HoverColor.Green &&
                        hoverColorMap[nLink.hoverColor]
                    )}
                  >
                    <Link href={nLink.href!}>{nLink.label}</Link>
                  </div>
                )}
              </Button>
            );
          })}
        </nav>
        <div className="flex items-center gap-x-2">
          <div className="p-1.5 border border-transparent flex items-center justify-center w-fit hover:bg-yellow-400 hover:border-black hover:border">
            <button>
              <SearchIcon className="size-4" />
            </button>
          </div>
          <div>
            <Link
              href={sessionPending ? "/" : session ? "/profile" : "/signup"}
              className="p-1.5 border border-transparent flex items-center justify-center w-fit hover:bg-blue-400 hover:border-black hover:border"
            >
              <UserIcon className="size-4" />
            </Link>
          </div>
          <div>
            <Link
              href="/cart"
              className="p-1.5 border border-transparent flex items-center justify-center w-fit hover:bg-red-400 hover:border-black hover:border"
            >
              <ShoppingCartIcon className="size-4" />
            </Link>
          </div>
          {!sessionPending && session && session.user.isAdmin && (
            <Button
              size="sm"
              className="rotate-1 hover:rotate-0 transition-all hover:bg-red-400 duration-200"
              asChild
            >
              <Link href="/admin">
                Go to Admin Panel
                <ChevronRightIcon className="size-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
