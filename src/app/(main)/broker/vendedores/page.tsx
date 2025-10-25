export const metadata = {
  title: 'Austral | Mis Vendedores',
  description: 'Lista de vendedores asignados a este Broker',
};

import VendedoresBrokerClient from '@/components/brokers/VendedoresBrokerClient';

/**
 * Página de Vendedores del Broker - Server Component
 *
 * Este componente se renderiza en el servidor, lo que permite:
 * - Mejor SEO
 * - Carga inicial más rápida
 * - Posibilidad de prefetch de vendedores en el servidor (opcional)
 *
 * La lógica interactiva está en VendedoresBrokerClient (Client Component)
 */
export default async function VendedoresBrokerPage() {
  // Opcional: Prefetch de vendedores en el servidor para hidratar el caché de TanStack Query
  // const vendedores = await fetchVendedoresBrokerServer();

  return <VendedoresBrokerClient />;
}