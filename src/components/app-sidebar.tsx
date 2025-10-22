"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Shield,
  ClipboardList,
  BarChart3,
  Settings,
  DollarSign,
} from "lucide-react";

import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
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
  teams: [
    {
      name: "Austral",
      logo: Shield,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Ventas",
      url: "#",
      icon: DollarSign,
      items: [
        {
          title: "Leads",
          url: "/leads",
        },
        {
          title: "Clientes",
          url: "/clientes",
        },
        {
          title: "Asociados",
          url: "/asociados",
        },
        {
          title: "Cotizaciones",
          url: "/cotizaciones",
        },
      ],
    },
    {
      title: "Pólizas",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "Ver Pólizas",
          url: "/polizas",
        },
        {
          title: "Siniestros",
          url: "/siniestros",
        },
        {
          title: "Peticiones",
          url: "/peticiones",
        },
      ],
    },
    {
      title: "Gestión",
      url: "#",
      icon: ClipboardList,
      items: [
        {
          title: "Actividades",
          url: "/actividades",
        },
        {
          title: "Tareas",
          url: "/tareas",
        },
        {
          title: "Notificaciones",
          url: "/notificaciones",
        },
      ],
    },
    {
      title: "Finanzas",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Comisiones",
          url: "/comisiones",
        },
        {
          title: "Reportes",
          url: "/reportes",
        },
      ],
    },
    {
      title: "Configuración",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/configuracion",
        },
        {
          title: "Usuarios",
          url: "/usuarios",
        },
        {
          title: "Mi Perfil",
          url: "/perfil",
        },
        {
          title: "Compañías",
          url: "/companias",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Soporte x WhatsApp",
      url: "https://wa.me/925757151", // Cambia este número por el tuyo
      icon: WhatsAppIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
