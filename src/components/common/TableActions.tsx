'use client';

import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface TableAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive';
  show?: boolean;
}

interface TableActionsProps<T> {
  item: T;
  actions?: TableAction<T>[];
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export default function TableActions<T>({
  item,
  actions,
  onView,
  onEdit,
  onDelete,
}: TableActionsProps<T>) {
  // Si hay acciones personalizadas, usarlas; sino, usar las acciones por defecto
  const defaultActions: TableAction<T>[] = [
    {
      label: 'Ver detalles',
      icon: <Eye className="mr-2 h-4 w-4" />,
      onClick: onView || (() => {}),
      show: !!onView,
    },
    {
      label: 'Editar',
      icon: <Pencil className="mr-2 h-4 w-4" />,
      onClick: onEdit || (() => {}),
      show: !!onEdit,
    },
    {
      label: 'Eliminar',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: onDelete || (() => {}),
      variant: 'destructive',
      show: !!onDelete,
    },
  ];

  const menuActions = actions || defaultActions.filter((action) => action.show !== false);

  if (menuActions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuActions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => action.onClick(item)}
            className={action.variant === 'destructive' ? 'text-red-600' : ''}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
