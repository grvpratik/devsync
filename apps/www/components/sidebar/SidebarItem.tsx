import { memo } from "react";
import { cn } from "www/lib/utils";
import { MenuItem } from "www/types/sidebar.types";
import { RANDOM_BG_COLORS } from "www/lib/constant";
import { SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar";

export const SidebarItem = memo(({ item }: { item: MenuItem }) => {
  const bgColor = RANDOM_BG_COLORS[Math.floor(Math.random() * RANDOM_BG_COLORS.length)];

  return (
    <SidebarMenuItem key={item.title} className="rounded-lg">
      <SidebarMenuButton asChild>
        <a href={item.url} className="flex items-center gap-2 p-1">
          <span className={cn("size-2 mx-1 rounded-full bg-violet-500",)} />
          <span className="truncate">{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

SidebarItem.displayName = "SidebarItem";