"use client";

import {
  BoxesIcon,
  LayoutDashboard,
  NfcIcon,
  Settings,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

function DummyAvatar({ src, fallback }: { src: string; fallback: string }) {
  return (
    <div className="h-8 w-8 rounded-full overflow-hidden border border-border bg-muted">
      <img src={src} alt="Avatar" className="h-full w-full object-cover" />
    </div>
  );
}

const items = [
  {
    label: "General",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: Users2Icon,
      },
      {
        title: "Categories",
        url: "/admin/categories",
        icon: NfcIcon,
      },
      {
        title: "Products",
        url: "/admin/products",
        icon: BoxesIcon,
      },
    ],
  },
];

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary ">
            {state === "collapsed" && (
              <LayoutDashboard className="size-4 mr-3" />
            )}
          </div>
          <span className="truncate font-bold text-3xl uppercase">lahwok</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {items.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      className={
                        pathname === item.url
                          ? "bg-purple-100 text-purple-900 hover:bg-purple-200 hover:text-purple-900 border-r-4 border-purple-500 rounded-none"
                          : ""
                      }
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/admin/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mt-4 flex items-center gap-3 px-2 py-4 border-t">
          <DummyAvatar src="https://github.com/shadcn.png" fallback="RL" />
          <div className="flex flex-col text-sm">
            <span className="font-semibold">Ricardo Leoni</span>
            <span className="text-xs text-muted-foreground">
              ricardo_leo@learncraft.com
            </span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
