
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ClientesTable from '@/components/clientes/tables/ClientesTable';
import { Cliente } from '@/types/cliente.interface';

export const metadata = {
 title: 'Austral | Clientes',
 description: 'Interfaz de gestión de clientes para vendedores',
};

export default function ClientesPage() {
  // Datos temporales vacíos - se conectarán al servicio después
  const clientes: Cliente[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tu cartera de clientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/vendedor/clientes/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabla de clientes */}
      <ClientesTable
        data={clientes}
      />
    </div>
  );
}