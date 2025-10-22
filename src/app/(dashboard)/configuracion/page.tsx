
import { Suspense } from 'react';
import ConfiguracionClient from '@/components/configuracion/ConfiguracionClient';

export const metadata = {
  title: 'Configuración - Austral',
  description: 'Gestión de roles y permisos del sistema',
};

export default function ConfiguracionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    }>
      <ConfiguracionClient />
    </Suspense>
  );
}