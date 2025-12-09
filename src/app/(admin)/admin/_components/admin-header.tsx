"use client";

import { Bell, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function AdminHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 w-full bg-white">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span>Notifications</span>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search courses"
            className="w-full rounded-md border border-input bg-white pl-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>
    </header>
  );
}
