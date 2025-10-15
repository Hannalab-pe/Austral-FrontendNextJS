'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Configuración por defecto para todas las queries
            staleTime: 60 * 1000, // Los datos se consideran frescos por 1 minuto
            gcTime: 5 * 60 * 1000, // Garbage collection después de 5 minutos (antes era cacheTime)
            retry: 1, // Reintentar 1 vez en caso de error
            refetchOnWindowFocus: false, // No refetch al enfocar la ventana
            refetchOnReconnect: true, // Refetch al reconectar
          },
          mutations: {
            // Configuración por defecto para todas las mutaciones
            retry: 0, // No reintentar mutaciones por defecto
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
