'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientesTable from '@/components/clientes/ClientesTable';
import { mockClientes } from '@/lib/constants/mock-clientes';
import { Cliente } from '@/types/cliente.interface';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientesPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);

  const handleView = (cliente: Cliente) => {
    // TODO: Implementar vista de detalles
    toast.info(`Ver detalles de ${cliente.nombre} ${cliente.apellido}`);
  };

  const handleEdit = (cliente: Cliente) => {
    // TODO: Implementar edición
    router.push(`/clientes/${cliente.id_cliente}/editar`);
  };

  const handleDelete = (cliente: Cliente) => {
    // TODO: Implementar confirmación y eliminación
    if (confirm(`¿Estás seguro de eliminar a ${cliente.nombre} ${cliente.apellido}?`)) {
      setClientes(clientes.filter((c) => c.id_cliente !== cliente.id_cliente));
      toast.success('Cliente eliminado exitosamente');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Clientes</h1>
          <p className="text-gray-600">Gestiona la información de tus clientes</p>
        </div>
        <Button className='bg-green-600 hover:bg-green-700 transition-all duration-200' onClick={() => router.push('/clientes/nuevo')}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <ClientesTable
        data={clientes}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}