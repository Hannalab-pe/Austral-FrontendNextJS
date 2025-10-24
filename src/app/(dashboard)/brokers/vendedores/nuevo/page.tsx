export const metadata = {
  title: 'Austral | Nuevo Vendedor',
  description: 'Registrar un nuevo vendedor como Broker',
};

import NuevoVendedorBrokerClient from '@/components/brokers/NuevoVendedorBrokerClient';

/**
 * Página de Nuevo Vendedor para Brokers - Server Component
 *
 * Este componente se renderiza en el servidor, lo que permite:
 * - Mejor SEO
 * - Carga inicial más rápida
 * - Posibilidad de prefetch de datos en el servidor (opcional)
 *
 * La lógica interactiva está en NuevoVendedorBrokerClient (Client Component)
 */
export default async function NuevoVendedorBrokerPage() {
  // Opcional: Prefetch de datos en el servidor para hidratar el caché de TanStack Query
  // const initialData = await fetchNuevoVendedorDataServer();

  return <NuevoVendedorBrokerClient />;
}