# Páginas de Clientes - Documentación

## Estructura Implementada

### 1. **Página Principal de Clientes** (`/src/app/(dashboard)/clientes/page.tsx`)

Página principal que muestra la lista de todos los clientes con funcionalidades completas.

**Características:**
- ✅ Título y descripción de la sección
- ✅ Botón "Nuevo Cliente" que redirige a `/clientes/nuevo`
- ✅ Tabla interactiva con datos mock
- ✅ Búsqueda, filtrado y paginación
- ✅ Acciones por cliente: Ver, Editar, Eliminar
- ✅ Notificaciones toast para feedback del usuario
- ✅ Gestión de estado local con useState

**Funcionalidades Implementadas:**
```typescript
- handleView(): Muestra notificación (pendiente implementar vista de detalles)
- handleEdit(): Redirige a página de edición (ruta: /clientes/[id]/editar)
- handleDelete(): Elimina cliente con confirmación
```

**Próximos pasos:**
- [ ] Conectar con API REST
- [ ] Implementar vista de detalles del cliente
- [ ] Implementar página de edición
- [ ] Agregar confirmación con diálogo en lugar de alert nativo
- [ ] Implementar filtros avanzados (por estado, broker, rango de fechas)

---

### 2. **Página Nuevo Cliente** (`/src/app/(dashboard)/clientes/nuevo/page.tsx`)

Página dedicada para registrar nuevos clientes con formulario completo.

**Características:**
- ✅ Botón de retroceso para volver a la lista
- ✅ Título y descripción clara
- ✅ Card container con título y descripción del formulario
- ✅ Formulario completo de registro (ClienteForm)
- ✅ Botón de cancelar con confirmación
- ✅ Redirección automática después de guardar
- ✅ Notificaciones de éxito/error

**Flujo de Trabajo:**
1. Usuario hace clic en "Nuevo Cliente" desde la página principal
2. Se muestra el formulario completo en una página dedicada
3. Usuario completa los campos requeridos
4. Al guardar: notificación de éxito + redirección a lista
5. Al cancelar: confirmación + redirección a lista

**Ventajas de esta implementación:**
- ✅ Más espacio para trabajar con el formulario extenso
- ✅ Mejor experiencia en móviles
- ✅ Evita modales abrumadores con mucha información
- ✅ Navegación clara con breadcrumbs (se puede agregar)
- ✅ URL dedicada para compartir/bookmarking

---

### 3. **Componente ClienteForm Actualizado**

Se agregó funcionalidad de cancelación opcional.

**Props actualizadas:**
```typescript
interface ClienteFormProps {
  onSubmit: (data: ClienteFormData) => void;
  initialData?: Partial<ClienteFormData>;
  isLoading?: boolean;
  onCancel?: () => void; // NUEVO
}
```

**Mejoras:**
- ✅ Botón de cancelar opcional (solo se muestra si se pasa la prop `onCancel`)
- ✅ Reutilizable para crear y editar
- ✅ Estado de carga para deshabilitar botones durante operaciones async

---

## Rutas Implementadas

```
/clientes
├── page.tsx              → Lista de clientes
└── /nuevo
    └── page.tsx          → Formulario de nuevo cliente
```

## Rutas Pendientes (TODO)

```
/clientes
├── /[id]
│   ├── page.tsx          → Vista de detalles del cliente
│   └── /editar
│       └── page.tsx      → Formulario de edición
```

---

## Flujo de Navegación

```
┌─────────────────┐
│ Lista Clientes  │
│  /clientes      │
└────────┬────────┘
         │
         ├─→ [Nuevo Cliente] ──→ ┌──────────────────┐
         │                        │ Nuevo Cliente    │
         │                        │ /clientes/nuevo  │
         │                        └────────┬─────────┘
         │                                 │
         │                    [Guardar] ←──┘
         │                        │
         │                        ↓
         │              ┌─────────────────┐
         ├──────────────│ Lista Clientes  │
         │              └─────────────────┘
         │
         ├─→ [Ver] ─────────→ Vista Detalles (TODO)
         │
         ├─→ [Editar] ──────→ Formulario Edición (TODO)
         │
         └─→ [Eliminar] ────→ Confirmación → Lista Actualizada
```

---

## Datos Mock Utilizados

Se utilizan los `mockClientes` de `/src/lib/constants/mock-clientes.ts`:
- 5 clientes de ejemplo
- Datos completos para testing
- Diferentes estados (activo/inactivo)
- Variedad de tipos de documento

---

## Ejemplo de Uso

### Página Principal (Clientes)
```tsx
'use client';

import { useState } from 'react';
import ClientesTable from '@/components/clientes/ClientesTable';
import { mockClientes } from '@/lib/constants/mock-clientes';

export default function ClientesPage() {
  const [clientes, setClientes] = useState(mockClientes);
  
  // Handlers para las acciones de la tabla
  const handleView = (cliente) => { /* ... */ };
  const handleEdit = (cliente) => { /* ... */ };
  const handleDelete = (cliente) => { /* ... */ };

  return (
    <ClientesTable 
      data={clientes}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
```

### Página Nuevo Cliente
```tsx
'use client';

import ClienteForm from '@/components/clientes/ClienteForm';

export default function NuevoClientePage() {
  const router = useRouter();

  const handleSubmit = (data) => {
    // Llamar API
    toast.success('Cliente registrado');
    router.push('/clientes');
  };

  const handleCancel = () => {
    if (confirm('¿Cancelar?')) {
      router.push('/clientes');
    }
  };

  return (
    <ClienteForm 
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
```

---

## Mejoras Sugeridas

### A Corto Plazo
1. **Agregar Dialog de Confirmación** en lugar de `confirm()` nativo
2. **Implementar vista de detalles** del cliente
3. **Crear página de edición** reutilizando ClienteForm
4. **Agregar Breadcrumbs** para mejor navegación
5. **Validar navegación** al salir con cambios sin guardar

### A Mediano Plazo
6. **Conectar con API REST** para operaciones CRUD reales
7. **Agregar paginación del servidor** para grandes volúmenes
8. **Implementar filtros avanzados** con parámetros de URL
9. **Agregar exportación** a Excel/PDF
10. **Implementar búsqueda por voz** (opcional)

### A Largo Plazo
11. **Historial de cambios** del cliente
12. **Asociar documentos** al cliente
13. **Timeline de actividades** relacionadas
14. **Vista de pólizas** del cliente
15. **Integración con leads** (conversión de lead a cliente)

---

## Componentes UI Utilizados

De **shadcn/ui**:
- ✅ Button
- ✅ Card (CardContent, CardDescription, CardHeader, CardTitle)
- ✅ Input
- ✅ Label
- ✅ Textarea
- ✅ Badge
- ✅ Table (todos los subcomponentes)
- ✅ DropdownMenu
- ✅ Toast (sonner)

De **lucide-react**:
- ✅ Plus (botón nuevo cliente)
- ✅ ArrowLeft (botón volver)
- ✅ Search (búsqueda)
- ✅ Eye, Pencil, Trash2 (acciones de tabla)
- ✅ MoreHorizontal (menú de acciones)

---

## Notas Técnicas

### Estado y Navegación
- Se usa `useState` para gestión local del estado
- `useRouter` de Next.js para navegación programática
- Client components (`'use client'`) por uso de hooks

### Validación
- Zod para schema de validación
- React Hook Form para gestión del formulario
- Validación en tiempo real en el formulario

### Feedback Visual
- Toasts (sonner) para notificaciones
- Confirmaciones antes de acciones destructivas
- Estados de carga en botones

### Accesibilidad
- Labels asociados a inputs
- Textos alternativos en iconos
- Navegación con teclado funcional
