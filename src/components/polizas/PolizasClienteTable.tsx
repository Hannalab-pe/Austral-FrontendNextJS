"use client";

import { ColumnDef } from '@tanstack/react-table';
import { Poliza } from '@/types/poliza.interface';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/common/DataTable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PolizasClienteTableProps {
  polizas: Poliza[];
  isLoading?: boolean;
  onEdit?: (poliza: Poliza) => void;
  onDelete?: (poliza: Poliza) => void;
  onView?: (poliza: Poliza) => void;
}

export function PolizasClienteTable({
  polizas,
  isLoading,
  onEdit,
  onDelete,
  onView,
}: PolizasClienteTableProps) {

  const columns: ColumnDef<Poliza>[] = [
    {
      accessorKey: 'contratante',
      header: 'Contratante',
      cell: ({ row }) => (
        <div className="text-sm font-medium">
          {row.original.contratante}
        </div>
      ),
    },
    {
      accessorKey: 'asegurado',
      header: 'Asegurado',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.asegurado}
        </div>
      ),
    },
    {
      accessorKey: 'cia',
      header: 'Cía',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.cia}
        </div>
      ),
    },
    {
      accessorKey: 'ram',
      header: 'Ramo',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.ram}
        </div>
      ),
    },
    {
      accessorKey: 'prod',
      header: 'Producto',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.prod}
        </div>
      ),
    },
    {
      accessorKey: 'poliza',
      header: 'Póliza',
      cell: ({ row }) => (
        <div className="text-sm font-mono font-semibold">
          {row.original.poliza}
        </div>
      ),
    },
    {
      accessorKey: 'mo',
      header: 'Mo',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.mo}
        </div>
      ),
    },
    {
      accessorKey: 'vig_inicio',
      header: 'Vig Inicio',
      cell: ({ row }) => {
        const fecha = row.original.vig_inicio;
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
      accessorKey: 'vig_fin',
      header: 'Vig Fin',
      cell: ({ row }) => {
        const fecha = row.original.vig_fin;
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
      accessorKey: 'sub_agente',
      header: 'Sub Agente',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.sub_agente || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'descripcion_poliza',
      header: 'Descripción',
      cell: ({ row }) => (
        <div className="max-w-xs truncate text-sm" title={row.original.descripcion_poliza}>
          {row.original.descripcion_poliza || '-'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const poliza = row.original;

        return (
          <div className="flex items-center gap-2">
            {/* Botón Ver */}
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(poliza)}
                title="Ver póliza"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}

            {/* Botón Editar */}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(poliza)}
                title="Editar póliza"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}

            {/* Botón Eliminar */}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => onDelete(poliza)}
                title="Eliminar póliza"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-600">Cargando pólizas...</div>
        </div>
      </div>
    );
  }

  if (!polizas || polizas.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">No hay pólizas registradas</div>
          <div className="text-gray-400">Este cliente aún no tiene pólizas asociadas.</div>
        </div>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={polizas}
      searchPlaceholder="Buscar por póliza, asegurado, compañía..."
      entityName="pólizas"
    />
  );
}
