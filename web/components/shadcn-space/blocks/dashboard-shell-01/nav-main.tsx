"use client"

import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar";
import { NavItem } from "@/components/shadcn-space/blocks/dashboard-shell-01/app-sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from 'next/link';

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  // Recursive render function
  // - group items between section labels - \\
  const sections: { label?: string; items: NavItem[] }[] = []
  let current: { label?: string; items: NavItem[] } = { items: [] }
  for (const item of items) {
    if (item.isSection) {
      if (current.items.length > 0 || current.label) sections.push(current)
      current = { label: item.label, items: [] }
    } else {
      current.items.push(item)
    }
  }
  if (current.items.length > 0 || current.label) sections.push(current)

  const renderItem = (item: NavItem) => {
    const hasChildren = !!item.children?.length;
    // Item with children → collapsible
    if (hasChildren && item.title) {
      return (
        <SidebarMenuItem key={item.title}>
          <Collapsible>
            <CollapsibleTrigger asChild className="w-full collapsible/button">
              <SidebarMenuButton
                tooltip={item.title}
                className="rounded-lg text-sm px-3 h-9"
              >
                {item.icon && <item.icon size={16} />}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 collapsible/button-[aria-expanded='true']:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub className="me-0 pe-0">
                {item.children!.map(renderItemSub)}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      );
    }
    // Item without children
    if (item.title) {
      const isActive = item.isActive ?? pathname === item.href;
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            tooltip={item.title}
            className={cn(
              "rounded-lg text-sm px-3 h-9 transition-all duration-150",
              isActive
                ? "bg-blue-500/15 text-blue-400 hover:bg-blue-500/20 hover:text-blue-400 font-semibold ring-inset ring-1 ring-blue-500/20 shadow-sm"
                : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-accent/50"
            )}
            asChild
          >
            <Link href={item.href || "#"} className="w-full">
              {item.icon && <item.icon size={16} />}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }
    return null;
  };
  // Recursive render function for sub-items
  const renderItemSub = (item: NavItem) => {
    const hasChildren = !!item.children?.length;
    if (hasChildren && item.title) {
      return (
        <SidebarMenuSubItem key={item.title}>
          <Collapsible>
            <CollapsibleTrigger className="w-full">
              <SidebarMenuSubButton className="rounded-xl text-sm px-3 py-2 h-9">
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 data-[state=open]:rotate-90" />
              </SidebarMenuSubButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub className="me-0 pe-0">
                {item.children!.map(renderItemSub)}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuSubItem>
      );
    }
    if (item.title) {
      return (
        <SidebarMenuSubItem key={item.title} className="w-full">
          <SidebarMenuSubButton className="w-full" asChild>
            <Link href={item.href || "#"}>{item.title}</Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      );
    }
    return null;
  };

  return (
    <>
      {sections.map((section, i) => (
        <SidebarGroup key={i} className="p-0 pt-4 first:pt-0">
          {section.label && (
            <SidebarGroupLabel className="px-0 pb-2 flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">{section.label}</span>
              <span className="flex-1 h-px bg-gradient-to-r from-border/60 to-transparent" />
            </SidebarGroupLabel>
          )}
          <SidebarMenu className="gap-0.5">
            {section.items.map(renderItem)}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
