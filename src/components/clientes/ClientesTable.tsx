'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Cliente } from '@/types/cliente.interface';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/common/DataTable';
import TableActions from '@/components/common/TableActions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ClientesTableProps {
  data: Cliente[];
  onEdit?: (cliente: Cliente) => void;
  onDelete?: (cliente: Cliente) => void;
  onView?: (cliente: Cliente) => void;
  isLoading?: boolean;
}

export default function ClientesTable({ 
  data, 
  onEdit, 
  onDelete, 
  onView,
  isLoading = false 
}: ClientesTableProps) {
  const columns: ColumnDef<Cliente>[] = [
    {
      accessorKey: 'documentoIdentidad',
      header: 'Documento',
      cell: ({ row }) => (
        <div className="font-medium">
          <div className="text-sm">{row.original.tipoDocumento}</div>
          <div className="text-xs text-gray-500">{row.original.documentoIdentidad}</div>
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
      cell: ({ row }) => (
        <div>
          <div className="text-sm">{row.original.telefono}</div>
          {row.original.telefonoSecundario && (
            <div className="text-xs text-gray-500">{row.original.telefonoSecundario}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'direccion',
      header: 'Dirección',
      cell: ({ row }) => {
        const direccion = [
          row.original.direccion,
          row.original.distrito,
          row.original.provincia,
          row.original.departamento,
        ]
          .filter(Boolean)
          .join(', ');
        
        return (
          <div className="max-w-xs truncate" title={direccion}>
            {direccion}
          </div>
        );
      },
    },
    {
      accessorKey: 'brokerAsignado',
      header: 'Broker Asignado',
      cell: ({ row }) => {
        const brokerNombre = row.original.brokerNombre;
        return brokerNombre ? (
          <span className="text-sm">{brokerNombre}</span>
        ) : (
          <span className="text-xs text-gray-400 italic">Sin asignar</span>
        );
      },
    },
    {
      accessorKey: 'registradoPor',
      header: 'Registrado Por',
      cell: ({ row }) => {
        const registradoPorNombre = row.original.registradoPorNombre;
        return registradoPorNombre ? (
          <span className="text-sm">{registradoPorNombre}</span>
        ) : (
          <span className="text-xs text-gray-400 italic">N/A</span>
        );
      },
    },
    {
      accessorKey: 'fechaRegistro',
      header: 'Fecha Registro',
      cell: ({ row }) => {
        const fecha = row.original.fechaRegistro;
        if (!fecha) return <span className="text-xs text-gray-400">-</span>;
        
        try {
          const fechaDate = typeof fecha === 'string' ? new Date(fecha) : fecha;
          return (
            <div className="text-sm">
              {format(fechaDate, 'dd/MM/yyyy', { locale: es })}
            </div>
          );
        } catch {
          return <span className="text-xs text-gray-400">-</span>;
        }
      },
    },
    {
      accessorKey: 'estaActivo',
      header: 'Estado',
      cell: ({ row }) => {
        const activo = row.original.estaActivo;
        return (
          <Badge variant={activo ? 'default' : 'secondary'}>
            {activo ? 'Activo' : 'Inactivo'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
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
      searchPlaceholder="Buscar por nombre, email o documento..."
      entityName="clientes"
    />
  );
}
