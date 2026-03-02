"use client";
import React from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { NavMain } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-main";
import { LayoutDashboard, FileText, Activity, Banknote, LucideIcon } from "lucide-react";
import { SiteHeader } from "@/components/shadcn-space/blocks/dashboard-shell-01/site-header";
import SimpleBar from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css'

export type NavItem = {
    label?: string;
    isSection?: boolean;
    title?: string;
    icon?: LucideIcon;
    href?: string;
    children?: NavItem[];
    isActive?: boolean;
};

export const navData: NavItem[] = [
    { label: "MAIN", isSection: true },
    { title: "Overview", icon: LayoutDashboard, href: "/staff/dashboard" },
    { title: "Transcripts", icon: FileText, href: "/staff/dashboard/transcripts" },
    { label: "STAFF", isSection: true },
    { title: "Activity", icon: Activity, href: "/staff/dashboard/activity" },
    { title: "Salary", icon: Banknote, href: "/staff/dashboard/salary" }
];

/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

const AppSidebar = ({ children, user }: { children: React.ReactNode, user?: any }) => {
    return (
        <SidebarProvider>
            <Sidebar className="py-4 px-0 bg-background">
                <div className="flex flex-col h-full bg-background">
                    {/* ---------------- Header ---------------- */}
                    <SidebarHeader className="py-0 px-4 pb-4">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <a href="#" className="w-full h-full block group">
                                    <div className="flex items-center gap-3">
                                        {/* - logo - \\ */}
                                        <img src="/atomc.svg" alt="Atomicals" className="h-8 w-8" />
                                        {/* - brand text block - \ */}
                                        <div className="flex flex-col gap-0.5 leading-none">
                                            <span className="text-[15px] font-bold tracking-tight text-foreground">Atomicals</span>
                                            <span className="text-[10px] font-medium text-muted-foreground/60 tracking-wide uppercase">Staff Area</span>
                                        </div>
                                    </div>
                                </a>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        {/* - subtle divider below brand - \ */}
                        <div className="mt-3 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
                    </SidebarHeader>

                    {/* ---------------- Content ---------------- */}
                    <SidebarContent className="overflow-hidden gap-0 px-0 flex-1">
                        <SimpleBar autoHide={true} className="h-full">
                            <div className="px-4 py-2">
                                <NavMain items={navData} />
                            </div>
                        </SimpleBar>
                    </SidebarContent>
                </div>
            </Sidebar>

            {/* ---------------- Main ---------------- */}
            <div className="flex flex-1 flex-col">
                <header className="sticky top-0 z-50 flex items-center border-b border-border/60 px-6 py-3 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                    <SiteHeader user={user} />
                </header>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
};

export default AppSidebar;
