
export const metadata = {
 title: 'Austral | Usuarios',
 description: 'Interfaz para gestionar usuarios en Austral',
};

import UsuariosClient from '@/components/usuarios/UsuariosClient';

/**
 * Página de Usuarios - Server Component
 * 
 * Este componente se renderiza en el servidor, lo que permite:
 * - Mejor SEO (los motores de búsqueda pueden indexar el contenido)
 * - Carga inicial más rápida (menos JavaScript en el cliente)
 * - Posibilidad de prefetch de datos (opcional)
 * 
 * La lógica interactiva está en UsuariosClient (Client Component)
 */
export default async function UsuariosPage() {
  // Opcional: Prefetch de datos en el servidor para mejorar la primera carga
  // const initialData = await fetchUsuariosServer();
  
  return <UsuariosClient />;
}