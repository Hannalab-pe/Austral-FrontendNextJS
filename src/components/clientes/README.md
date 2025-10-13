# Módulo de Clientes - Documentación

## Estructura Creada

### 1. **Interfaces y Tipos** (`/src/types/cliente.interface.ts`)

Define la estructura de datos de un cliente basado en la tabla `cliente` de la base de datos:

```typescript
- Cliente: Interface principal con todos los campos
- TipoDocumento: 'DNI' | 'CE' | 'PASAPORTE' | 'RUC'
- EstadoCivil: 'SOLTERO' | 'CASADO' | 'DIVORCIADO' | 'VIUDO' | 'CONVIVIENTE'
- CreateClienteDto: DTO para crear clientes
- UpdateClienteDto: DTO para actualizar clientes
```

### 2. **Schema de Validación** (`/src/lib/schemas/cliente.schema.ts`)

Validación con Zod para el formulario:
- Campos requeridos: nombre, apellido, email, teléfono, documento, tipo_documento, fecha_nacimiento, dirección
- Campos opcionales: teléfono secundario, ubicación (distrito, provincia, departamento), información laboral, contacto de emergencia
- Validaciones: longitud mínima/máxima, formato de email, UUID para broker

### 3. **Componentes**

#### **ClienteForm** (`/src/components/clientes/ClienteForm.tsx`)
Formulario completo para registro/edición de clientes organizado en 4 secciones:

1. **Información Personal**: nombre, apellido, documento, fecha nacimiento, estado civil
2. **Información de Contacto**: email, teléfonos, dirección completa
3. **Información Laboral**: ocupación, empresa
4. **Contacto de Emergencia**: nombre, teléfono, relación

**Props:**
- `onSubmit`: Callback para manejar el envío del formulario
- `initialData`: Datos iniciales para edición (opcional)
- `isLoading`: Estado de carga (opcional)

#### **ClientesTable** (`/src/components/clientes/ClientesTable.tsx`)
Tabla reutilizable con funcionalidades avanzadas:

**Características:**
- Búsqueda global
- Ordenamiento por columnas
- Paginación
- Filtrado
- Acciones por fila (Ver, Editar, Eliminar)
- Badges para estados
- Menú dropdown de acciones

**Columnas:**
- Documento (tipo + número)
- Nombre Completo (+ email)
- Teléfono
- Dirección
- Broker Asignado
- Estado (Activo/Inactivo)
- Acciones

**Props:**
- `data`: Array de clientes
- `onEdit`: Callback para editar (opcional)
- `onDelete`: Callback para eliminar (opcional)
- `onView`: Callback para ver detalles (opcional)

### 4. **Datos Mock** (`/src/lib/constants/mock-clientes.ts`)

5 clientes de ejemplo con datos completos para testing:
- Juan Pérez García (Ingeniero, Activo)
- María González López (Contadora, Activa)
- Roberto Sánchez Díaz (Médico, Activo)
- Ana Torres Ramírez (Diseñadora, Activa)
- Carlos Mendoza Vargas (Abogado, Inactivo)

## Campos de la Base de Datos

### Campos Principales
- `id_cliente`: UUID (auto-generado)
- `nombre`: varchar(100) - Requerido
- `apellido`: varchar(100) - Requerido
- `email`: varchar(255) - Requerido, único
- `telefono`: varchar(20) - Requerido
- `telefono_secundario`: varchar(20) - Opcional
- `documento_identidad`: varchar(20) - Requerido, único
- `tipo_documento`: varchar(10) - Requerido (DNI, CE, PASAPORTE, RUC)
- `fecha_nacimiento`: date - Requerido

### Ubicación
- `direccion`: text - Requerido
- `distrito`: varchar(100) - Opcional
- `provincia`: varchar(100) - Opcional
- `departamento`: varchar(100) - Opcional

### Información Adicional
- `ocupacion`: varchar(150) - Opcional
- `empresa`: varchar(200) - Opcional
- `estado_civil`: varchar(20) - Opcional

### Contacto de Emergencia
- `contacto_emergencia_nombre`: varchar(200) - Opcional
- `contacto_emergencia_telefono`: varchar(20) - Opcional
- `contacto_emergencia_relacion`: varchar(50) - Opcional

### Relaciones y Metadata
- `esta_activo`: boolean - Default: true
- `fecha_registro`: timestamp - Default: now()
- `id_lead`: uuid - Opcional (FK a tabla lead)
- `broker_asignado`: uuid - Opcional (FK a tabla usuario)

## Índices en la Base de Datos
- `idx_cliente_activo`: Índice en campo `esta_activo`
- `idx_cliente_broker`: Índice en campo `broker_asignado`
- `idx_cliente_cumpleanos`: Índice compuesto en mes y día de `fecha_nacimiento`
- `idx_cliente_documento`: Índice en campo `documento_identidad`
- `idx_cliente_email`: Índice en campo `email`

## Próximos Pasos

1. **Crear la página de clientes** en `/src/app/(dashboard)/clientes/page.tsx`
2. **Implementar servicios API** para CRUD de clientes
3. **Conectar componentes con backend** (actualmente usan datos mock)
4. **Agregar diálogo/modal** para crear/editar clientes
5. **Implementar vista de detalles** de cliente
6. **Agregar filtros avanzados** (por estado, broker, fecha registro, etc.)
7. **Exportar datos** a Excel/PDF

## Uso de los Componentes

```tsx
// Ejemplo de uso en página
'use client';

import { useState } from 'react';
import ClientesTable from '@/components/clientes/ClientesTable';
import ClienteForm from '@/components/clientes/ClienteForm';
import { mockClientes } from '@/lib/constants/mock-clientes';
import { ClienteFormData } from '@/lib/schemas/cliente.schema';
import { toast } from 'sonner';

export default function ClientesPage() {
  const [clientes, setClientes] = useState(mockClientes);

  const handleSubmit = (data: ClienteFormData) => {
    console.log('Nuevo cliente:', data);
    toast.success('Cliente registrado exitosamente');
    // Aquí irá la llamada a la API
  };

  const handleEdit = (cliente: Cliente) => {
    console.log('Editar:', cliente);
    // Abrir modal/diálogo con formulario
  };

  const handleDelete = (cliente: Cliente) => {
    console.log('Eliminar:', cliente);
    // Confirmar y eliminar
  };

  return (
    <div>
      <ClientesTable 
        data={clientes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
```
