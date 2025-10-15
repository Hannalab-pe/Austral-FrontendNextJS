'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Usuario } from '@/types/usuario.interface';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/common/DataTable';
import TableActions from '@/components/common/TableActions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface UsuariosTableProps {
  data: Usuario[];
  onEdit?: (usuario: Usuario) => void;
  onDelete?: (usuario: Usuario) => void;
  onView?: (usuario: Usuario) => void;
  onActivate?: (usuario: Usuario) => void;
  onDeactivate?: (usuario: Usuario) => void;
  onBlock?: (usuario: Usuario) => void;
  onUnblock?: (usuario: Usuario) => void;
}

export default function UsuariosTable({
  data,
  onEdit,
  onDelete,
  onView,
  onActivate,
  onDeactivate,
  onBlock,
  onUnblock,
}: UsuariosTableProps) {
  const columns: ColumnDef<Usuario>[] = [
    {
      accessorKey: 'nombre_usuario',
      header: 'Usuario',
      cell: ({ row }) => (
        <div className="font-medium">
          <div className="text-sm font-semibold">{row.getValue('nombre_usuario')}</div>
          <div className="text-xs text-gray-500">{row.original.documento_identidad || 'Sin documento'}</div>
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
      cell: ({ row }) => {
        const telefono = row.getValue('telefono') as string | undefined;
        return telefono ? (
          <span className="text-sm">{telefono}</span>
        ) : (
          <span className="text-xs text-gray-400">Sin teléfono</span>
        );
      },
    },
    {
      accessorKey: 'id_rol',
      header: 'Rol',
      cell: ({ row }) => {
        const rol = row.getValue('id_rol') as string | undefined;
        return rol ? (
          <Badge variant="outline" className="font-medium">
            {rol}
          </Badge>
        ) : (
          <span className="text-xs text-gray-400">Sin rol</span>
        );
      },
    },
    {
      accessorKey: 'esta_activo',
      header: 'Estado',
      cell: ({ row }) => {
        const activo = row.getValue('esta_activo') as boolean;
        const bloqueado = row.original.cuenta_bloqueada;

        if (bloqueado) {
          return (
            <Badge variant="destructive" className="flex items-center gap-1">
              🔒 Bloqueado
            </Badge>
          );
        }

        return (
          <Badge variant={activo ? 'default' : 'secondary'}>
            {activo ? '✓ Activo' : '✗ Inactivo'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'ultimo_acceso',
      header: 'Último Acceso',
      cell: ({ row }) => {
        const ultimoAcceso = row.getValue('ultimo_acceso') as string | Date | undefined;
        if (!ultimoAcceso) {
          return <span className="text-xs text-gray-400">Nunca</span>;
        }
        try {
          const date = typeof ultimoAcceso === 'string' ? new Date(ultimoAcceso) : ultimoAcceso;
          return (
            <span className="text-xs text-gray-600">
              {format(date, "dd MMM yyyy 'a las' HH:mm", { locale: es })}
            </span>
          );
        } catch {
          return <span className="text-xs text-gray-400">-</span>;
        }
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const usuario = row.original;
        const customActions = [];

        // Acción de ver detalles
        if (onView) {
          customActions.push({
            label: 'Ver detalles',
            icon: <span className="mr-2">👁️</span>,
            onClick: onView,
          });
        }

        // Acción de editar
        if (onEdit) {
          customActions.push({
            label: 'Editar',
            icon: <span className="mr-2">✏️</span>,
            onClick: onEdit,
          });
        }

        // Acciones de activar/desactivar
        if (usuario.esta_activo && onDeactivate) {
          customActions.push({
            label: 'Desactivar',
            icon: <span className="mr-2">⏸️</span>,
            onClick: onDeactivate,
          });
        } else if (!usuario.esta_activo && onActivate) {
          customActions.push({
            label: 'Activar',
            icon: <span className="mr-2">▶️</span>,
            onClick: onActivate,
          });
        }

        // Acciones de bloquear/desbloquear
        if (usuario.cuenta_bloqueada && onUnblock) {
          customActions.push({
            label: 'Desbloquear',
            icon: <span className="mr-2">🔓</span>,
            onClick: onUnblock,
          });
        } else if (!usuario.cuenta_bloqueada && onBlock) {
          customActions.push({
            label: 'Bloquear',
            icon: <span className="mr-2">🔒</span>,
            onClick: onBlock,
            variant: 'destructive' as const,
          });
        }

        // Acción de eliminar
        if (onDelete) {
          customActions.push({
            label: 'Eliminar',
            icon: <span className="mr-2">🗑️</span>,
            onClick: onDelete,
            variant: 'destructive' as const,
          });
        }

        return <TableActions item={usuario} actions={customActions} />;
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Buscar usuarios..."
      entityName="usuarios"
    />
  );
}
