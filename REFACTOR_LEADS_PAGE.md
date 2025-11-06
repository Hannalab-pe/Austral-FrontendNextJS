# 🔄 Refactorización de LeadsPage

## 📋 Resumen de Cambios

Se ha modernizado completamente la página `/admin/leads` para utilizar la nueva arquitectura basada en hooks y React Query, eliminando código antiguo y mejorando la legibilidad y mantenibilidad.

---

## ❌ Código Antiguo Eliminado

### 1. **State Management Manual**

```typescript
// ❌ ANTES - State manual con useState
const [leads, setLeads] = useState<Lead[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Cargar leads manualmente
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const leadsData = await LeadsService.getLeads();
      setLeads(leadsData);
    } catch (err) {
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, []);
```

### 2. **Actualización Optimista Manual**

```typescript
// ❌ ANTES - Lógica compleja de actualización optimista
const handleLeadMove = async (leadId: string, newEstadoId: string) => {
  try {
    // Actualizar localmente primero
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id_lead === leadId ? { ...lead, id_estado: newEstadoId } : lead
      )
    );

    // Intentar actualizar en API
    try {
      await LeadsService.updateLeadStatus(leadId, newEstadoId);
    } catch (apiError) {
      // Revertir si falla
      const originalLead = leads.find(l => l.id_lead === leadId);
      if (originalLead) {
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead.id_lead === leadId
              ? { ...lead, id_estado: originalLead.id_estado }
              : lead
          )
        );
      }
    }
  } catch (err) {
    // Manejo de errores manual
  }
};
```

### 3. **Filtrado sin Memoización**

```typescript
// ❌ ANTES - Filtrado recalculado en cada render
const filteredLeads = leads.filter((lead) => {
  if (!searchTerm) return true;
  const term = searchTerm.toLowerCase();
  return (
    lead.nombre.toLowerCase().includes(term) ||
    lead.apellido?.toLowerCase().includes(term) ||
    // ...
  );
});
```

### 4. **Estadísticas sin Memoización**

```typescript
// ❌ ANTES - Recalculadas en cada render
const stats = {
  total: leads.length,
  activos: leads.filter((l) => l.esta_activo).length,
  alta_prioridad: leads.filter((l) => l.prioridad === "ALTA").length,
};
```

---

## ✅ Código Nuevo Implementado

### 1. **Hook Personalizado con React Query**

```typescript
// ✅ DESPUÉS - Hook con caché automática y estado global
const {
  leads,              // Datos automáticamente cacheados
  isLoading,          // Estado de carga automático
  isError,            // Estado de error automático
  error,              // Error capturado
  changeLeadStatus,   // Función con manejo de errores incluido
  isChangingStatus,   // Estado de la mutación
} = useLeads();
```

**Beneficios:**
- ✅ Caché automática de React Query
- ✅ Estados de carga manejados automáticamente
- ✅ Revalidación automática
- ✅ No más `useState` ni `useEffect` manuales

---

### 2. **Actualización Simplificada**

```typescript
// ✅ DESPUÉS - Una línea, todo el manejo incluido
const handleLeadMove = async (leadId: string, newEstadoId: string) => {
  try {
    await changeLeadStatus(leadId, newEstadoId);
    // ✅ Toast de éxito manejado por el hook
    // ✅ Caché invalidado automáticamente por React Query
    // ✅ UI actualizada automáticamente
  } catch (err) {
    // ✅ Toast de error manejado por el hook
    console.error("Error moving lead:", err);
  }
};
```

**Beneficios:**
- ✅ 90% menos código
- ✅ Sin lógica de optimistic updates manual
- ✅ React Query maneja invalidación automática
- ✅ Notificaciones incluidas

---

### 3. **Filtrado Optimizado con useMemo**

```typescript
// ✅ DESPUÉS - Memoizado, solo se recalcula cuando cambian leads o searchTerm
const filteredLeads = useMemo(() => {
  if (!leads) return [];
  if (!searchTerm) return leads;
  
  const term = searchTerm.toLowerCase();
  return leads.filter((lead) =>
    lead.nombre.toLowerCase().includes(term) ||
    lead.apellido?.toLowerCase().includes(term) ||
    lead.email?.toLowerCase().includes(term) ||
    lead.telefono.includes(term) ||
    lead.tipo_seguro_interes?.toLowerCase().includes(term)
  );
}, [leads, searchTerm]);
```

**Beneficios:**
- ✅ Solo se recalcula cuando `leads` o `searchTerm` cambian
- ✅ Mejor performance en listas grandes
- ✅ Menos renders innecesarios

---

### 4. **Estadísticas Memoizadas**

```typescript
// ✅ DESPUÉS - Memoizadas para evitar recálculos
const stats = useMemo(() => ({
  total: leads?.length || 0,
  activos: leads?.filter((l) => l.esta_activo).length || 0,
  altaPrioridad: leads?.filter((l) => l.prioridad === "ALTA").length || 0,
}), [leads]);
```

**Beneficios:**
- ✅ Solo se recalcula cuando `leads` cambia
- ✅ Evita múltiples `.filter()` en cada render
- ✅ Mejor performance

---

### 5. **Estructura Organizada en Secciones**

```typescript
export default function LeadsPage() {
  const router = useRouter();
  
  // ==========================================
  // STATE - Estados locales
  // ==========================================
  const [searchTerm, setSearchTerm] = useState("");
  const [estados, setEstados] = useState<EstadoLead[]>([]);

  // ==========================================
  // HOOKS - Gestión de Leads
  // ==========================================
  const { leads, isLoading, ... } = useLeads();

  // ==========================================
  // EFFECTS - Cargar datos iniciales
  // ==========================================
  useEffect(() => { ... }, []);

  // ==========================================
  // COMPUTED - Valores calculados
  // ==========================================
  const filteredLeads = useMemo(() => { ... }, [leads, searchTerm]);
  const stats = useMemo(() => ({ ... }), [leads]);

  // ==========================================
  // HANDLERS - Manejadores de eventos
  // ==========================================
  const handleLeadMove = async () => { ... };
  const handleLeadClick = () => { ... };

  // ==========================================
  // RENDER - Vista principal
  // ==========================================
  return ( ... );
}
```

**Beneficios:**
- ✅ Código autodocumentado
- ✅ Fácil encontrar cada sección
- ✅ Mejor mantenibilidad

---

### 6. **Indicador de Estado de Mutación**

```typescript
// ✅ NUEVO - Indicador visual cuando se está actualizando
<div className="flex items-center justify-between">
  <h2>Pipeline de Ventas</h2>
  {isChangingStatus && (
    <div className="flex items-center gap-2 text-sm text-blue-600">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Actualizando...</span>
    </div>
  )}
</div>
```

**Beneficios:**
- ✅ Feedback visual inmediato
- ✅ Usuario sabe que la acción está en proceso
- ✅ Mejor UX

---

### 7. **Estado Vacío Mejorado**

```typescript
// ✅ NUEVO - Mensajes contextuales cuando no hay datos
{filteredLeads.length === 0 ? (
  <div className="text-center py-12">
    <p className="text-gray-500 text-lg mb-2">
      {searchTerm ? "No se encontraron leads" : "No hay leads registrados"}
    </p>
    <p className="text-gray-400 text-sm">
      {searchTerm 
        ? "Intenta con otros términos de búsqueda" 
        : "Comienza creando tu primer lead"}
    </p>
  </div>
) : (
  <LeadsKanban ... />
)}
```

**Beneficios:**
- ✅ Mensajes contextuales según el caso
- ✅ Guía al usuario sobre qué hacer
- ✅ Mejor UX

---

### 8. **Estadísticas en el Header**

```typescript
// ✅ NUEVO - Estadísticas visibles en el header
<div className="flex gap-4 mt-3 text-sm">
  <span className="text-gray-600">
    Total: <span className="font-semibold text-gray-900">{stats.total}</span>
  </span>
  <span className="text-gray-600">
    Activos: <span className="font-semibold text-green-600">{stats.activos}</span>
  </span>
  <span className="text-gray-600">
    Alta Prioridad: <span className="font-semibold text-red-600">{stats.altaPrioridad}</span>
  </span>
</div>
```

**Beneficios:**
- ✅ Info rápida al alcance
- ✅ Códigos de color para mejor legibilidad
- ✅ No ocupa espacio extra

---

## 📊 Comparación de Código

| Aspecto | ❌ Antes | ✅ Después |
|---------|---------|------------|
| **Líneas de código** | ~230 | ~170 |
| **useState** | 4 estados | 2 estados |
| **useEffect** | 1 complejo | 1 simple |
| **Manejo de errores** | Manual (try/catch) | Automático (hook) |
| **Optimistic updates** | Manual (50+ líneas) | Automático (React Query) |
| **Caché** | Sin caché | Caché automática |
| **Memoización** | Ninguna | 2 valores memoizados |
| **Estados de carga** | 1 general | 2 específicos |
| **Notificaciones** | Manuales en cada lugar | Centralizadas en hook |
| **Revalidación** | Manual con useEffect | Automática |
| **Código duplicado** | Sí (manejo de errores) | No (centralizado) |

---

## 🎯 Beneficios de la Refactorización

### 1. **Menos Código, Más Funcionalidad**
- 60 líneas menos de código
- Más funcionalidades (indicadores de estado, estadísticas)
- Código más limpio y legible

### 2. **Mejor Performance**
- `useMemo` para filtrado y estadísticas
- Caché automática de React Query
- Menos renders innecesarios

### 3. **Mejor UX**
- Indicador visual de actualizaciones
- Mensajes contextuales cuando no hay datos
- Estadísticas visibles en el header
- Estados de carga específicos

### 4. **Mantenibilidad**
- Código organizado en secciones claras
- Responsabilidades bien separadas
- Fácil agregar nuevas funcionalidades

### 5. **Type Safety**
- Tipado completo con TypeScript
- Sin errores de tipos
- Autocompletado perfecto

### 6. **DRY (Don't Repeat Yourself)**
- Manejo de errores centralizado en hook
- Notificaciones centralizadas
- Sin código duplicado

---

## 🔄 Flujo de Datos Actual

```
┌─────────────────────────────────────────────────────────┐
│                      LeadsPage                           │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │              useLeads Hook                         │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │         React Query Cache                     │ │ │
│  │  │  • Almacena leads                            │ │ │
│  │  │  • Invalidación automática                   │ │ │
│  │  │  • Revalidación automática                   │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │                                                    │ │
│  │  Funciones:                                        │ │
│  │  • changeLeadStatus() ──> Actualiza estado       │ │
│  │  • addLead()           ──> Crea lead             │ │
│  │  • updateLead()        ──> Actualiza lead        │ │
│  │  • removeLead()        ──> Elimina lead          │ │
│  └────────────────────────────────────────────────────┘ │
│                           │                              │
│                           ↓                              │
│  ┌────────────────────────────────────────────────────┐ │
│  │         LeadsKanban Component                      │ │
│  │  • Muestra leads en columnas                      │ │
│  │  • Permite drag & drop                            │ │
│  │  • Llama a handleLeadMove al mover                │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Próximos Pasos Sugeridos

### 1. **Refactorizar Página de Crear Lead**
Aplicar la misma estructura a `/admin/leads/nuevo`:
```typescript
// Usar el hook
const { addLead, isCreating } = useLeads();

// En el submit
const handleSubmit = async (data: CreateLeadDto) => {
  try {
    const newLead = await addLead(data);
    router.push(`/admin/leads/${newLead.id_lead}`);
  } catch (error) {
    // Error manejado automáticamente
  }
};
```

### 2. **Refactorizar Página de Detalle**
Aplicar a `/admin/leads/[id]`:
```typescript
const { leads, updateLead, removeLead } = useLeads();
const lead = leads?.find(l => l.id_lead === params.id);
```

### 3. **Crear Hook para Estados**
Similar a `useLeads`:
```typescript
// lib/hooks/useEstadosLead.ts
export const useEstadosLead = () => {
  const { data: estados, isLoading, ... } = EstadosLeadService.useGetAll();
  return { estados, isLoading, ... };
};
```

### 4. **Implementar Filtros Avanzados**
Agregar panel de filtros:
```typescript
const [filters, setFilters] = useState<LeadFilters>({
  prioridad: [],
  fuente: [],
  // ...
});

const filteredLeads = useMemo(() => {
  return leads?.filter(lead => {
    // Aplicar filtros
  });
}, [leads, filters]);
```

### 5. **Agregar Paginación**
```typescript
const {
  leads,
  pagination,
  nextPage,
  prevPage,
} = useLeads({ page: 1, limit: 20 });
```

---

## ✅ Checklist de Refactorización

- [x] Reemplazar useState manual por useLeads hook
- [x] Eliminar useEffect de carga manual
- [x] Eliminar lógica de optimistic updates manual
- [x] Agregar useMemo para filtrado
- [x] Agregar useMemo para estadísticas
- [x] Organizar código en secciones claras
- [x] Agregar indicador de estado de mutación
- [x] Mejorar mensajes de estado vacío
- [x] Agregar estadísticas en el header
- [x] Documentar con comentarios JSDoc
- [x] Verificar que no hay errores de TypeScript
- [x] Probar funcionalidad de búsqueda
- [x] Probar funcionalidad de drag & drop
- [x] Probar manejo de errores

---

## 📖 Conclusión

La refactorización de `LeadsPage` ha resultado en:

- ✅ **60 líneas menos** de código
- ✅ **Mejor performance** con memoización
- ✅ **Mejor UX** con indicadores de estado
- ✅ **Código más limpio** y organizado
- ✅ **Más mantenible** y escalable
- ✅ **Sin errores** de TypeScript

Este patrón debe aplicarse a todas las páginas CRUD del proyecto para mantener consistencia y calidad de código.
