

export const metadata = {
  title: 'Austral | Compañías de Seguros',
  description: 'Gestión de compañías aseguradoras en Austral',
};

import CompaniasClient from '@/components/companias/CompaniasClient';

/**
 * Página de Compañías de Seguros - Server Component
 * 
 * Este componente se renderiza en el servidor, lo que permite:
 * - Mejor SEO (los motores de búsqueda pueden indexar el contenido)
 * - Carga inicial más rápida (menos JavaScript en el cliente)
 * - Posibilidad de prefetch de datos (opcional)
 * 
 * La lógica interactiva está en CompaniasClient (Client Component)
 */
export default async function CompaniasPage() {
  // Opcional: Prefetch de datos en el servidor para mejorar la primera carga
  // const initialData = await fetchCompaniasServer();
  
  return <CompaniasClient />;
}
