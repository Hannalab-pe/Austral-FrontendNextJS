// lib/constants/navigation.constants.ts
import {
    LayoutDashboard,
    Shield,
    ClipboardList,
    BarChart3,
    Settings,
    DollarSign,
    Users,
    Bot,
    UserCheck,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

// Mapeo entre rutas del backend y configuración del frontend
export interface NavigationItem {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: NavigationSubItem[];
    backendRoute?: string; // Ruta que se verifica en el backend
}

export interface NavigationSubItem {
    title: string;
    url: string;
    backendRoute?: string; // Ruta que se verifica en el backend
}

// Configuración de navegación organizada por secciones
export const NAVIGATION_CONFIG: NavigationItem[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
        backendRoute: "/dashboard",
    },
    {
        title: "Ventas",
        url: "#",
        icon: DollarSign,
        items: [
            {
                title: "Leads",
                url: "/leads",
                backendRoute: "/leads",
            },
            {
                title: "Clientes",
                url: "/clientes",
                backendRoute: "/clientes",
            },
            {
                title: "Asociados",
                url: "/asociados",
                backendRoute: "/asociados",
            },
        ],
    },
    {
        title: "Broker",
        url: "#",
        icon: UserCheck,
        items: [
            {
                title: "Dashboard",
                url: "/brokers",
                backendRoute: "/brokers",
            },
            {
                title: "Mis Vendedores",
                url: "/brokers/vendedores",
                backendRoute: "/brokers/vendedores",
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
                backendRoute: "/polizas",
            },
            {
                title: "Siniestros",
                url: "/siniestros",
                backendRoute: "/siniestros",
            },
            {
                title: "Peticiones",
                url: "/peticiones",
                backendRoute: "/peticiones",
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
                backendRoute: "/actividades",
            },
            {
                title: "Tareas",
                url: "/tareas",
                backendRoute: "/tareas",
            },
            {
                title: "Notificaciones",
                url: "/notificaciones",
                backendRoute: "/notificaciones",
            },
        ],
    },
    // {
    //     title: "Agentes",
    //     url: "/agentes",
    //     icon: Users,
    //     items: [
    //         {
    //             title: "Agente",
    //             url: "/agentes/",
    //             backendRoute: "/agentes",
    //         },
    //     ],
    // },
    {
        title: "Finanzas",
        url: "#",
        icon: BarChart3,
        items: [
            {
                title: "Comisiones",
                url: "/comisiones",
                backendRoute: "/comisiones",
            },
            {
                title: "Reportes",
                url: "/reportes",
                backendRoute: "/reportes",
            },
        ],
    },
    {
        title: "IA",
        url: "#",
        icon: Bot,
        items: [
            {
                title: "Asistente IA",
                url: "/asistente-ia",
                backendRoute: "/asistente-ia",
            },
            {
                title: "Factura IA",
                url: "/factura-ia",
                backendRoute: "/factura-ia",
            },
            {
                title: "Lector de Documentos",
                url: "/lector-documentos",
                backendRoute: "/lector-documentos",
            },
            {
                title: "Generador de Correos",
                url: "/generador-correos",
                backendRoute: "/generador-correos",
            },
            {
                title: "Generador de Rutas",
                url: "/generador-rutas",
                backendRoute: "/generador-rutas",
            }
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
                backendRoute: "/configuracion",
            },
            {
                title: "Usuarios",
                url: "/usuarios",
                backendRoute: "/usuarios",
            },
            {
                title: "Auditoría",
                url: "/auditoria",
                backendRoute: "/auditoria",
            },
            {
                title: "Mi Perfil",
                url: "/perfil",
                backendRoute: "/perfil",
            },
            {
                title: "Compañías",
                url: "/companias",
                backendRoute: "/companias",
            },
        ],
    },
];// Función para filtrar navegación basada en permisos
export const filterNavigationByPermissions = (
    navigationConfig: NavigationItem[],
    allowedRoutes: string[]
): NavigationItem[] => {
    return navigationConfig
        .map(section => {
            // Si la sección principal tiene backendRoute, verificar si está permitida
            if (section.backendRoute && !allowedRoutes.includes(section.backendRoute)) {
                return null;
            }

            // Si tiene items, filtrar los sub-items
            if (section.items) {
                const filteredItems = section.items.filter(item =>
                    !item.backendRoute || allowedRoutes.includes(item.backendRoute)
                );

                // Si no quedan items después del filtro, no mostrar la sección
                if (filteredItems.length === 0) {
                    return null;
                }

                // Retornar la sección con items filtrados
                return {
                    ...section,
                    items: filteredItems,
                };
            }

            // Si no tiene items, retornar la sección completa
            return section;
        })
        .filter((section): section is NavigationItem => section !== null);
};

// Función para obtener todas las rutas backend de la configuración
export const getAllBackendRoutes = (navigationConfig: NavigationItem[]): string[] => {
    const routes: string[] = [];

    navigationConfig.forEach(section => {
        if (section.backendRoute) {
            routes.push(section.backendRoute);
        }
        if (section.items) {
            section.items.forEach(item => {
                if (item.backendRoute) {
                    routes.push(item.backendRoute);
                }
            });
        }
    });

    return routes;
};