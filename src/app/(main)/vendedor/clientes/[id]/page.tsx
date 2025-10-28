
import { Metadata } from 'next';
import VerCliente from '@/components/clientes/VerCliente';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Austral | Detalles del Cliente',
  description: 'Información detallada del cliente seleccionado',
};

export default function ClienteDetallePage() {
  return (
    <div className="space-y-6">
      {/* Header con botón de regreso */}
      <div className="flex items-center gap-4">
        <Link href="/vendedor/clientes">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detalles del Cliente</h1>
          <p className="text-gray-600">Información completa del cliente seleccionado</p>
        </div>
      </div>

      {/* Componente de detalles del cliente */}
      <VerCliente />
    </div>
  );
}