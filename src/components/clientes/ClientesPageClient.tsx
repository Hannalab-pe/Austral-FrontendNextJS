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
 * Componente principal de la página de clientes
 * Muestra la lista de clientes según la jerarquía del usuario autenticado
 */
export default function ClientesPageClient() {
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
    router.push('/dashboard/clientes/nuevo');
  };

  const handleEdit = (cliente: Cliente) => {
    router.push(`/dashboard/clientes/${cliente.idCliente}/editar`);
  };

  const handleView = (cliente: Cliente) => {
    router.push(`/dashboard/clientes/${cliente.idCliente}`);
  };

  const handleDelete = (cliente: Cliente) => {
    setClienteToDelete(cliente);
  };

  const confirmDelete = () => {
    if (clienteToDelete) {
      deactivateMutation.mutate(clienteToDelete.idCliente);
    }
  };

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
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Button onClick={handleCreate}>
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

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={!!clienteToDelete} onOpenChange={() => setClienteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas desactivar a{' '}
              <strong>
                {clienteToDelete?.nombre} {clienteToDelete?.apellido}
              </strong>
              ? El cliente no será eliminado, solo se marcará como inactivo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deactivateMutation.isPending}
            >
              {deactivateMutation.isPending ? 'Desactivando...' : 'Desactivar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
