'use client';

import { useQuery } from '@tanstack/react-query';
import { clientesService } from '@/services/clientes.service';
import ClientesTable from './ClientesTable';
import { Cliente } from '@/types/cliente.interface';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ClientesListProps {
  onEdit?: (cliente: Cliente) => void;
  onDelete?: (cliente: Cliente) => void;
  onView?: (cliente: Cliente) => void;
}

/**
 * Componente que obtiene y muestra la lista de clientes según la jerarquía del usuario
 * - Admin: Ve todos los clientes
 * - Broker: Ve sus clientes y los de sus vendedores
 * - Vendedor: Ve solo sus clientes
 */
export default function ClientesList({ onEdit, onDelete, onView }: ClientesListProps) {
  const {
    data: clientes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clientesService.getAll(),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error al cargar clientes</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'Ocurrió un error inesperado'}
        </AlertDescription>
      </Alert>
    );
  }

  if (clientes.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No hay clientes registrados</AlertTitle>
        <AlertDescription>
          Comienza registrando tu primer cliente.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ClientesTable
      data={clientes}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
    />
  );
}
