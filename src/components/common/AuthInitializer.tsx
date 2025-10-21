'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * Componente para inicializar la autenticación
 * Debe ser usado en el layout principal para verificar
 * el estado de autenticación al cargar la aplicación
 */
export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Verificar autenticación al cargar la app
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
