# Módulo de Leads - Austral CRM

## 📋 Descripción

El módulo de Leads es uno de los componentes más importantes del CRM, diseñado para gestionar oportunidades de negocio a través de una interfaz Kanban interactiva con funcionalidad de drag & drop.

## 🎯 Características Principales

### Vista Kanban
- **7 Columnas de Estados**: Nuevo → Contactado → Calificado → Propuesta Enviada → En Negociación → Ganado/Perdido
- **Drag & Drop**: Mueve leads entre columnas arrastrándolos
- **Colores Personalizados**: Cada columna tiene su color distintivo basado en el estado
- **Contador de Leads**: Cada columna muestra el número de leads en esa etapa

### Tarjetas de Lead (LeadCard)
Cada tarjeta muestra:
- Nombre completo del lead
- Tipo de seguro de interés
- Email y teléfono de contacto
- Presupuesto aproximado
- Barra de puntaje de calificación (0-100%)
- Badge de prioridad (Alta/Media/Baja)
- Usuario asignado
- Próxima fecha de seguimiento
- Notas (primeras líneas)

### Funcionalidades
- ✅ Búsqueda en tiempo real
- ✅ Filtrado por múltiples criterios
- ✅ Estadísticas en dashboard
- ✅ Formulario completo de creación/edición
- ✅ Validación con Zod
- ✅ Notificaciones con Sonner
- ✅ Responsive design

## 📁 Estructura de Archivos

```
frontend/src/
├── types/
│   └── lead.interface.ts          # Interfaces y tipos TypeScript
├── lib/
│   ├── schemas/
│   │   └── lead.schema.ts         # Validación Zod
│   └── constants/
│       ├── mock-estados-lead.ts   # Estados del flujo (7 estados)
│       ├── mock-fuentes-lead.ts   # Fuentes de captación (10 fuentes)
│       └── mock-leads.ts          # Datos de ejemplo (13 leads)
├── components/
│   └── leads/
│       ├── LeadCard.tsx           # Tarjeta individual de lead
│       ├── KanbanColumn.tsx       # Columna del kanban
│       ├── LeadsKanban.tsx        # Vista kanban principal con DnD
│       └── LeadForm.tsx           # Formulario crear/editar
└── app/(dashboard)/
    └── leads/
        ├── page.tsx               # Vista principal con kanban
        └── nuevo/
            └── page.tsx           # Formulario nuevo lead
```

## 🗄️ Modelo de Datos

### Lead
```typescript
{
  id_lead: string;
  nombre: string;
  apellido?: string;
  email?: string;
  telefono: string;
  fecha_nacimiento?: string;
  tipo_seguro_interes?: string;
  presupuesto_aproximado?: number;
  notas?: string;
  puntaje_calificacion: number;      // 0-100
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  fecha_primer_contacto: string;
  fecha_ultimo_contacto?: string;
  proxima_fecha_seguimiento?: string;
  id_estado: string;
  id_fuente: string;
  asignado_a_usuario?: string;
  esta_activo: boolean;
  fecha_creacion: string;
}
```

### Estados del Flujo
1. **Nuevo** 🟢 - Leads recién ingresados
2. **Contactado** 🔵 - Primer contacto realizado
3. **Calificado** 🟣 - Prospecto viable
4. **Propuesta Enviada** 🟡 - Cotización enviada
5. **En Negociación** 🌸 - Negociando términos
6. **Ganado** 🟢 - Convertido en cliente
7. **Perdido** 🔴 - No convertido

### Fuentes de Captación
- Sitio Web
- Redes Sociales
- Referido
- Llamada Entrante
- Email
- Campaña Publicitaria
- Evento/Feria
- WhatsApp
- Visita en Oficina
- Asociado

## 🛠️ Tecnologías Utilizadas

- **@hello-pangea/dnd**: Librería de drag & drop (fork mantenido de react-beautiful-dnd)
- **React Hook Form**: Gestión de formularios
- **Zod**: Validación de esquemas
- **shadcn/ui**: Componentes de UI
- **Lucide React**: Iconos
- **Sonner**: Notificaciones toast
- **date-fns**: Manipulación de fechas
- **TypeScript**: Type safety

## 🎨 Diseño y UX

### Paleta de Colores
- **Nuevo**: `#10B981` (Verde)
- **Contactado**: `#3B82F6` (Azul)
- **Calificado**: `#8B5CF6` (Púrpura)
- **Propuesta Enviada**: `#F59E0B` (Ámbar)
- **En Negociación**: `#EC4899` (Rosa)
- **Ganado**: `#059669` (Verde oscuro)
- **Perdido**: `#EF4444` (Rojo)

### Prioridades
- **Alta**: Badge rojo
- **Media**: Badge amarillo
- **Baja**: Badge azul

### Animaciones
- Transición suave al arrastrar cards
- Efecto de hover en las tarjetas
- Indicador visual de zona de drop
- Feedback visual al mover entre columnas

## 📝 Uso

### Ver Leads (Vista Kanban)
```typescript
// Navega a: /leads
// - Visualiza todos los leads organizados por estado
// - Arrastra y suelta para cambiar de estado
// - Busca por nombre, email, teléfono
// - Filtra por prioridad, fuente, usuario
```

### Crear Nuevo Lead
```typescript
// Navega a: /leads/nuevo
// - Completa el formulario
// - Selecciona estado inicial
// - Selecciona fuente de captación
// - Asigna prioridad
// - Guarda y regresa al kanban
```

### Mover Lead entre Estados
```typescript
// En la vista kanban:
// 1. Haz click y arrastra una tarjeta de lead
// 2. Suéltala en la columna del nuevo estado
// 3. Se actualiza automáticamente
// 4. Notificación confirma el cambio
```

## 🔄 Flujo de Trabajo

1. **Captación**: Lead ingresa al sistema (Estado: Nuevo)
2. **Primer Contacto**: Se contacta al lead (Estado: Contactado)
3. **Calificación**: Se evalúa viabilidad (Estado: Calificado)
4. **Cotización**: Se envía propuesta (Estado: Propuesta Enviada)
5. **Negociación**: Se ajustan términos (Estado: En Negociación)
6. **Cierre**: Se convierte en cliente (Estado: Ganado) o se pierde (Estado: Perdido)

## 📊 Estadísticas

La vista principal muestra:
- **Total de Leads**: Contador general
- **Leads Activos**: Solo los que están en proceso
- **Alta Prioridad**: Leads que requieren atención inmediata

## 🚀 Próximas Mejoras

- [ ] Página de detalle de lead (`/leads/[id]`)
- [ ] Página de edición de lead (`/leads/[id]/editar`)
- [ ] Modal de vista rápida al hacer click en card
- [ ] Filtros avanzados (sidebar)
- [ ] Exportación a Excel/CSV
- [ ] Asignación masiva de leads
- [ ] Timeline de actividades por lead
- [ ] Gráficas de conversión
- [ ] Notificaciones de seguimiento
- [ ] Integración con calendario para reuniones
- [ ] Plantillas de email para comunicación
- [ ] Sistema de puntuación automática (lead scoring)

## 🔗 Relaciones con Otros Módulos

- **Clientes**: Un lead ganado se convierte en cliente
- **Tareas**: Se pueden crear tareas asociadas a leads
- **Actividades**: Registro de interacciones con el lead
- **Usuarios**: Asignación de leads a usuarios/brokers
- **Notificaciones**: Alertas de seguimiento

## 💡 Notas Técnicas

### Drag & Drop
- Usa `@hello-pangea/dnd` para funcionalidad de arrastrar y soltar
- Implementado con `DragDropContext`, `Droppable` y `Draggable`
- Animaciones CSS personalizadas para feedback visual
- Manejo de estados local hasta sincronización con API

### Validación
- Schema Zod completo con mensajes personalizados
- Validación en tiempo real con React Hook Form
- Sanitización de inputs
- Mensajes de error claros y específicos

### Performance
- Uso de `useMemo` para cálculos costosos
- Filtrado en el cliente para respuesta instantánea
- Cards optimizadas sin re-renders innecesarios
- Lazy loading preparado para grandes volúmenes

---

**Creado por**: Sistema CRM Austral  
**Fecha**: Octubre 2025  
**Versión**: 1.0.0
