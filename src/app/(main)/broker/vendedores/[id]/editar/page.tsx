export const metadata = {
  title: 'Austral | Editar Vendedor',
  description: 'Editar información de un vendedor como Broker',
};

import EditarVendedorBrokerClient from '@/components/brokers/EditarVendedorBrokerClient';

/**
 * Página de Editar Vendedor para Brokers - Server Component
 *
 * Este componente se renderiza en el servidor, lo que permite:
 * - Mejor SEO
 * - Carga inicial más rápida
 * - Posibilidad de prefetch de datos en el servidor (opcional)
 *
 * La lógica interactiva está en EditarVendedorBrokerClient (Client Component)
 */
export default async function EditarVendedorBrokerPage() {
  // Opcional: Prefetch de datos en el servidor para hidratar el caché de TanStack Query
  // const initialData = await fetchEditarVendedorDataServer();

  return <EditarVendedorBrokerClient />;
}