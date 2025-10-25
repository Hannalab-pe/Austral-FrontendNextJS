// lib/hooks/usePermissions.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { permisosService } from '@/services/permisos.service';
import { authService } from '@/services/auth.service';
import {
    VerificarPermisoRequest,
    VerificarVistaRequest,
    VerificarRutaRequest,
    Vista,
} from '@/types/permisos.interface';
import { NAVIGATION_CONFIG, filterNavigationByPermissions, getNavigationConfigByRole, NavigationItem } from '@/lib/constants/navigation.constants';

// Tipos para permisos
export interface PermissionCheck {
    vista: string;
    permiso: string;
}

export interface ViewAccess {
    vista: string;
}

// Hook personalizado para verificar permisos
export const usePermissions = () => {
    const { user } = useAuthStore();

    // Función para verificar si una ruta actual coincide con una ruta de permiso
    const matchRoute = useCallback((currentPath: string, permissionPath: string): boolean => {
        // Si no hay wildcards, comparación exacta
        if (!permissionPath.includes('*')) {
            return currentPath === permissionPath;
        }

        // Convertir wildcard a regex
        // Ejemplo: '/companias/*/editar' -> '^/companias/[^/]+/editar$'
        const regexPattern = permissionPath
            .replace(/\*/g, '[^/]+') // * -> [^/]+ (cualquier cosa excepto /)
            .replace(/\//g, '\\/'); // Escapar slashes para regex

        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(currentPath);
    }, []);

    // Verificar si el usuario tiene un permiso específico en una vista
    const hasPermission = useCallback(async (vista: string, permiso: string): Promise<boolean> => {
        if (!user?.idUsuario) return false;

        try {
            const request: VerificarPermisoRequest = {
                idUsuario: user.idUsuario,
                vista,
                permiso
            };

            const response = await permisosService.verificarPermiso(request);
            return response.tienePermiso;
        } catch (error) {
            console.error('Error verificando permisos:', error);
            return false;
        }
    }, [user?.idUsuario]);

    // Verificar si el usuario tiene acceso a una vista específica
    const hasViewAccess = useCallback(async (vista: string): Promise<boolean> => {
        if (!user?.idUsuario) return false;

        try {
            const request: VerificarVistaRequest = {
                idUsuario: user.idUsuario,
                vista
            };

            const response = await permisosService.verificarVista(request);
            return response.tienePermiso;
        } catch (error) {
            console.error('Error verificando acceso a vista:', error);
            return false;
        }
    }, [user?.idUsuario]);

    // Verificar permisos para la ruta actual (útil en layouts)
    const checkCurrentRouteAccess = useCallback(async (currentPath: string): Promise<boolean> => {
        if (!user?.idUsuario) return false;

        try {
            const request: VerificarRutaRequest = {
                idUsuario: user.idUsuario,
                ruta: currentPath
            };

            const response = await permisosService.verificarRuta(request);
            return response.tienePermiso;
        } catch (error) {
            console.error('Error verificando acceso a ruta:', error);
            return false;
        }
    }, [user?.idUsuario]);

    // Verificar múltiples permisos a la vez (útil para optimizar)
    const hasMultiplePermissions = useCallback(async (
        permissions: Array<{ vista: string; permiso: string }>
    ): Promise<boolean[]> => {
        if (!user?.idUsuario) return permissions.map(() => false);

        try {
            const requests: VerificarPermisoRequest[] = permissions.map(p => ({
                idUsuario: user.idUsuario!,
                vista: p.vista,
                permiso: p.permiso
            }));

            const responses = await permisosService.verificarPermisosMasivo(requests);
            return responses.map(r => r.tienePermiso);
        } catch (error) {
            console.error('Error verificando permisos múltiples:', error);
            return permissions.map(() => false);
        }
    }, [user?.idUsuario]);

    // Verificar si el usuario puede crear en una vista
    const canCreate = useCallback(async (vista: string): Promise<boolean> => {
        return hasPermission(vista, 'crear');
    }, [hasPermission]);

    // Verificar si el usuario puede leer/ver en una vista
    const canRead = useCallback(async (vista: string): Promise<boolean> => {
        return hasPermission(vista, 'leer');
    }, [hasPermission]);

    // Verificar si el usuario puede actualizar en una vista
    const canUpdate = useCallback(async (vista: string): Promise<boolean> => {
        return hasPermission(vista, 'actualizar');
    }, [hasPermission]);

    // Verificar si el usuario puede eliminar en una vista
    const canDelete = useCallback(async (vista: string): Promise<boolean> => {
        return hasPermission(vista, 'eliminar');
    }, [hasPermission]);

    return {
        hasPermission,
        hasViewAccess,
        checkCurrentRouteAccess,
        hasMultiplePermissions,
        canCreate,
        canRead,
        canUpdate,
        canDelete,
        matchRoute
    };
};

// Hook para proteger componentes basado en permisos
export const useProtectedComponent = (requiredPermission?: PermissionCheck) => {
    const { hasPermission } = usePermissions();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            if (!requiredPermission) {
                setHasAccess(true);
                setLoading(false);
                return;
            }

            try {
                const access = await hasPermission(requiredPermission.vista, requiredPermission.permiso);
                setHasAccess(access);
            } catch (error) {
                console.error('Error verificando acceso al componente:', error);
                setHasAccess(false);
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, [requiredPermission, hasPermission]);

    return { hasAccess, loading };
};

// Hook para proteger vistas completas
export const useProtectedView = (vista: string) => {
    const { hasViewAccess } = usePermissions();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const access = await hasViewAccess(vista);
                setHasAccess(access);
            } catch (error) {
                console.error('Error verificando acceso a vista:', error);
                setHasAccess(false);
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, [vista, hasViewAccess]);

    return { hasAccess, loading };
};

// Hook para verificar permisos de creación rápida
export const useCanCreate = (vista: string) => {
    const { canCreate } = usePermissions();
    const [canAccess, setCanAccess] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const access = await canCreate(vista);
                setCanAccess(access);
            } catch (error) {
                console.error('Error verificando permiso de creación:', error);
                setCanAccess(false);
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, [vista, canCreate]);

    return { canAccess, loading };
};

// Hook para verificar permisos de eliminación rápida
export const useCanDelete = (vista: string) => {
    const { canDelete } = usePermissions();
    const [canAccess, setCanAccess] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const access = await canDelete(vista);
                setCanAccess(access);
            } catch (error) {
                console.error('Error verificando permiso de eliminación:', error);
                setCanAccess(false);
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, [vista, canDelete]);

    return { canAccess, loading };
};

// Hook para obtener las vistas permitidas para el usuario actual
export const useNavigationPermissions = () => {
    const { user } = useAuthStore();
    const [allowedViews, setAllowedViews] = useState<Vista[]>([]);
    const [filteredNavigation, setFilteredNavigation] = useState<NavigationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllowedViews = async () => {
            if (!user?.idUsuario) {
                setAllowedViews([]);
                setFilteredNavigation([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Obtener el nombre del rol del token JWT
                const token = localStorage.getItem('auth-token');
                let roleName = 'vendedor'; // default

                if (token) {
                    const decoded = authService.decodeToken(token);
                    if (decoded?.rol?.nombre) {
                        roleName = decoded.rol.nombre;
                    }
                }

                // Obtener la configuración de navegación basada en el nombre del rol
                const navigationConfig = getNavigationConfigByRole(roleName);

                // Por ahora, devolver la configuración completa sin filtrar por permisos
                // para verificar que la navegación funciona
                setAllowedViews([]);
                setFilteredNavigation(navigationConfig);
            } catch (error) {
                console.error('Error obteniendo configuración de navegación:', error);
                setError('Error al cargar configuración de navegación');
                setAllowedViews([]);
                setFilteredNavigation([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAllowedViews();
    }, [user?.idUsuario]);

    return { allowedViews, filteredNavigation, loading, error };
};