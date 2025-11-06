# 🎯 Mejoras en useLeads Hook

## ✅ Problemas Corregidos

### 1. **Error: `response?.message` no existe en Lead** ❌→✅

**Problema Anterior:**
```typescript
const response = await createLead.mutateAsync(data);
const successMessage = response?.message || "Lead creado con éxito";
```

**¿Por qué fallaba?**
- `create()` retorna un `Lead`, no un objeto con `message`
- Solo `delete()` retorna `{ message: string }`

**Solución:**
```typescript
const lead = await createMutation.mutateAsync(data);
toast.success("Lead creado con éxito");
return lead; // Retorna el Lead completo
```

---

### 2. **Error: Tipado incorrecto de errores** ❌→✅

**Problema Anterior:**
```typescript
catch (error) {
    const errorMessage = 
        error?.response?.data?.message || // ❌ 'response' no existe en tipo '{}'
        error?.message ||                 // ❌ 'message' no existe en tipo '{}'
        "Error al crear el lead";
}
```

**¿Por qué fallaba?**
- TypeScript no sabe el tipo de `error` en el bloque `catch`
- Por defecto es `unknown`, no tiene propiedades tipadas

**Solución:**
```typescript
catch (err) {
    const errorMessage = getErrorMessage(err, "Error al crear el lead");
    toast.error(errorMessage);
    throw err;
}

// Función auxiliar con type guards
function getErrorMessage(error: unknown, defaultMessage: string): string {
    if (error && typeof error === 'object') {
        // Error de Axios
        if ('response' in error && error.response && typeof error.response === 'object') {
            const response = error.response as { data?: { message?: string } };
            if (response.data?.message) {
                return response.data.message;
            }
        }
        
        // Error estándar
        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }
    }
    
    return defaultMessage;
}
```

---

### 3. **Error: Desestructuración incorrecta - `idLead` vs `id_lead`** ❌→✅

**Problema Anterior:**
```typescript
const { idLead, ...leadData } = data; // ❌ 'idLead' no existe en UpdateLeadDto

const response = await update.mutateAsync({
    id: idLead,  // ❌ idLead es undefined
    data: leadData,
});
```

**¿Por qué fallaba?**
- La interfaz usa **snake_case**: `id_lead`
- Intentabas acceder con **camelCase**: `idLead`

**Solución:**
```typescript
const { id_lead, ...restData } = data; // ✅ Usa id_lead (snake_case)

const lead = await updateMutation.mutateAsync({
    id: id_lead,  // ✅ Correcto
    data: restData as UpdateLeadDto,
});
```

---

### 4. **Error: Función `updateLead` no exportada** ❌→✅

**Problema Anterior:**
```typescript
return {
    leads,
    isLoading,
    addLead,
    // ❌ updateLead no está aquí
};
```

**Solución:**
```typescript
return {
    // Datos
    leads,
    isLoading,
    isError,
    error,
    refetch,

    // Estados
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isChangingStatus: updateStatusMutation.isPending,

    // Funciones
    addLead,
    updateLead,        // ✅ Ahora exportado
    removeLead,        // ✅ Nuevo
    changeLeadStatus,  // ✅ Nuevo
};
```

---

## 🏗️ Estructura Mejorada

### Organización en Secciones Claras

```typescript
/**
 * Hook personalizado para gestionar Leads
 */
export const useLeads = () => {
    // ==========================================
    // QUERIES - Obtener datos
    // ==========================================
    const { data, isLoading, ... } = LeadsService.useGetAll();

    // ==========================================
    // MUTATIONS - Hooks de React Query
    // ==========================================
    const createMutation = LeadsService.useCreate();
    const updateMutation = LeadsService.useUpdate();
    const deleteMutation = LeadsService.useDelete();
    const updateStatusMutation = LeadsService.useUpdateStatus();

    // ==========================================
    // FUNCIONES - Wrappers con manejo de errores
    // ==========================================
    const addLead = async (data: CreateLeadDto) => { ... };
    const updateLead = async (data: UpdateLeadDto) => { ... };
    const removeLead = async (id: string) => { ... };
    const changeLeadStatus = async (id, idEstado) => { ... };

    // ==========================================
    // RETORNO - API pública del hook
    // ==========================================
    return { ... };
};

// ==========================================
// UTILIDADES - Funciones auxiliares
// ==========================================
function getErrorMessage(error: unknown, defaultMessage: string) { ... }
```

---

## 🎨 Mejoras Implementadas

### 1. **Documentación con JSDoc**

Cada función está documentada:

```typescript
/**
 * Crear un nuevo lead
 * @param data - Datos del lead a crear
 * @returns Promise con el lead creado
 */
const addLead = async (data: CreateLeadDto) => { ... }
```

**Beneficios:**
- Autocompletado en IDE con descripción
- Información de parámetros al pasar el mouse
- Mejor comprensión del código

---

### 2. **Nomenclatura Consistente**

```typescript
// ❌ ANTES: Inconsistente
const createLead = LeadsService.useCreate();  // createLead
const update = LeadsService.useUpdate();      // update

// ✅ DESPUÉS: Consistente
const createMutation = LeadsService.useCreate();
const updateMutation = LeadsService.useUpdate();
const deleteMutation = LeadsService.useDelete();
const updateStatusMutation = LeadsService.useUpdateStatus();
```

**Beneficios:**
- Fácil identificar que son mutaciones
- Código más legible
- Patrón claro para seguir

---

### 3. **Estados de Carga Individuales**

```typescript
return {
    // Estados generales
    isLoading,
    isError,
    
    // Estados específicos de cada operación
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isChangingStatus: updateStatusMutation.isPending,
};
```

**Uso en componentes:**
```typescript
const { addLead, isCreating } = useLeads();

<Button 
    onClick={() => addLead(data)} 
    disabled={isCreating}
>
    {isCreating ? "Creando..." : "Crear Lead"}
</Button>
```

---

### 4. **Funciones con Valor de Retorno**

```typescript
// ✅ Todas las funciones retornan la respuesta
const addLead = async (data: CreateLeadDto) => {
    const lead = await createMutation.mutateAsync(data);
    toast.success("Lead creado con éxito");
    return lead; // ✅ Retorna el lead creado
};
```

**Beneficios:**
```typescript
// Puedes usar el resultado
const lead = await addLead(formData);
console.log("Lead creado:", lead.id_lead);
router.push(`/leads/${lead.id_lead}`);
```

---

### 5. **Función Auxiliar `getErrorMessage`**

Centraliza la lógica de extracción de errores:

```typescript
function getErrorMessage(error: unknown, defaultMessage: string): string {
    if (error && typeof error === 'object') {
        // 1. Error de Axios con respuesta del servidor
        if ('response' in error && error.response && typeof error.response === 'object') {
            const response = error.response as { data?: { message?: string } };
            if (response.data?.message) {
                return response.data.message;
            }
        }
        
        // 2. Error estándar con mensaje
        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }
    }
    
    // 3. Mensaje por defecto
    return defaultMessage;
}
```

**Beneficios:**
- DRY (Don't Repeat Yourself)
- Type-safe con type guards
- Fácil de mantener y testear

---

## 🚀 Uso en Componentes

### Ejemplo 1: Crear Lead

```typescript
"use client";

import { useLeads } from "@/lib/hooks/useLeads";
import { CreateLeadDto } from "@/types/lead.interface";

export default function CreateLeadForm() {
    const { addLead, isCreating } = useLeads();

    const handleSubmit = async (formData: CreateLeadDto) => {
        try {
            const newLead = await addLead(formData);
            console.log("Lead creado:", newLead);
            // Redireccionar o limpiar formulario
        } catch (error) {
            // El error ya fue mostrado con toast.error
            console.error("Error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Campos del formulario */}
            <button type="submit" disabled={isCreating}>
                {isCreating ? "Creando..." : "Crear Lead"}
            </button>
        </form>
    );
}
```

---

### Ejemplo 2: Actualizar Lead

```typescript
"use client";

import { useLeads } from "@/lib/hooks/useLeads";
import { UpdateLeadDto } from "@/types/lead.interface";

export default function EditLeadForm({ leadId }: { leadId: string }) {
    const { updateLead, isUpdating } = useLeads();

    const handleUpdate = async (formData: Partial<UpdateLeadDto>) => {
        try {
            const updatedLead = await updateLead({
                id_lead: leadId,
                ...formData,
            });
            
            console.log("Lead actualizado:", updatedLead);
            // Redireccionar o mostrar confirmación
        } catch (error) {
            // Error manejado automáticamente
        }
    };

    return (
        <form onSubmit={handleUpdate}>
            {/* Campos del formulario */}
            <button type="submit" disabled={isUpdating}>
                {isUpdating ? "Guardando..." : "Guardar Cambios"}
            </button>
        </form>
    );
}
```

---

### Ejemplo 3: Lista de Leads con Todas las Acciones

```typescript
"use client";

import { useLeads } from "@/lib/hooks/useLeads";

export default function LeadsTable() {
    const {
        leads,
        isLoading,
        isError,
        error,
        removeLead,
        changeLeadStatus,
        isDeleting,
        isChangingStatus,
    } = useLeads();

    if (isLoading) return <div>Cargando...</div>;
    if (isError) return <div>Error: {error?.message}</div>;

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro?")) {
            try {
                await removeLead(id);
            } catch (error) {
                // Error manejado
            }
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await changeLeadStatus(id, newStatus);
        } catch (error) {
            // Error manejado
        }
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {leads?.map((lead) => (
                    <tr key={lead.id_lead}>
                        <td>{lead.nombre} {lead.apellido}</td>
                        <td>{lead.email}</td>
                        <td>{lead.estado?.nombre}</td>
                        <td>
                            <button 
                                onClick={() => handleStatusChange(lead.id_lead, "nuevo-estado")}
                                disabled={isChangingStatus}
                            >
                                Cambiar Estado
                            </button>
                            <button 
                                onClick={() => handleDelete(lead.id_lead)}
                                disabled={isDeleting}
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
```

---

## 📊 Comparación Antes vs Después

| Aspecto | ❌ Antes | ✅ Después |
|---------|---------|------------|
| **Tipado de errores** | `error?.message` (sin tipo) | `getErrorMessage(err, default)` (type-safe) |
| **Desestructuración** | `idLead` (incorrecto) | `id_lead` (correcto) |
| **Mensajes de éxito** | `response?.message` (no existe) | Mensajes estáticos claros |
| **Exportación** | Solo `addLead` | Todas las funciones (4) |
| **Estados de carga** | Solo `isLoading` general | Estados individuales por operación |
| **Documentación** | Sin JSDoc | JSDoc completo |
| **Estructura** | Desorganizada | 4 secciones claras |
| **Nomenclatura** | Inconsistente | Consistente (mutations) |
| **Retorno de valores** | `void` | Retorna datos |
| **Reutilización** | Código duplicado | Función `getErrorMessage` |

---

## ✅ Checklist de Calidad

- [x] Todos los errores TypeScript corregidos
- [x] Funciones documentadas con JSDoc
- [x] Nomenclatura consistente
- [x] Estados de carga individuales
- [x] Manejo de errores type-safe
- [x] Todas las funciones retornan valores
- [x] Código organizado en secciones
- [x] Función auxiliar reutilizable
- [x] API pública bien definida
- [x] Ejemplos de uso documentados

---

## 🎯 Beneficios Clave

### 1. **Type Safety** 🛡️
- Sin errores de TypeScript
- Autocompletado perfecto en IDE
- Refactoring seguro

### 2. **Developer Experience** 🚀
- Código autodocumentado
- Fácil de entender y mantener
- Ejemplos claros de uso

### 3. **User Experience** ⭐
- Notificaciones toast automáticas
- Mensajes de error claros
- Estados de carga específicos

### 4. **Mantenibilidad** 🔧
- Estructura clara y organizada
- Fácil agregar nuevas funciones
- Código DRY (sin duplicación)

### 5. **Escalabilidad** 📈
- Patrón replicable para otros hooks
- Fácil extender con nuevas funciones
- Separación clara de responsabilidades

---

## 🔮 Próximos Pasos Sugeridos

### 1. **Agregar Optimistic Updates**

```typescript
const addLead = async (data: CreateLeadDto) => {
    const tempId = `temp-${Date.now()}`;
    
    // Actualizar UI inmediatamente
    queryClient.setQueryData(LEADS_QUERY_KEY, (old) => [
        ...old,
        { ...data, id_lead: tempId }
    ]);
    
    try {
        const lead = await createMutation.mutateAsync(data);
        return lead;
    } catch (err) {
        // Revertir en caso de error
        queryClient.setQueryData(LEADS_QUERY_KEY, old);
        throw err;
    }
};
```

### 2. **Agregar Confirmaciones**

```typescript
const removeLead = async (id: string, skipConfirm = false) => {
    if (!skipConfirm) {
        const confirmed = confirm("¿Estás seguro de eliminar este lead?");
        if (!confirmed) return;
    }
    
    // ... resto del código
};
```

### 3. **Agregar Callbacks**

```typescript
interface AddLeadOptions {
    onSuccess?: (lead: Lead) => void;
    onError?: (error: unknown) => void;
}

const addLead = async (data: CreateLeadDto, options?: AddLeadOptions) => {
    try {
        const lead = await createMutation.mutateAsync(data);
        toast.success("Lead creado con éxito");
        options?.onSuccess?.(lead);
        return lead;
    } catch (err) {
        const errorMessage = getErrorMessage(err, "Error al crear el lead");
        toast.error(errorMessage);
        options?.onError?.(err);
        throw err;
    }
};
```

### 4. **Validación antes de enviar**

```typescript
const addLead = async (data: CreateLeadDto) => {
    // Validación básica
    if (!data.nombre || !data.telefono) {
        toast.error("Nombre y teléfono son requeridos");
        throw new Error("Datos incompletos");
    }
    
    // Validación de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        toast.error("Email inválido");
        throw new Error("Email inválido");
    }
    
    // ... resto del código
};
```

---

## 📖 Recursos

- [TanStack Query - Mutations](https://tanstack.com/query/latest/docs/react/guides/mutations)
- [TypeScript - Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Sonner - Toast Notifications](https://sonner.emilkowal.ski/)
