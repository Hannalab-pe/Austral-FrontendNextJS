import { Metadata } from 'next';
import EditarCliente from '@/components/clientes/forms/EditarCliente';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Austral | Editar Cliente',
  description: 'Editar información del cliente seleccionado',
};

export default function EditarClientePage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Editar Cliente</h1>
          <p className="text-gray-600">Modificar la información del cliente seleccionado</p>
        </div>
      </div>

      {/* Componente de edición del cliente */}
      <EditarCliente />
    </div>
  );
}