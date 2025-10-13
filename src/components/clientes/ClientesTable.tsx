'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Cliente } from '@/types/cliente.interface';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/common/DataTable';
import TableActions from '@/components/common/TableActions';

interface ClientesTableProps {
  data: Cliente[];
  onEdit?: (cliente: Cliente) => void;
  onDelete?: (cliente: Cliente) => void;
  onView?: (cliente: Cliente) => void;
}

export default function ClientesTable({ data, onEdit, onDelete, onView }: ClientesTableProps) {
  const columns: ColumnDef<Cliente>[] = [
    {
      accessorKey: 'documento_identidad',
      header: 'Documento',
      cell: ({ row }) => (
        <div className="font-medium">
          <div className="text-sm">{row.original.tipo_documento}</div>
          <div className="text-xs text-gray-500">{row.getValue('documento_identidad')}</div>
        </div>
      ),
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre Completo',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{`${row.original.nombre} ${row.original.apellido}`}</div>
          <div className="text-xs text-gray-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'telefono',
      header: 'Teléfono',
    },
    {
      accessorKey: 'direccion',
      header: 'Dirección',
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.getValue('direccion')}>
          {row.getValue('direccion')}
        </div>
      ),
    },
    {
      accessorKey: 'broker_nombre',
      header: 'Broker Asignado',
      cell: ({ row }) => {
        const broker = row.getValue('broker_nombre') as string | undefined;
        return broker ? (
          <span className="text-sm">{broker}</span>
        ) : (
          <span className="text-xs text-gray-400">Sin asignar</span>
        );
      },
    },
    {
      accessorKey: 'esta_activo',
      header: 'Estado',
      cell: ({ row }) => {
        const activo = row.getValue('esta_activo') as boolean;
        return (
          <Badge variant={activo ? 'default' : 'secondary'}>
            {activo ? 'Activo' : 'Inactivo'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <TableActions
          item={row.original}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Buscar clientes..."
      entityName="clientes"
    />
  );
}
