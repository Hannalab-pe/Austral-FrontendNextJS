# Componentes Comunes Reutilizables

Esta carpeta contiene componentes genéricos y reutilizables que se utilizan en toda la aplicación.

## DataTable

Componente de tabla reutilizable con funcionalidades de búsqueda, ordenamiento, filtrado y paginación.

### Características

- ✅ Búsqueda global configurable
- ✅ Ordenamiento por columnas
- ✅ Filtrado de datos
- ✅ Paginación con tamaño configurable
- ✅ Mensajes personalizables
- ✅ Totalmente tipado con TypeScript genéricos
- ✅ Responsive
- ✅ Basado en TanStack Table (React Table v8)

### Props

```typescript
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];  // Definición de columnas
  data: TData[];                         // Datos a mostrar
  searchPlaceholder?: string;            // Placeholder del buscador (default: "Buscar...")
  entityName?: string;                   // Nombre de la entidad para mensajes (default: "registros")
  showSearch?: boolean;                  // Mostrar barra de búsqueda (default: true)
  showPagination?: boolean;              // Mostrar controles de paginación (default: true)
  pageSize?: number;                     // Tamaño de página (default: 10)
}
```

### Uso Básico

```tsx
import DataTable from '@/components/common/DataTable';
import { ColumnDef } from '@tanstack/react-table';

interface User {
  id: string;
  name: string;
  email: string;
}

function UsersTable() {
  const data: User[] = [...]; // Tus datos

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'email',
      header: 'Email',
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
```

### Ejemplo con Celda Personalizada

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      );
    },
  },
];
```

---

## TableActions

Componente de menú dropdown reutilizable para acciones de fila en tablas.

### Características

- ✅ Menú dropdown con acciones por defecto (Ver, Editar, Eliminar)
- ✅ Acciones personalizables
- ✅ Iconos y variantes configurables
- ✅ Tipado genérico para cualquier tipo de dato
- ✅ Acciones condicionales (mostrar/ocultar)

### Props

```typescript
interface TableActionsProps<T> {
  item: T;                              // El item de la fila
  actions?: TableAction<T>[];           // Acciones personalizadas
  onView?: (item: T) => void;           // Callback para ver detalles
  onEdit?: (item: T) => void;           // Callback para editar
  onDelete?: (item: T) => void;         // Callback para eliminar
}

interface TableAction<T> {
  label: string;                        // Texto de la acción
  icon?: React.ReactNode;               // Icono opcional
  onClick: (item: T) => void;           // Callback al hacer clic
  variant?: 'default' | 'destructive';  // Variante visual
  show?: boolean;                       // Mostrar/ocultar acción
}
```

### Uso Básico con Acciones por Defecto

```tsx
import TableActions from '@/components/common/TableActions';

// En tu definición de columnas
{
  id: 'actions',
  cell: ({ row }) => (
    <TableActions
      item={row.original}
      onView={(item) => console.log('Ver', item)}
      onEdit={(item) => console.log('Editar', item)}
      onDelete={(item) => console.log('Eliminar', item)}
    />
  ),
}
```

### Uso con Acciones Personalizadas

```tsx
import { Download, Share } from 'lucide-react';

const customActions: TableAction<User>[] = [
  {
    label: 'Descargar',
    icon: <Download className="mr-2 h-4 w-4" />,
    onClick: (item) => downloadUser(item),
  },
  {
    label: 'Compartir',
    icon: <Share className="mr-2 h-4 w-4" />,
    onClick: (item) => shareUser(item),
  },
  {
    label: 'Eliminar',
    icon: <Trash2 className="mr-2 h-4 w-4" />,
    onClick: (item) => deleteUser(item),
    variant: 'destructive',
  },
];

// En columnas
{
  id: 'actions',
  cell: ({ row }) => (
    <TableActions
      item={row.original}
      actions={customActions}
    />
  ),
}
```

### Acciones Condicionales

```tsx
const actions: TableAction<User>[] = [
  {
    label: 'Activar',
    onClick: (item) => activate(item),
    show: !item.isActive, // Solo mostrar si no está activo
  },
  {
    label: 'Desactivar',
    onClick: (item) => deactivate(item),
    show: item.isActive, // Solo mostrar si está activo
  },
];
```

---

## Ejemplo Completo: Tabla de Clientes

```tsx
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/common/DataTable';
import TableActions from '@/components/common/TableActions';
import { Badge } from '@/components/ui/badge';

interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  esta_activo: boolean;
}

export default function ClientesTable({ 
  data, 
  onView, 
  onEdit, 
  onDelete 
}: {
  data: Cliente[];
  onView?: (cliente: Cliente) => void;
  onEdit?: (cliente: Cliente) => void;
  onDelete?: (cliente: Cliente) => void;
}) {
  const columns: ColumnDef<Cliente>[] = [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('nombre')}</div>
          <div className="text-xs text-gray-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'telefono',
      header: 'Teléfono',
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
      pageSize={15}
    />
  );
}
```

---

## Ventajas de Usar estos Componentes

1. **DRY (Don't Repeat Yourself)**: No repetir código de tabla en cada módulo
2. **Consistencia**: Todas las tablas de la app tienen el mismo comportamiento
3. **Mantenibilidad**: Cambios en un solo lugar afectan a todas las tablas
4. **Tipado Fuerte**: TypeScript genéricos previenen errores
5. **Personalización**: Fácil de personalizar por caso de uso específico
6. **Performance**: Optimizado con React Table v8
7. **Accesibilidad**: Componentes accesibles por defecto

---

## Próximas Mejoras

- [ ] Agregar selección de filas (checkboxes)
- [ ] Exportar datos (CSV, Excel, PDF)
- [ ] Filtros avanzados por columna
- [ ] Ordenamiento del servidor (server-side sorting)
- [ ] Paginación del servidor (server-side pagination)
- [ ] Columnas resizables
- [ ] Columnas ocultables/visibles
- [ ] Vista de densidad (compacta, normal, cómoda)
- [ ] Acciones en lote (bulk actions)
- [ ] Skeleton loading state
