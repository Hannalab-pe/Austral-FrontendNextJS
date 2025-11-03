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
    FileText,
    Bell,
    User,
    Building,
    Quote,
    Calculator,
    TrendingUp,
    AlertTriangle,
    CheckSquare,
    MessageSquare,
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

// Configuración de navegación por rol
export const NAVIGATION_CONFIG_BY_ROLE: Record<string, NavigationItem[]> = {
    admin: [
        {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: LayoutDashboard,
            isActive: true,
            backendRoute: "/admin/dashboard",
        },
        {
            title: "Ventas",
            url: "#",
            icon: DollarSign,
            items: [
                {
                    title: "Leads",
                    url: "/admin/leads",
                    backendRoute: "/admin/leads",
                },
                {
                    title: "Clientes",
                    url: "/admin/clientes",
                    backendRoute: "/admin/clientes",
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
                    url: "/admin/polizas",
                    backendRoute: "/admin/polizas",
                },
                {
                    title: "Siniestros",
                    url: "/admin/siniestros",
                    backendRoute: "/admin/siniestros",
                },
                {
                    title: "Cotizaciones",
                    url: "/admin/cotizaciones",
                    backendRoute: "/admin/cotizaciones",
                },
                {
                    title: "Cotizar",
                    url: "/admin/cotizar",
                    backendRoute: "/admin/cotizar",
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
                    url: "/admin/actividades",
                    backendRoute: "/admin/actividades",
                },
                {
                    title: "Notificaciones",
                    url: "/admin/notificaciones",
                    backendRoute: "/admin/notificaciones",
                },
                {
                    title: "Solicitudes",
                    url: "/admin/solicitudes",
                    backendRoute: "/admin/solicitudes",
                },
            ],
        },
        {
            title: "Finanzas",
            url: "#",
            icon: BarChart3,
            items: [
                {
                    title: "Reportes",
                    url: "/admin/reportes",
                    backendRoute: "/admin/reportes",
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
                    url: "/admin/configuracion",
                    backendRoute: "/admin/configuracion",
                },
                {
                    title: "Usuarios",
                    url: "/admin/usuarios",
                    backendRoute: "/admin/usuarios",
                },
                {
                    title: "Auditoría",
                    url: "/admin/auditoria",
                    backendRoute: "/admin/auditoria",
                },
                {
                    title: "Compañías",
                    url: "/admin/companias",
                    backendRoute: "/admin/companias",
                },
                {
                    title: "Mi Perfil",
                    url: "/admin/perfil",
                    backendRoute: "/admin/perfil",
                },
            ],
        },
    ],
    broker: [
        {
            title: "Dashboard",
            url: "/broker/dashboard",
            icon: LayoutDashboard,
            isActive: true,
            backendRoute: "/broker/dashboard",
        },
        {
            title: "Gestión",
            url: "#",
            icon: ClipboardList,
            items: [
                {
                    title: "Actividades",
                    url: "/broker/actividades",
                    backendRoute: "/broker/actividades",
                },
                {
                    title: "Clientes",
                    url: "/broker/clientes",
                    backendRoute: "/broker/clientes",
                },
                {
                    title: "Notificaciones",
                    url: "/broker/notificaciones",
                    backendRoute: "/broker/notificaciones",
                },
                {
                    title: "Solicitudes",
                    url: "/broker/solicitudes",
                    backendRoute: "/broker/solicitudes",
                },
                {
                    title: "Vendedores",
                    url: "/broker/vendedores",
                    backendRoute: "/broker/vendedores",
                },
                {
                    title: "Mi Perfil",
                    url: "/broker/perfil",
                    backendRoute: "/broker/perfil",
                },
            ],
        },
    ],
    vendedor: [
        {
            title: "Dashboard",
            url: "/vendedor/dashboard",
            icon: LayoutDashboard,
            isActive: true,
            items: [
                {
                    title: "Panel",
                    url: "/vendedor/dashboard",
                    backendRoute: "/vendedor/dashboard",
                }
            ],
        },
        {
            title: "Gestión",
            url: "#",
            icon: ClipboardList,
            items: [
                {
                    title: "Actividades",
                    url: "/vendedor/actividades",
                    backendRoute: "/vendedor/actividades",
                },
                {
                    title: "Clientes",
                    url: "/vendedor/clientes",
                    backendRoute: "/vendedor/clientes",
                },
                {
                    title: "Panel de Cumpleaños",
                    url: "/vendedor/panel-cumpleanos",
                    backendRoute: "/vendedor/panel-cumpleanos",
                },
                {
                    title: "Notificaciones",
                    url: "/vendedor/notificaciones",
                    backendRoute: "/vendedor/notificaciones",
                },
                {
                    title: "Pólizas",
                    url: "/vendedor/polizas",
                    backendRoute: "/vendedor/polizas",
                },
                {
                    title: "Mi Perfil",
                    url: "/vendedor/perfil",
                    backendRoute: "/vendedor/perfil",
                },
            ],
        },
        {
            title: "IA",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Generador de Rutas",
                    url: "/vendedor/generador-rutas",
                    backendRoute: "/vendedor/generador-rutas",
                },
                {
                    title: "Lector de Facturas",
                    url: "/vendedor/lector-facturas",
                    backendRoute: "/vendedor/lector-facturas",
                },
                {
                    title: "Lector de Documentos",
                    url: "/vendedor/lector-documentos",
                    backendRoute: "/vendedor/lector-documentos",
                }
            ]
        }
    ],
};

// Configuración de navegación antigua (mantener por compatibilidad)
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
];// Función para obtener la configuración de navegación basada en el rol
export const getNavigationConfigByRole = (roleName: string): NavigationItem[] => {
    // Normalizar el nombre del rol a minúsculas
    const normalizedRole = roleName.toLowerCase();

    // Mapeo de nombres de rol a clave de configuración
    const roleMapping: Record<string, string> = {
        'administrador': 'admin',
        'admin': 'admin',
        'broker': 'broker',
        'brokers': 'broker',
        'vendedor': 'vendedor',
    };

    const roleKey = roleMapping[normalizedRole] || 'vendedor'; // Default a vendedor si no coincide
    return NAVIGATION_CONFIG_BY_ROLE[roleKey] || [];
};

// Función para filtrar navegación basada en permisos
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