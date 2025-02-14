"use client";
import { UserIcon } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar";
import { SidebarItem } from "./SidebarItem";
import SideBarSearch from "../ui/search";
import { NavUser } from "../NavUser";
import { AppSidebarProps } from "www/types/sidebar.types";
import { MAIN_MENU_ITEMS, FOOTER_MENU_ITEMS } from "www/lib/constant";

export function AppSidebar({ user, history }: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(
    () =>history && history.filter((item) => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [history, searchQuery]
  );

  return (
    <Sidebar variant="floating" className="overflow-hidden font-sans">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex gap-2 items-center p-2">
              <div className="flex py-2 aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <UserIcon className="size-4" />
              </div>
              <span className="truncate font-semibold">BuildAi</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SideBarSearch
                onSearchChange={setSearchQuery}
                value={searchQuery}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_MENU_ITEMS.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarGroupLabel>Previous</SidebarGroupLabel>
              {filteredItems.length === 0 ? (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  No items found
                </div>
              ) : (
                filteredItems.map((item) => (
                  <SidebarItem key={item.title} item={item} />
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {FOOTER_MENU_ITEMS.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <NavUser user={user} />
    </Sidebar>
  );
}