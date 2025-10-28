'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientesList } from '@/components/clientes';
import { Cliente } from '@/types/cliente.interface';
import { clientesService } from '@/services/clientes.service';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * Página principal de clientes
 * Muestra la lista de clientes según la jerarquía del usuario autenticado:
 * - Admin: Ve todos los clientes
 * - Broker: Ve sus clientes + clientes de sus vendedores
 * - Vendedor: Ve solo sus clientes
 */
export default function ClientesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);

  // Mutación para desactivar cliente
  const deactivateMutation = useMutation({
    mutationFn: (id: string) => clientesService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Cliente desactivado exitosamente');
      setClienteToDelete(null);
    },
    onError: (error) => {
      toast.error('Error al desactivar el cliente');
      console.error(error);
    },
  });

  const handleCreate = () => {
    router.push('/clientes/nuevo');
  };

  const handleEdit = (cliente: Cliente) => {
    router.push(`/clientes/${cliente.idCliente}/editar`);
  };

  const handleView = (cliente: Cliente) => {
    router.push(`/clientes/${cliente.idCliente}`);
  };

  const handleDelete = (cliente: Cliente) => {
    setClienteToDelete(cliente);
  };

  const confirmDelete = () => {
    if (clienteToDelete) {
      deactivateMutation.mutate(clienteToDelete.idCliente);
    }
  };

  const handleExport = () => {
    toast.info('Función de exportación en desarrollo');
    // TODO: Implementar exportación a Excel/PDF
  };

  const handleImport = () => {
    toast.info('Función de importación en desarrollo');
    // TODO: Implementar importación desde CSV
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-900">Clientes</h1>
          <p className="text-gray-600">
            Gestiona tu cartera de clientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Button 
            onClick={handleCreate}
            className="bg-green-600 hover:bg-green-700 transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Lista de clientes con jerarquía automática */}
      <ClientesList
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />

      {/* Diálogo de confirmación de desactivación */}
      <AlertDialog open={!!clienteToDelete} onOpenChange={() => setClienteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas desactivar a{' '}
              <strong>
                {clienteToDelete?.nombre} {clienteToDelete?.apellido}
              </strong>
              ? El cliente no será eliminado, solo se marcará como inactivo y no aparecerá en las búsquedas principales.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deactivateMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deactivateMutation.isPending ? 'Desactivando...' : 'Desactivar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}