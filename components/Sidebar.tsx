"use client"

import React from "react";
import { FaRegFileCode } from "react-icons/fa";
import { LayoutDashboard, Code2, Trophy, Settings, LogOut, Terminal, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "./ui/sidebar";

export function Sidebar() {
  const pathname = usePathname();

  const navigationItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Challenges", url: "/challenges", icon: Code2 },
    { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
    { title: "Security Core", url: "/security-core", icon: ShieldAlert },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const mockScripts = [
    { name: "arc_reactor_init.py", id: "1" },
    { name: "jarvis_interface.sh", id: "2" },
    { name: "mark_85_flight_test.js", id: "3" },
    { name: "vibranium_alloy.cpp", id: "4" },
  ];

  return (
    <ShadcnSidebar
      style={{ "--sidebar": "transparent" } as React.CSSProperties}
      className="!fixed !top-[88px] !left-4 !h-[calc(100vh-88px-16px)] !w-(--sidebar-width) !rounded-2xl border border-border bg-card/60 backdrop-blur-md text-foreground shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Sidebar Header */}
      {/* <SidebarHeader className="border-b border-border p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-heading font-bold text-sm tracking-wider">
              STARK<span className="text-primary font-black">SCRIPTS</span>
            </div>
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
              SYSTEM MONITOR
            </div>
          </div>
        </div>
      </SidebarHeader> */}

      {/* Sidebar Content */}
      <SidebarContent className="px-2 py-4 flex flex-col gap-4">
        {/* Core Navigation Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase px-3 mb-1">
            Core Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`hover:bg-primary/10 hover:text-primary transition-all duration-200 ${
                        isActive ? "bg-primary/15 text-primary border-l-2 border-primary" : ""
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2 text-sm font-heading font-semibold">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Stark Scripts Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase px-3 mb-1">
            Active Scripts
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mockScripts.map((script) => (
                <SidebarMenuItem key={script.id}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-secondary/15 hover:text-secondary transition-all duration-200"
                  >
                    <Link
                      href={`/scripts/${script.id}`}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-mono text-muted-foreground hover:text-foreground"
                    >
                      <FaRegFileCode className="h-4 w-4 text-secondary/80" />
                      <span className="truncate">{script.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t border-border p-4 bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
              SECURE LINK
            </span>
          </div>
          <button className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors text-muted-foreground">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
