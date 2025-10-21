'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // IDs de roles permitidos
  redirectTo?: string;
}

/**
 * Componente para proteger rutas que requieren autenticación
 * Uso: Envolver el contenido de la página con este componente
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // Verificar autenticación al montar
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Si está autenticado pero no tiene el rol permitido
    if (!isLoading && isAuthenticated && allowedRoles && user) {
      const hasPermission = allowedRoles.includes(user.id_rol);
      
      if (!hasPermission) {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, redirectTo]);

  // Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (el useEffect redirigirá)
  if (!isAuthenticated) {
    return null;
  }

  // Si requiere roles específicos y no los tiene, no mostrar nada
  if (allowedRoles && user && !allowedRoles.includes(user.id_rol)) {
    return null;
  }

  // Mostrar contenido si está autenticado y tiene permisos
  return <>{children}</>;
}
