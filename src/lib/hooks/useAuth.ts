import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';

/**
 * Hook personalizado para facilitar el uso del authStore
 */
export const useAuth = () => {
    const router = useRouter();
    const pathname = usePathname();

    const {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
        getUserProfile,
        changePassword,
    } = useAuthStore();

    // Verificar autenticación al montar el componente
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Función helper para verificar si el usuario tiene un rol específico
    const hasRole = (roleName: string): boolean => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            const decoded = authService.decodeToken(token);
            return decoded?.rol?.nombre?.toLowerCase() === roleName.toLowerCase();
        }
        return false;
    };

    // Función helper para verificar si el usuario tiene alguno de los roles
    const hasAnyRole = (roleNames: string[]): boolean => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            const decoded = authService.decodeToken(token);
            const userRole = decoded?.rol?.nombre?.toLowerCase();
            return userRole ? roleNames.some(role => role.toLowerCase() === userRole) : false;
        }
        return false;
    };

    // Función helper para obtener la ruta por defecto basada en el rol
    const getDefaultRoute = (): string => {
        // Obtener el rol del token JWT
        const token = localStorage.getItem('auth-token');
        if (!token) {
            throw new Error('No se encontró token de autenticación');
        }

        const decoded = authService.decodeToken(token);
        if (!decoded?.rol?.nombre) {
            throw new Error('No se pudo determinar el rol del usuario');
        }

        const roleName = decoded.rol.nombre.toLowerCase();

        switch (roleName) {
            case 'administrador':
                return '/admin/dashboard';
            case 'admin':
                return '/admin/dashboard';
            case 'broker':
                return '/broker/dashboard';
            case 'brokers':
                return '/broker/dashboard';
            case 'vendedor':
                return '/vendedor/actividades';
            default:
                throw new Error(`Rol desconocido: "${decoded.rol.nombre}"`);
        }
    };

    // Función helper para redirigir si no está autenticado
    const requireAuth = () => {
        if (!isAuthenticated && !isLoading) {
            router.push(`/login?from=${pathname}`);
        }
    };

    return {
        // Estado
        user,
        token,
        isAuthenticated,
        isLoading,

        // Acciones
        login,
        register,
        logout,
        checkAuth,
        getUserProfile,
        changePassword,

        // Helpers
        hasRole,
        hasAnyRole,
        requireAuth,
        getDefaultRoute,
    };
};

/**
 * Hook para proteger componentes que requieren autenticación
 */
export const useRequireAuth = () => {
    const { isAuthenticated, isLoading, requireAuth } = useAuth();

    useEffect(() => {
        requireAuth();
    }, [isAuthenticated, isLoading]);

    return { isAuthenticated, isLoading };
};

/**
 * Hook para obtener información del usuario autenticado
 */
export const useCurrentUser = () => {
    const { user, isAuthenticated } = useAuth();

    const fullName = user ? `${user.nombre} ${user.apellido}` : '';
    const initials = user
        ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase()
        : '';

    return {
        user,
        isAuthenticated,
        fullName,
        initials,
    };
};
