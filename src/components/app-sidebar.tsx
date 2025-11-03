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
  SidebarTrigger,
  useSidebar,
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
      url: "https://wa.me/925757151",
      icon: WhatsAppIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { filteredNavigation, loading, error } = useNavigationPermissions();
  const { state } = useSidebar();

  // Mostrar loading state mientras se cargan los permisos
  if (loading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <TeamSwitcher teams={data.teams} />
          </div>
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
          <div className="flex items-center gap-2 px-2">
            <TeamSwitcher teams={data.teams} />
          </div>
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
      <SidebarHeader className="relative">
        <TeamSwitcher teams={data.teams} />
        {/* Solo mostrar cuando el sidebar está expandido */}
        {state === "expanded" && (
          <div className="absolute top-3 right-3">
            <SidebarTrigger title="Colapsar menú" className="w-8 h-8 hover:bg-white/10 transition-colors rounded-md" />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavigation} />
        <NavProjects projects={data.projects} />
        {state === "collapsed" && (
          <div className="flex items-center justify-center">
            <SidebarTrigger title="Expandir menú" className="w-8 h-8 hover:bg-white/10 transition-colors rounded-md" />
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}