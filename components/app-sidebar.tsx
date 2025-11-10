"use client";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "SAC NACIONAL",
      logo: GalleryVerticalEnd,
      plan: "Tigo",
    },
    {
      name: "Fidelización",
      logo: AudioWaveform,
      plan: "Belcorp",
    },
    {
      name: "SAC INTERNACIONAL",
      logo: Command,
      plan: "Colmedica",
    },
  ],
  navMain: [
    {
      title: "Configuración",
      url: "#",
      icon: Settings2,
      isActive: true,
      items: [
        {
          title: "Reglas",
          url: "/dashboard/reglas",
        },
      ],
    },
    {
      title: "Modelo",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "System prompt",
          url: "/dashboard/system-prompt",
        },
      ],
    },
    {
      title: "Turnos",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Programación",
          url: "/dashboard/programacion",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2">
          <TeamSwitcher teams={data.teams} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
