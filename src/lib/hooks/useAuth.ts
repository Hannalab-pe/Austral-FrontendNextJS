import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';

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
    const hasRole = (roleId: string): boolean => {
        return user?.idRol === roleId;
    };

    // Función helper para verificar si el usuario tiene alguno de los roles
    const hasAnyRole = (roleIds: string[]): boolean => {
        return user ? roleIds.includes(user.idRol) : false;
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
