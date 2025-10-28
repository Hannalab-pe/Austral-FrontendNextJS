"use client"

import * as React from "react"
import {
  Shield,
} from "lucide-react"

import WhatsAppIcon from "@/components/icons/WhatsAppIcon"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useNavigationPermissions } from "@/lib/hooks/usePermissions"

// This is sample data.
const data = {
  teams: [
    {
      name: "Austral",
      logo: Shield,
      plan: "Enterprise",
    },
  ],
  projects: [
    {
      name: "Soporte x WhatsApp",
      url: "https://wa.me/925757151", // Cambia este número por el tuyo
      icon: WhatsAppIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { filteredNavigation, loading, error } = useNavigationPermissions();

  // Mostrar loading state mientras se cargan los permisos
  if (loading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <div className="flex items-center justify-center p-4">
            <div className="text-sm text-muted-foreground">Cargando navegación...</div>
          </div>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  // Mostrar error si ocurre
  if (error) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <div className="flex items-center justify-center p-4">
            <div className="text-sm text-red-500">Error cargando navegación</div>
          </div>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props} className="bg-gradient-to-b from-[#0a2342] via-[#163e6c] to-[#274472] text-white">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavigation} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
