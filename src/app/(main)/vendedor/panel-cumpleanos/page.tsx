
import { PanelCumpleanos } from '@/components/clientes/PanelCumpleanos';

export const metadata = {
  title: 'Austral | Panel de Cumpleaños',
  description: 'Visualiza los cumpleaños de tus clientes en el calendario',
};

export default function PanelCumpleanosPage() {
  return (
    <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Cumpleaños</h1>
            <p className="text-muted-foreground">
              Visualiza los cumpleaños próximos de tus clientes en el calendario
            </p>
          </div>
    
          <PanelCumpleanos />
        </div>
  );
}