
export const metadata = {
 title: 'Austral | Nuevo Usuario',
 description: 'Formulario para crear un nuevo usuario',
};

import NuevoUsuarioClient from '@/components/usuarios/NuevoUsuarioClient';

/**
 * Página de Nuevo Usuario - Server Component
 * 
 * Este componente se renderiza en el servidor, lo que permite:
 * - Mejor SEO
 * - Carga inicial más rápida
 * - Posibilidad de prefetch de roles en el servidor (opcional)
 * 
 * La lógica interactiva está en NuevoUsuarioClient (Client Component)
 */
export default async function NuevoUsuarioPage() {
  // Opcional: Prefetch de roles en el servidor para hidratar el caché de TanStack Query
  // const roles = await fetchRolesServer();
  
  return <NuevoUsuarioClient />;
}