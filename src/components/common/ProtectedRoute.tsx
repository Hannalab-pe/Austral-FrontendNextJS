'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoute?: string; // Ruta específica que requiere el componente
  allowedRoles?: string[]; // IDs de roles permitidos (para compatibilidad)
  redirectTo?: string;
  fallbackPath?: string; // Alias para redirectTo
}

/**
 * Componente para proteger rutas que requieren autenticación y permisos
 * Verifica permisos de vista usando el sistema de permisos basado en rutas
 */
export default function ProtectedRoute({
  children,
  requiredRoute,
  allowedRoles,
  redirectTo = '/login',
  fallbackPath,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, checkAuth } = useAuthStore();
  const { checkCurrentRouteAccess } = usePermissions();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [permissionLoading, setPermissionLoading] = useState(false);

  // Usar fallbackPath si está definido, sino redirectTo
  const redirectPath = fallbackPath || redirectTo;

  useEffect(() => {
    // Verificar autenticación al montar
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const verifyPermissions = async () => {
      // Si no está cargando autenticación y no está autenticado, redirigir
      if (!isLoading && !isAuthenticated) {
        router.push(redirectPath);
        return;
      }

      // Si está autenticado pero está cargando permisos, esperar
      if (isAuthenticated && (requiredRoute || allowedRoles)) {
        setPermissionLoading(true);

        try {
          let access = true;

          // Verificar permisos de ruta si se especifica
          if (requiredRoute) {
            access = await checkCurrentRouteAccess(requiredRoute);
          }

          // Verificar roles si se especifican (para compatibilidad)
          if (access && allowedRoles && user) {
            access = allowedRoles.includes(user.idRol.toString());
          }

          setHasAccess(access);

          // Si no tiene acceso, redirigir
          if (!access) {
            router.push('/unauthorized');
            return;
          }
        } catch (error) {
          console.error('Error verificando permisos:', error);
          setHasAccess(false);
          router.push('/unauthorized');
          return;
        } finally {
          setPermissionLoading(false);
        }
      } else if (isAuthenticated) {
        // Si está autenticado y no requiere permisos específicos
        setHasAccess(true);
        setPermissionLoading(false);
      }
    };

    // Solo verificar permisos si no está cargando autenticación
    if (!isLoading) {
      verifyPermissions();
    }
  }, [isAuthenticated, isLoading, user, requiredRoute, allowedRoles, checkCurrentRouteAccess, router, redirectPath]);

  // Mostrar loading mientras verifica autenticación o permisos
  if (isLoading || permissionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-gray-600">
            {isLoading ? 'Verificando autenticación...' : 'Verificando permisos...'}
          </p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (el useEffect redirigirá)
  if (!isAuthenticated) {
    return null;
  }

  // Si requiere permisos y no los tiene, no mostrar nada
  if ((requiredRoute || allowedRoles) && hasAccess === false) {
    return null;
  }

  // Mostrar contenido si está autenticado y tiene permisos
  return <>{children}</>;
}
