'use client';

import { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Image from "next/image";

export default function Home() {
  const { isAuthenticated, isLoading, getDefaultRoute } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirigir al dashboard por defecto del rol
      const defaultRoute = getDefaultRoute();
      router.push(defaultRoute);
    }
  }, [isAuthenticated, isLoading, router, getDefaultRoute]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </main>
      </div>
    );
  }

  // Si no está autenticado, mostrar la página de bienvenida
  if (!isAuthenticated) {
    redirect('/login');
  }

  // Este código no debería ejecutarse, pero por si acaso
  return null;
}