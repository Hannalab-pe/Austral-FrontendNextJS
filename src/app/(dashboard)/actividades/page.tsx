
import { ActividadesCalendario } from '@/components/actividades/ActividadesCalendario';

export const metadata = {
  title: 'Actividades',
  description: 'Interfaz para gestionar actividades en Austral',
};

export default function ActividadesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Actividades</h1>
        <p className="text-muted-foreground">
          Gestiona y visualiza todas tus actividades en el calendario
        </p>
      </div>

      <ActividadesCalendario />
    </div>
  );
}