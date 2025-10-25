export const metadata = {
  title: 'Austral | Dashboard Broker',
  description: 'Dashboard principal para Brokers con métricas y gestión',
};

import BrokersDashboardClient from '@/components/brokers/BrokersDashboardClient';

/**
 * Página de Dashboard de Broker - Server Component
 *
 * Este componente se renderiza en el servidor, lo que permite:
 * - Mejor SEO
 * - Carga inicial más rápida
 * - Posibilidad de prefetch de métricas en el servidor (opcional)
 *
 * La lógica interactiva está en BrokersDashboardClient (Client Component)
 */
export default async function BrokersDashboardPage() {
  // Opcional: Prefetch de métricas en el servidor para hidratar el caché de TanStack Query
  // const metrics = await fetchBrokerMetricsServer();

  return <BrokersDashboardClient />;
}