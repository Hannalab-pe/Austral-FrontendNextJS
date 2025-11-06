# 📋 Estructura de Servicios - Leads

## ✅ Problemas Solucionados

### Errores Corregidos:
1. ✅ **Falta de tipado**: Se agregaron tipos explícitos a todos los parámetros `id`
2. ✅ **UpdateLeadDto no importado**: Se importó correctamente desde `lead.interface.ts`
3. ✅ **mutationFn sin tipado**: Se agregaron tipos explícitos en `useUpdate` y `useUpdateStatus`
4. ✅ **Exportación incorrecta**: Se cambió de `leadsApi` a `LeadsService` para consistencia

---

## 🏗️ Estructura Escalable Implementada

### 📁 Archivos Involucrados

```
frontend/src/
├── types/
│   └── lead.interface.ts          # Interfaces y DTOs
├── services/
│   └── leads.service.ts           # Servicio con API + Hooks
└── lib/hooks/
    └── useLeads.ts                # Hook personalizado wrapper
```

---

## 📄 1. lead.interface.ts

**Propósito**: Definir todas las interfaces, tipos y DTOs relacionados con Leads.

### Estructura:
```typescript
// Enums
export type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA';

// Entidades
export interface Lead { ... }
export interface EstadoLead { ... }
export interface FuenteLead { ... }

// DTOs
export interface CreateLeadDto { ... }
export interface UpdateLeadDto extends Partial<CreateLeadDto> {
    id_lead: string;
}

// Filtros y Stats
export interface LeadFilters { ... }
export interface LeadStats { ... }
```

**✅ Buenas Prácticas**:
- Separación clara entre entidades y DTOs
- Uso de `Partial<>` para DTOs de actualización
- Tipos bien documentados

---

## 📄 2. leads.service.ts

**Propósito**: Servicio completo que combina funciones API y hooks de React Query.

### Estructura:

```typescript
// ==========================================
// CONSTANTES
// ==========================================
export const LEADS_QUERY_KEY = ["leads"];

// ==========================================
// API - Funciones de servicio
// ==========================================
const leadsApi = {
  getAll: async (): Promise<Lead[]> => { ... },
  create: async (data: CreateLeadDto): Promise<Lead> => { ... },
  update: async (id: string, data: UpdateLeadDto): Promise<Lead> => { ... },
  updateStatus: async (id: string, idEstado: string): Promise<Lead> => { ... },
  delete: async (id: string): Promise<{ message: string }> => { ... },
};

// ==========================================
// HOOKS - React Query
// ==========================================
const useGetAll = () => { ... };
const useCreate = () => { ... };
const useUpdate = () => { ... };
const useUpdateStatus = () => { ... };
const useDelete = () => { ... };

// ==========================================
// EXPORTACIÓN - Servicio completo
// ==========================================
export const LeadsService = {
  ...leadsApi,
  useGetAll,
  useCreate,
  useUpdate,
  useUpdateStatus,
  useDelete,
};
```

### ✅ Buenas Prácticas Aplicadas:

#### 1. **Tipado Completo**
```typescript
// ❌ ANTES (sin tipos)
update: async (id, data: UpdateLeadDto) => { ... }

// ✅ DESPUÉS (con tipos)
update: async (id: string, data: UpdateLeadDto): Promise<Lead> => { ... }
```

#### 2. **Hooks con Parámetros Tipados**
```typescript
// ❌ ANTES (sin tipo en parámetros)
mutationFn: ({ id, data }) => leadsApi.update(id, data)

// ✅ DESPUÉS (con tipo explícito)
mutationFn: ({ id, data }: { id: string; data: UpdateLeadDto }) => 
  leadsApi.update(id, data)
```

#### 3. **Documentación con JSDoc**
```typescript
/**
 * Hook para actualizar un lead existente
 * @example
 * const mutation = useUpdate();
 * mutation.mutate({ id: "123", data: { nombre: "Nuevo nombre" } });
 */
const useUpdate = () => { ... }
```

#### 4. **Invalidación Automática de Caché**
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
}
```

---

## 📄 3. useLeads.ts

**Propósito**: Hook personalizado que encapsula la lógica de obtener leads.

```typescript
import { LeadsService } from "@/services/leads.service";

export const useLeads = () => {
    const {
        data: leads,
        isLoading,
        isError,
        error,
    } = LeadsService.useGetAll();

    return {
        leads,
        isLoading,
        isError,
        error
    };
};
```

**✅ Ventajas**:
- Simplifica el uso en componentes
- Permite agregar lógica adicional si es necesario
- Mantiene la consistencia en toda la aplicación

---

## 🚀 Uso en Componentes

### Ejemplo 1: Listar Leads
```typescript
import { useLeads } from "@/lib/hooks/useLeads";

export default function LeadsPage() {
  const { leads, isLoading, isError, error } = useLeads();

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {leads?.map(lead => (
        <div key={lead.id_lead}>{lead.nombre}</div>
      ))}
    </div>
  );
}
```

### Ejemplo 2: Crear Lead
```typescript
import { LeadsService } from "@/services/leads.service";

export default function CreateLeadForm() {
  const createMutation = LeadsService.useCreate();

  const handleSubmit = (data: CreateLeadDto) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        console.log("Lead creado exitosamente");
      },
      onError: (error) => {
        console.error("Error al crear lead:", error);
      }
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Ejemplo 3: Actualizar Lead
```typescript
import { LeadsService } from "@/services/leads.service";

export default function EditLeadForm({ leadId }: { leadId: string }) {
  const updateMutation = LeadsService.useUpdate();

  const handleUpdate = (data: UpdateLeadDto) => {
    updateMutation.mutate({
      id: leadId,
      data: data
    });
  };

  return <form onSubmit={handleUpdate}>...</form>;
}
```

### Ejemplo 4: Actualizar Estado
```typescript
import { LeadsService } from "@/services/leads.service";

export default function LeadStatusButton({ leadId, newEstadoId }) {
  const updateStatusMutation = LeadsService.useUpdateStatus();

  const handleClick = () => {
    updateStatusMutation.mutate({
      id: leadId,
      idEstado: newEstadoId
    });
  };

  return <button onClick={handleClick}>Cambiar Estado</button>;
}
```

### Ejemplo 5: Eliminar Lead
```typescript
import { LeadsService } from "@/services/leads.service";

export default function DeleteLeadButton({ leadId }: { leadId: string }) {
  const deleteMutation = LeadsService.useDelete();

  const handleDelete = () => {
    if (confirm("¿Estás seguro?")) {
      deleteMutation.mutate(leadId);
    }
  };

  return <button onClick={handleDelete}>Eliminar</button>;
}
```

---

## 🎯 Ventajas de Esta Estructura

### 1. **Escalabilidad**
- Fácil agregar nuevas funciones al servicio
- Estructura clara y organizada
- Separación de responsabilidades

### 2. **Mantenibilidad**
- Código autodocumentado con JSDoc
- Tipos explícitos evitan errores
- Fácil de entender para nuevos desarrolladores

### 3. **Reutilización**
- Un solo servicio para toda la aplicación
- Hooks reutilizables
- Lógica centralizada

### 4. **Type Safety**
- TypeScript previene errores en tiempo de compilación
- Autocompletado en IDE
- Refactoring seguro

### 5. **Performance**
- Caché automática con React Query
- Invalidación inteligente
- Optimistic updates (se puede agregar)

---

## 📚 Patrón Recomendado para Otros Servicios

Puedes seguir esta misma estructura para otros servicios (clientes, productos, etc.):

```
1. Crear interface: types/[entidad].interface.ts
2. Crear servicio: services/[entidad].service.ts
3. Crear hook wrapper (opcional): lib/hooks/use[Entidad].ts
```

### Ejemplo para Clientes:

```typescript
// types/cliente.interface.ts
export interface Cliente { ... }
export interface CreateClienteDto { ... }
export interface UpdateClienteDto { ... }

// services/clientes.service.ts
export const ClientesService = {
  getAll: async (): Promise<Cliente[]> => { ... },
  create: async (data: CreateClienteDto): Promise<Cliente> => { ... },
  update: async (id: string, data: UpdateClienteDto): Promise<Cliente> => { ... },
  delete: async (id: string): Promise<void> => { ... },
  
  useGetAll: () => { ... },
  useCreate: () => { ... },
  useUpdate: () => { ... },
  useDelete: () => { ... },
};

// lib/hooks/useClientes.ts
export const useClientes = () => {
  return ClientesService.useGetAll();
};
```

---

## ✅ Checklist de Calidad

- [x] Todos los parámetros tienen tipos explícitos
- [x] Todas las funciones tienen tipo de retorno
- [x] Hooks documentados con JSDoc
- [x] Ejemplos de uso en comentarios
- [x] Invalidación de caché configurada
- [x] Manejo de errores consistente
- [x] Nombres descriptivos y consistentes
- [x] Código organizado en secciones claras

---

## 🔧 Próximos Pasos Sugeridos

1. **Agregar hooks adicionales**:
   - `useGetLead(id: string)` - Para obtener un lead específico
   - `useLeadsByStatus(statusId: string)` - Filtrar por estado
   - `useLeadStats()` - Obtener estadísticas

2. **Implementar Optimistic Updates**:
   ```typescript
   onMutate: async (newLead) => {
     await queryClient.cancelQueries({ queryKey: LEADS_QUERY_KEY });
     const previousLeads = queryClient.getQueryData(LEADS_QUERY_KEY);
     queryClient.setQueryData(LEADS_QUERY_KEY, (old) => [...old, newLead]);
     return { previousLeads };
   }
   ```

3. **Agregar paginación**:
   ```typescript
   useGetAllPaginated: (page: number, limit: number) => {
     return useQuery({
       queryKey: [...LEADS_QUERY_KEY, { page, limit }],
       queryFn: () => leadsApi.getAllPaginated(page, limit),
     });
   }
   ```

4. **Implementar búsqueda y filtros**:
   ```typescript
   useSearchLeads: (filters: LeadFilters) => {
     return useQuery({
       queryKey: [...LEADS_QUERY_KEY, filters],
       queryFn: () => leadsApi.search(filters),
       enabled: !!filters.busqueda, // Solo ejecuta si hay búsqueda
     });
   }
   ```

---

## 📖 Recursos Adicionales

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [React Query Patterns](https://tkdodo.eu/blog/practical-react-query)
