import AuditoriaClient from "@/components/auditoria/AuditoriaClient";


export const metadata = {
  title: 'Austral | Auditoría',
  description: 'Sistema de auditoría y registro de actividades del sistema',
};



/**
 * Página de Auditoría - Server Component
 *
 * Esta página muestra el registro de todas las actividades realizadas
 * en el sistema para fines de auditoría y seguimiento.
 */
export default function AuditoriaPage() {
  return <AuditoriaClient />;
}