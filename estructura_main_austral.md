# Estructura del Proyecto Austral - Frontend

## 📋 Índice
1. [Visión General](#visión-general)
2. [Arquitectura de Carpetas](#arquitectura-de-carpetas)
3. [Roles y Módulos](#roles-y-módulos)
4. [Estructura de un Módulo](#estructura-de-un-módulo)
5. [Componentes](#componentes)
6. [Server vs Client Components](#server-vs-client-components)
7. [Tipos e Interfaces](#tipos-e-interfaces)
8. [Servicios](#servicios)
9. [Schemas de Validación](#schemas-de-validación)
10. [Custom Hooks con TanStack Query](#custom-hooks-con-tanstack-query)
11. [Componente DataTable Reutilizable](#componente-datatable-reutilizable)
12. [Componentes UI de Shadcn](#componentes-ui-de-shadcn)
13. [Convenciones y Mejores Prácticas](#convenciones-y-mejores-prácticas)
14. [Ejemplo de Referencia: Módulo Clientes](#ejemplo-de-referencia-módulo-clientes)

---

## 🎯 Visión General

El proyecto **Austral** es una aplicación CRM/ERP para gestión de seguros construida con **Next.js 15**, **React 19**, y **TypeScript**. Utiliza el **App Router** de Next.js para aprovechar al máximo los **Server Components** y mejorar el rendimiento, SEO y experiencia de usuario.

### Principios Fundamentales
- **Server Components First**: Maximizar el uso de Server Components para mejor performance y SEO
- **⚠️ camelCase OBLIGATORIO**: Todas las propiedades, variables y datos DEBEN estar en camelCase
- **Separación de Responsabilidades**: Componentes del App Router (server) vs Componentes de UI (client)
- **Tipado Estricto**: TypeScript en todos los archivos con interfaces bien definidas
- **Estructura Modular**: Cada entidad/módulo tiene su propia estructura organizada

---

## 📁 Arquitectura de Carpetas

```
frontend/
├── src/
│   ├── app/
│   │   └── (main)/                    # Layout principal de la aplicación
│   │       ├── admin/                 # Rol: Administrador
│   │       ├── broker/                # Rol: Broker
│   │       ├── vendedor/              # Rol: Vendedor
│   │       └── layout.tsx             # Layout compartido para (main)
│   │
│   ├── components/                    # Componentes reutilizables (Client Components)
│   │   ├── actividades/
│   │   ├── clientes/
│   │   │   ├── forms/                 # Formularios del módulo
│   │   │   ├── tables/                # Tablas del módulo
│   │   │   └── [otros componentes]
│   │   ├── vendedores/
│   │   │   ├── forms/
│   │   │   └── tables/
│   │   ├── polizas/
│   │   ├── common/                    # Componentes comunes
│   │   └── ui/                        # Componentes de UI base
│   │
│   ├── types/                         # Interfaces y tipos TypeScript
│   │   ├── cliente.interface.ts
│   │   ├── vendedor.interface.ts
│   │   ├── poliza.interface.ts
│   │   ├── enums.ts                   # Enums centralizados
│   │   └── ...
│   │
│   ├── services/                      # Servicios para llamadas a API
│   │   ├── clientes.service.ts
│   │   ├── vendedores.service.ts
│   │   ├── polizas.service.ts
│   │   └── ...
│   │
│   ├── lib/                           # Utilidades y configuraciones
│   │   ├── api/                       # Configuración de axios
│   │   ├── hooks/                     # Custom hooks con TanStack Query
│   │   ├── schemas/                   # Esquemas de validación (Zod)
│   │   ├── constants/                 # Constantes y configuraciones
│   │   └── utils.ts                   # Funciones utilitarias
│   │
│   └── store/                         # Estado global (Zustand)
│       └── authStore.ts
```

---

## 👥 Roles y Módulos

El proyecto está organizado por **roles** dentro de `app/(main)/`:

### 1. **Admin** (`/admin`)
- **Descripción**: Panel de administrador con acceso completo al sistema
- **Módulos**:
  - `usuarios/` - Gestión de usuarios del sistema
  - `clientes/` - Gestión de clientes
  - `companias/` - Gestión de compañías de seguros
  - `polizas/` - Gestión de pólizas
  - `siniestros/` - Gestión de siniestros
  - `cotizaciones/` - Gestión de cotizaciones
  - `leads/` - Gestión de leads
  - `actividades/` - Gestión de actividades
  - `auditoria/` - Auditoría del sistema
  - `configuracion/` - Configuraciones generales

### 2. **Broker** (`/broker`)
- **Descripción**: Panel para brokers de seguros
- **Módulos**:
  - `vendedores/` - Gestión de vendedores asociados
  - `clientes/` - Gestión de clientes del broker
  - `actividades/` - Actividades del broker
  - `solicitudes/` - Solicitudes de seguros
  - `notificaciones/` - Notificaciones
  - `perfil/` - Perfil del broker
  - `dashboard/` - Dashboard del broker

### 3. **Vendedor** (`/vendedor`)
- **Descripción**: Panel para vendedores de seguros
- **Módulos**:
  - `clientes/` - Gestión de clientes del vendedor
  - `polizas/` - Pólizas del vendedor
  - `actividades/` - Actividades del vendedor
  - `notificaciones/` - Notificaciones
  - `panel-cumpleanos/` - Panel de cumpleaños de clientes
  - `perfil/` - Perfil del vendedor
  - `dashboard/` - Dashboard del vendedor

---

## 🗂️ Estructura de un Módulo

Cada módulo sigue una estructura **estandarizada** para mantener la consistencia:

```
(main)/[rol]/[modulo]/
├── page.tsx                    # Página principal (Server Component)
├── nuevo/                      # Crear nuevo elemento
│   └── page.tsx               # (Server Component)
└── [id]/                       # Operaciones con ID específico
    ├── page.tsx               # Vista de detalle (Server Component)
    └── editar/                # Editar elemento
        └── page.tsx           # (Server Component)
```

### Ejemplo: Módulo Clientes del Vendedor

```
app/(main)/vendedor/clientes/
├── page.tsx                    # Lista de clientes (Server Component)
├── nuevo/
│   └── page.tsx               # Formulario para nuevo cliente (Server Component)
└── [id]/
    ├── page.tsx               # Detalles del cliente (Server Component)
    └── editar/
        └── page.tsx           # Formulario de edición (Server Component)
```

---

## 🧩 Componentes

Los componentes se organizan en `src/components/` por **módulo/entidad**:

```
components/[modulo]/
├── forms/                      # Formularios del módulo
│   ├── Registrar[Entidad].tsx
│   ├── Editar[Entidad].tsx
│   └── Nuevo[Entidad].tsx
├── tables/                     # Tablas del módulo
│   └── [Entidad]Table.tsx
└── [otros componentes específicos]
```

### Ejemplo: Componentes de Clientes

```
components/clientes/
├── forms/
│   ├── RegistrarCliente.tsx    # Formulario de registro (Client Component)
│   └── EditarCliente.tsx       # Formulario de edición (Client Component)
├── tables/
│   └── ClientesTable.tsx       # Tabla de clientes (Client Component)
├── VerCliente.tsx              # Vista de detalles (Client Component)
├── BulkUploadButton.tsx        # Botón de carga masiva (Client Component)
└── ConsultaDocumento.tsx       # Consulta de documentos (Client Component)
```

### Ejemplo: Componentes de Vendedores

```
components/vendedores/
├── forms/
│   ├── NuevoVendedor.tsx       # Formulario de registro (Client Component)
│   └── EditarVendedor.tsx      # Formulario de edición (Client Component)
└── tables/
    └── VendedoresTable.tsx     # Tabla de vendedores (Client Component)
```

---

## ⚙️ Server vs Client Components

### 🖥️ Server Components (Default)

**Ubicación**: Archivos `page.tsx` en el App Router

**Características**:
- Se renderizan en el servidor
- **NO** pueden usar hooks de React (`useState`, `useEffect`, etc.)
- **NO** pueden usar event handlers (`onClick`, `onChange`, etc.)
- Ideales para:
  - Layouts
  - Páginas estáticas
  - Fetching de datos inicial
  - Metadata SEO

**Ejemplo**:
```tsx
// app/(main)/vendedor/clientes/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ClientesTable from '@/components/clientes/tables/ClientesTable';

export const metadata = {
  title: 'Austral | Clientes',
  description: 'Gestión de clientes para vendedores',
};

export default function ClientesPage() {
  const clientes = []; // Aquí se puede hacer fetch en el servidor

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tu cartera de clientes
          </p>
        </div>
        <Button asChild variant="new">
          <Link href="/vendedor/clientes/nuevo">
            Nuevo Cliente
          </Link>
        </Button>
      </div>

      {/* Client Component importado */}
      <ClientesTable data={clientes} />
    </div>
  );
}
```

### 🎨 Client Components

**Ubicación**: Carpeta `components/`

**Características**:
- Se marcan con `"use client";` al inicio del archivo
- **PUEDEN** usar hooks de React
- **PUEDEN** usar event handlers
- **PUEDEN** usar bibliotecas que requieren el navegador
- Ideales para:
  - Formularios interactivos
  - Tablas con acciones
  - Componentes con estado
  - Interacciones de usuario

**Ejemplo**:
```tsx
// components/vendedores/forms/NuevoVendedor.tsx
"use client";

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Vendedor } from '@/types/vendedor.interface';

export const NuevoVendedor = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Vendedor>();

  const submitHandler = (data: Vendedor) => {
    // Lógica de envío
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      {/* Campos del formulario */}
      <Button type="submit">Registrar Vendedor</Button>
    </form>
  );
};
```

### ✅ Mejores Prácticas

1. **Maximizar Server Components**: Siempre que sea posible, usar Server Components
2. **Client Components Solo Cuando Necesario**: Usar `"use client"` solo en componentes que requieran interactividad
3. **Composición**: Los Server Components pueden importar Client Components, pero no al revés
4. **Metadata**: Solo en Server Components (pages)

---

## 📝 Tipos e Interfaces

Cada entidad tiene su archivo de tipos en `src/types/`:

### Convenciones de Naming

- **Archivo**: `[entidad].interface.ts` (ej: `cliente.interface.ts`)
- **Interface Principal**: `[Entidad]` (ej: `Cliente`)
- **DTOs**: `Create[Entidad]Dto`, `Update[Entidad]Dto`
- **⚠️ Propiedades**: **SIEMPRE camelCase** (ej: `idCliente`, `fechaCreacion`, `nombreCompleto`)

### ⚠️ REGLA CRÍTICA: TODO en camelCase

**TODAS las propiedades de las interfaces DEBEN estar en camelCase.**

✅ **CORRECTO**:
```typescript
export interface Cliente {
  idCliente: string;              // ✅ camelCase
  nombreCompleto: string;         // ✅ camelCase
  fechaCreacion: Date;            // ✅ camelCase
  emailNotificaciones: string;    // ✅ camelCase
  estaActivo: boolean;            // ✅ camelCase
}
```

❌ **INCORRECTO**:
```typescript
export interface Cliente {
  id_cliente: string;              // ❌ snake_case
  NombreCompleto: string;          // ❌ PascalCase
  fecha_creacion: Date;            // ❌ snake_case
  email_notificaciones: string;    // ❌ snake_case
  esta_activo: boolean;            // ❌ snake_case
}
```

### Ejemplo: `types/vendedor.interface.ts`

```typescript
export interface Vendedor {
  idVendedor: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  documentoIdentidad?: string;
  porcentajeComision?: number;
  estaActivo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  usuarioId: string;
  usuario?: Usuario;
}

export interface CreateVendedorDto {
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  documentoIdentidad?: string;
  porcentajeComision?: number;
}

export interface UpdateVendedorDto extends Partial<CreateVendedorDto> {
  estaActivo?: boolean;
}
```

### Enums Centralizados

Los enums se mantienen en `types/enums.ts`:

```typescript
// types/enums.ts
export enum TipoPersona {
  NATURAL = 'NATURAL',
  JURIDICA = 'JURIDICA',
}

export enum TipoDocumento {
  DNI = 'DNI',
  RUC = 'RUC',
  PASAPORTE = 'PASAPORTE',
  CARNET_EXTRANJERIA = 'CARNET_EXTRANJERIA',
}

export enum Moneda {
  USD = 'USD',
  PEN = 'PEN',
}

export enum TipoVigencia {
  MENSUAL = 'MENSUAL',
  TRIMESTRAL = 'TRIMESTRAL',
  SEMESTRAL = 'SEMESTRAL',
  ANUAL = 'ANUAL',
}
```

---

## 🌐 Servicios

Cada entidad tiene su servicio en `src/services/` para las llamadas a la API:

### Convenciones

- **Archivo**: `[entidad].service.ts` (ej: `clientes.service.ts`)
- **Objeto exportado**: `[entidad]Service` (ej: `clientesService`)

### Ejemplo: `services/vendedores.service.ts`

```typescript
import { apiClient } from '@/lib/api/apiClient';
import { 
  Vendedor, 
  CreateVendedorDto, 
  UpdateVendedorDto 
} from '@/types/vendedor.interface';

class VendedoresService {
  private readonly BASE_URL = '/vendedores';

  async getAll(): Promise<Vendedor[]> {
    const response = await apiClient.get<Vendedor[]>(this.BASE_URL);
    return response.data;
  }

  async getById(id: string): Promise<Vendedor> {
    const response = await apiClient.get<Vendedor>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  async create(data: CreateVendedorDto): Promise<Vendedor> {
    const response = await apiClient.post<Vendedor>(this.BASE_URL, data);
    return response.data;
  }

  async update(id: string, data: UpdateVendedorDto): Promise<Vendedor> {
    const response = await apiClient.patch<Vendedor>(`${this.BASE_URL}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.BASE_URL}/${id}`);
  }
}

export const vendedoresService = new VendedoresService();
```

---

## 📋 Convenciones y Mejores Prácticas

### 1. **Naming Conventions**

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes | PascalCase | `ClientesTable`, `NuevoVendedor` |
| Archivos de componentes | PascalCase.tsx | `ClientesTable.tsx` |
| Interfaces | PascalCase | `Cliente`, `CreateClienteDto` |
| Archivos de tipos | kebab-case.interface.ts | `cliente.interface.ts` |
| Servicios | camelCase | `clientesService` |
| Archivos de servicios | kebab-case.service.ts | `clientes.service.ts` |
| **Propiedades** | **camelCase (OBLIGATORIO)** | **`idCliente`, `fechaCreacion`, `nombreCompleto`** |
| Enums | PascalCase | `TipoPersona`, `Moneda` |
| Valores de Enum | UPPER_SNAKE_CASE | `NATURAL`, `JURIDICA` |
| Variables | camelCase | `cliente`, `nombreUsuario` |
| Funciones | camelCase | `handleSubmit()`, `crearCliente()` |
| Hooks | camelCase + use prefix | `useClientes()`, `useVendedores()` |
| Archivos de hooks | use + kebab-case.ts | `useClientes.ts` |

### ⚠️ REGLA CRÍTICA: TODO en camelCase

**TODAS las propiedades, variables, parámetros y nombres de campos DEBEN estar en camelCase.**

✅ **CORRECTO**:
```typescript
export interface Vendedor {
  idVendedor: string;              // ✅ camelCase
  nombres: string;                 // ✅ camelCase
  apellidos: string;               // ✅ camelCase
  fechaCreacion: Date;             // ✅ camelCase
  porcentajeComision: number;      // ✅ camelCase
  estaActivo: boolean;             // ✅ camelCase
}

// En componentes
const { idCliente, nombreCompleto } = cliente;  // ✅ camelCase
const handleCreateCliente = () => { };          // ✅ camelCase
```

❌ **INCORRECTO**:
```typescript
export interface Vendedor {
  id_vendedor: string;              // ❌ snake_case
  Nombres: string;                  // ❌ PascalCase
  fecha_creacion: Date;             // ❌ snake_case
  porcentaje_comision: number;      // ❌ snake_case
  esta_activo: boolean;             // ❌ snake_case
}

// En componentes
const { id_cliente, nombre_completo } = cliente;  // ❌ snake_case
const HandleCreateCliente = () => { };            // ❌ PascalCase
```

### 2. **Estructura de un Page.tsx (Server Component)**

```tsx
// 1. Imports
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import [ComponenteName] from '@/components/[modulo]/...';

// 2. Metadata (solo en Server Components)
export const metadata = {
  title: 'Austral | [Título]',
  description: '[Descripción]',
};

// 3. Componente
export default function [PageName]() {
  // 4. Data fetching (opcional, se puede hacer con async/await)
  
  // 5. Return
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">[Título]</h1>
          <p className="text-muted-foreground">[Descripción]</p>
        </div>
        <Button asChild variant="new">
          <Link href="/[ruta]/nuevo">
            Nuevo [Elemento]
          </Link>
        </Button>
      </div>

      {/* Client Component */}
      <[ComponentName] />
    </div>
  );
}
```

### 3. **Estructura de un Formulario (Client Component)**

```tsx
"use client";

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { [Entity] } from '@/types/[entity].interface';

export const [FormName] = () => {
  // Hooks
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<[Entity]>();

  // Handlers
  const submitHandler = (data: [Entity]) => {
    // Lógica de envío
  };

  // Render
  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {/* Campos del formulario */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
};
```

### 4. **Estructura de una Tabla (Client Component)**

```tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { [Entity] } from '@/types/[entity].interface';
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";

export default function [Entity]Table() {
  // Hooks para data fetching
  const { data, isLoading } = use[Entity]s();

  // Definición de columnas
  const columns: ColumnDef<[Entity]>[] = [
    // ...
  ];

  // Render
  return <DataTable columns={columns} data={data ?? []} />;
}
```

### 5. **Flujo de Navegación Estándar**

```
/[rol]/[modulo]              → Lista/Vista principal
/[rol]/[modulo]/nuevo        → Crear nuevo elemento
/[rol]/[modulo]/[id]         → Ver detalles del elemento
/[rol]/[modulo]/[id]/editar  → Editar elemento
```

### 6. **Imports Ordenados**

```tsx
// 1. React y Next.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 2. Librerías externas
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// 3. Componentes UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 4. Componentes propios
import ClientesTable from '@/components/clientes/tables/ClientesTable';

// 5. Tipos e interfaces
import { Cliente } from '@/types/cliente.interface';

// 6. Servicios y utilidades
import { clientesService } from '@/services/clientes.service';
import { useClientes } from '@/lib/hooks/useClientes';

// 7. Iconos
import { Plus, Trash2, Edit } from 'lucide-react';
```

---

## � Schemas de Validación

Cada entidad debe tener su **schema de validación** usando **Zod** en `src/lib/schemas/`:

### Convenciones

- **Archivo**: `[entidad].schema.ts` (ej: `cliente.schema.ts`)
- **Schema de creación**: `create[Entidad]Schema`
- **Schema de actualización**: `update[Entidad]Schema`
- **Tipos derivados**: Se exportan usando `z.infer<typeof schema>`

### ¿Por qué usar Schemas?

1. **Validación del lado del cliente**: Validar datos antes de enviarlos al backend
2. **Integración con React Hook Form**: Usar `zodResolver` para validaciones automáticas
3. **Tipado automático**: Zod infiere tipos TypeScript desde los schemas
4. **Mensajes de error personalizados**: Mensajes claros y específicos para el usuario
5. **Reutilización**: Un solo schema para formularios de creación y edición

### Ejemplo: `lib/schemas/vendedor.schema.ts`

```typescript
import { z } from 'zod';

/**
 * Schema para validar la creación de un vendedor
 */
export const createVendedorSchema = z.object({
  nombres: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),

  apellidos: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras'),

  email: z.string()
    .email('Debe ser un email válido')
    .min(5, 'El email debe tener al menos 5 caracteres')
    .max(100, 'El email no puede exceder 100 caracteres')
    .toLowerCase(),

  telefono: z.string()
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .regex(/^[0-9+\-\s()]+$/, 'El teléfono solo puede contener números')
    .optional()
    .or(z.literal('')),

  documentoIdentidad: z.string()
    .min(8, 'El documento debe tener al menos 8 caracteres')
    .max(20, 'El documento no puede exceder 20 caracteres')
    .regex(/^[0-9A-Za-z\-]+$/, 'El documento solo puede contener números, letras y guiones')
    .optional()
    .or(z.literal('')),

  porcentajeComision: z.number()
    .min(0, 'La comisión no puede ser negativa')
    .max(100, 'La comisión no puede exceder 100%')
    .optional(),
});

/**
 * Schema para validar la actualización de un vendedor
 */
export const updateVendedorSchema = createVendedorSchema.partial().extend({
  estaActivo: z.boolean().optional(),
});

/**
 * Tipos derivados de los schemas
 */
export type CreateVendedorFormData = z.infer<typeof createVendedorSchema>;
export type UpdateVendedorFormData = z.infer<typeof updateVendedorSchema>;
```

### Uso del Schema en un Formulario

```tsx
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createVendedorSchema, CreateVendedorFormData } from '@/lib/schemas/vendedor.schema';

export const NuevoVendedor = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<CreateVendedorFormData>({
    resolver: zodResolver(createVendedorSchema), // 👈 Validación automática con Zod
  });

  const onSubmit = async (data: CreateVendedorFormData) => {
    // data está validado y tiene el tipo correcto
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('nombres')} />
      {errors.nombres && <span>{errors.nombres.message}</span>}
      {/* Los mensajes de error vienen del schema */}
    </form>
  );
};
```

### Estructura de Carpeta `lib/schemas/`

```
lib/schemas/
├── actividad.schema.ts        # Validaciones para actividades
├── cliente.schema.ts          # Validaciones para clientes
├── compania.schema.ts         # Validaciones para compañías
├── lead.schema.ts             # Validaciones para leads
├── poliza.schema.ts           # Validaciones para pólizas
├── usuario.schema.ts          # Validaciones para usuarios
└── vendedor.schema.ts         # Validaciones para vendedores
```

---

## 🎣 Custom Hooks con TanStack Query

Cada entidad tiene su **custom hook** en `src/lib/hooks/` que encapsula toda la lógica de **fetching** y **mutaciones** usando **TanStack Query**.

### ¿Por qué usar Custom Hooks con TanStack Query?

1. **Caché Automático**: Los datos se cachean automáticamente, reduciendo llamadas al servidor
2. **Estados Manejados**: Loading, error, y success estados manejados automáticamente
3. **Revalidación Inteligente**: Los datos se actualizan cuando es necesario
4. **Optimistic Updates**: Actualizar la UI antes de que el servidor responda
5. **Invalidación de Caché**: Refrescar datos relacionados automáticamente
6. **Reutilización**: Usar el mismo hook en múltiples componentes

### Convenciones

- **Archivo**: `use[Entidad]s.ts` (ej: `useClientes.ts`, `useVendedores.ts`)
- **Hooks de Queries**: `use[Entidad]s()`, `use[Entidad](id)`
- **Hooks de Mutations**: `useCreate[Entidad]()`, `useUpdate[Entidad]()`, `useDelete[Entidad]()`

### Ejemplo: `lib/hooks/useVendedores.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendedoresService } from '@/services/vendedores.service';
import { 
  Vendedor, 
  CreateVendedorDto, 
  UpdateVendedorDto 
} from '@/types/vendedor.interface';
import { toast } from 'sonner';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const vendedoresKeys = {
  all: ['vendedores'] as const,
  lists: () => [...vendedoresKeys.all, 'list'] as const,
  list: (filters?: any) => [...vendedoresKeys.lists(), filters] as const,
  details: () => [...vendedoresKeys.all, 'detail'] as const,
  detail: (id: string) => [...vendedoresKeys.details(), id] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para obtener todos los vendedores
 */
export function useVendedores(filters?: { estaActivo?: boolean }) {
  return useQuery({
    queryKey: vendedoresKeys.list(filters),
    queryFn: () => vendedoresService.getAll(filters),
    staleTime: 30 * 1000, // 30 segundos
  });
}

/**
 * Hook para obtener un vendedor específico por ID
 */
export function useVendedor(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: vendedoresKeys.detail(id),
    queryFn: () => vendedoresService.getById(id),
    enabled: enabled && !!id,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para crear un vendedor
 */
export function useCreateVendedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVendedorDto) => vendedoresService.create(data),
    onSuccess: () => {
      // Invalidar la caché de la lista de vendedores
      queryClient.invalidateQueries({ queryKey: vendedoresKeys.lists() });
      toast.success('Vendedor creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al crear vendedor');
    },
  });
}

/**
 * Hook para actualizar un vendedor
 */
export function useUpdateVendedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVendedorDto }) =>
      vendedoresService.update(id, data),
    onSuccess: (_, { id }) => {
      // Invalidar la caché del vendedor específico y la lista
      queryClient.invalidateQueries({ queryKey: vendedoresKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: vendedoresKeys.lists() });
      toast.success('Vendedor actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar vendedor');
    },
  });
}

/**
 * Hook para desactivar un vendedor
 */
export function useDeactivateVendedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vendedoresService.delete(id),
    onSuccess: () => {
      // Invalidar la caché de la lista de vendedores
      queryClient.invalidateQueries({ queryKey: vendedoresKeys.lists() });
      toast.success('Vendedor desactivado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al desactivar vendedor');
    },
  });
}
```

### Uso de Hooks en Componentes

```tsx
"use client";

import { useVendedores, useCreateVendedor } from '@/lib/hooks/useVendedores';

export default function VendedoresTable() {
  // 1️⃣ Hook de Query para obtener datos
  const { data: vendedores, isLoading, isError } = useVendedores({ estaActivo: true });

  // 2️⃣ Hook de Mutation para crear
  const createVendedor = useCreateVendedor();

  const handleCreate = async (data: CreateVendedorDto) => {
    // 3️⃣ Ejecutar la mutación
    await createVendedor.mutateAsync(data);
    // La caché se invalida automáticamente y la tabla se actualiza
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar vendedores</div>;

  return (
    <div>
      {vendedores?.map(vendedor => (
        <div key={vendedor.idVendedor}>{vendedor.nombres}</div>
      ))}
    </div>
  );
}
```

### Estructura de Carpeta `lib/hooks/`

```
lib/hooks/
├── useActividades.ts          # Hooks para actividades
├── useAuditoria.ts            # Hooks para auditoría
├── useAuth.ts                 # Hooks para autenticación
├── useClientes.ts             # Hooks para clientes
├── useCompanias.ts            # Hooks para compañías
├── usePermissions.ts          # Hooks para permisos
├── useProductos.ts            # Hooks para productos
├── useRoles.ts                # Hooks para roles
├── useUsuarios.ts             # Hooks para usuarios
└── useVendedores.ts           # Hooks para vendedores
```

---

## 📊 Componente DataTable Reutilizable

El proyecto incluye un **componente DataTable reutilizable** en `src/components/common/DataTable.tsx` construido con **TanStack Table**.

### ¿Por qué usar DataTable?

1. **Reutilización**: Un solo componente para todas las tablas del proyecto
2. **Funcionalidades Incluidas**:
   - Paginación automática
   - Ordenamiento por columnas
   - Búsqueda/filtrado global
   - Responsive design
3. **Tipado Fuerte**: TypeScript genérico para type-safety
4. **Consistencia**: Todas las tablas se ven y funcionan igual

### Ubicación

```
components/common/
└── DataTable.tsx              # Componente reutilizable de tabla
```

### Ejemplo de Uso: Tabla de Vendedores

```tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/common/DataTable";
import { Vendedor } from '@/types/vendedor.interface';
import { useVendedores } from '@/lib/hooks/useVendedores';
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function VendedoresTable() {
  // 1️⃣ Obtener datos con el hook
  const { data: vendedores, isLoading } = useVendedores({ estaActivo: true });

  // 2️⃣ Definir columnas de la tabla
  const columns: ColumnDef<Vendedor>[] = [
    {
      accessorKey: "nombres",
      header: "Nombres",
      cell: ({ row }) => (
        <div className="text-sm font-medium">{row.original.nombres}</div>
      ),
    },
    {
      accessorKey: "apellidos",
      header: "Apellidos",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.apellidos}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.original.email}</div>
      ),
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.telefono || '-'}</div>
      ),
    },
    {
      accessorKey: "porcentajeComision",
      header: "Comisión",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.porcentajeComision ? `${row.original.porcentajeComision}%` : '-'}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const vendedor = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // 3️⃣ Renderizar la tabla con DataTable
  return (
    <DataTable
      columns={columns}
      data={vendedores ?? []}
      searchPlaceholder="Buscar vendedores..."
      entityName="vendedores"
      showSearch={true}
      showPagination={true}
      pageSize={10}
    />
  );
}
```

### Props del DataTable

```typescript
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];  // Definición de columnas (TanStack Table)
  data: TData[];                        // Datos a mostrar
  searchPlaceholder?: string;           // Placeholder del input de búsqueda
  entityName?: string;                  // Nombre de la entidad (ej: "vendedores")
  showSearch?: boolean;                 // Mostrar barra de búsqueda (default: true)
  showPagination?: boolean;             // Mostrar paginación (default: true)
  pageSize?: number;                    // Cantidad de registros por página (default: 10)
}
```

### Características del DataTable

- ✅ **Paginación**: Navegación entre páginas con información de registros
- ✅ **Búsqueda Global**: Filtra en todas las columnas
- ✅ **Ordenamiento**: Click en headers para ordenar
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Personalizable**: Props para controlar comportamiento
- ✅ **Type-Safe**: Genéricos de TypeScript para type-safety

---

## 🎨 Componentes UI de Shadcn

El proyecto utiliza **Shadcn UI** como librería de componentes base. Todos los componentes UI están en `src/components/ui/`.

### ¿Por qué Shadcn UI?

1. **Componentes Accesibles**: Construidos sobre Radix UI con ARIA compliant
2. **Personalizable**: Código fuente incluido en el proyecto, puedes modificar
3. **Tailwind CSS**: Estilos con Tailwind, fácil de customizar
4. **Type-Safe**: Totalmente tipado con TypeScript
5. **Copiable**: Se instalan copiando el código, no como dependencia

### Componentes Disponibles

```
components/ui/
├── alert-dialog.tsx           # Diálogos de alerta/confirmación
├── alert.tsx                  # Alertas de información
├── avatar.tsx                 # Avatares de usuario
├── badge.tsx                  # Etiquetas/badges
├── breadcrumb.tsx             # Breadcrumbs de navegación
├── button.tsx                 # Botones (primary, secondary, ghost, etc.)
├── calendar.tsx               # Calendarios
├── card.tsx                   # Tarjetas de contenido
├── carousel.tsx               # Carruseles
├── checkbox.tsx               # Checkboxes
├── collapsible.tsx            # Contenido colapsable
├── date-picker.tsx            # Selector de fechas
├── dialog.tsx                 # Modales/diálogos
├── dropdown-menu.tsx          # Menús desplegables
├── empty.tsx                  # Estado vacío
├── field.tsx                  # Campos de formulario
├── input.tsx                  # Inputs de texto
├── label.tsx                  # Labels para formularios
├── popover.tsx                # Popovers
├── select.tsx                 # Selectores/dropdowns
├── separator.tsx              # Separadores visuales
├── sheet.tsx                  # Side sheets/drawers
├── sidebar.tsx                # Barra lateral
├── skeleton.tsx               # Skeleton loaders
├── spinner.tsx                # Spinner de carga
├── switch.tsx                 # Switches/toggles
├── table.tsx                  # Componentes de tabla
├── tabs.tsx                   # Tabs/pestañas
├── textarea.tsx               # Áreas de texto
└── tooltip.tsx                # Tooltips
```

### Cómo Usar los Componentes UI

#### 1. **Importar el componente**

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
```

#### 2. **Usar en tu componente**

```tsx
export const MiFormulario = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulario de Ejemplo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" placeholder="Ingresa tu nombre" />
        </div>
        <Button type="submit">Guardar</Button>
      </CardContent>
    </Card>
  );
};
```

### Componentes Más Usados

#### **Button**

```tsx
import { Button } from '@/components/ui/button';

// Variantes disponibles
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="new">New</Button>  // Custom variant del proyecto

// Tamaños
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

#### **Input**

```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div>
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="ejemplo@correo.com"
  />
</div>
```

#### **Select**

```tsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Selecciona una opción" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="opcion1">Opción 1</SelectItem>
    <SelectItem value="opcion2">Opción 2</SelectItem>
    <SelectItem value="opcion3">Opción 3</SelectItem>
  </SelectContent>
</Select>
```

#### **Dialog (Modal)**

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título del Modal</DialogTitle>
      <DialogDescription>
        Descripción del contenido del modal
      </DialogDescription>
    </DialogHeader>
    {/* Contenido del modal */}
  </DialogContent>
</Dialog>
```

#### **Card**

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título de la Tarjeta</CardTitle>
    <CardDescription>Descripción de la tarjeta</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Contenido de la tarjeta */}
  </CardContent>
</Card>
```

#### **Alert Dialog (Confirmación)**

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Eliminar</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
      <AlertDialogDescription>
        Esta acción no se puede deshacer.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        Eliminar
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Mejores Prácticas con Componentes UI

1. **Siempre usar los componentes de `components/ui/`**: No crear botones o inputs custom
2. **Personalización con className**: Usar Tailwind para ajustar estilos
3. **Composición**: Combinar componentes para crear interfaces complejas
4. **Accesibilidad**: Los componentes ya son accesibles, no modificar atributos ARIA
5. **Variantes consistentes**: Usar las mismas variantes en todo el proyecto

### Ejemplo Completo: Formulario con Componentes UI

```tsx
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { createVendedorSchema, CreateVendedorFormData } from '@/lib/schemas/vendedor.schema';

export const NuevoVendedor = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateVendedorFormData>({
    resolver: zodResolver(createVendedorSchema),
  });

  const onSubmit = (data: CreateVendedorFormData) => {
    console.log(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Nuevo Vendedor</CardTitle>
        <CardDescription>
          Completa los datos del vendedor para registrarlo en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombres">Nombres *</Label>
              <Input 
                id="nombres" 
                {...register('nombres')} 
                placeholder="Ingresa los nombres"
              />
              {errors.nombres && (
                <p className="text-sm text-destructive">{errors.nombres.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellidos">Apellidos *</Label>
              <Input 
                id="apellidos" 
                {...register('apellidos')} 
                placeholder="Ingresa los apellidos"
              />
              {errors.apellidos && (
                <p className="text-sm text-destructive">{errors.apellidos.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email"
              {...register('email')} 
              placeholder="ejemplo@correo.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input 
              id="telefono" 
              {...register('telefono')} 
              placeholder="+51 999 999 999"
            />
            {errors.telefono && (
              <p className="text-sm text-destructive">{errors.telefono.message}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit">
              Registrar Vendedor
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
```

---

## 📋 Convenciones y Mejores Prácticas

El módulo de clientes del vendedor (`/vendedor/clientes`) es la **referencia perfecta** para crear nuevos módulos:

### Estructura Completa

```
app/(main)/vendedor/clientes/
├── page.tsx                              # Lista de clientes
├── nuevo/
│   └── page.tsx                         # Formulario de nuevo cliente
└── [id]/
    ├── page.tsx                         # Detalles del cliente
    └── editar/
        └── page.tsx                     # Formulario de edición

components/clientes/
├── forms/
│   ├── RegistrarCliente.tsx            # Formulario de registro
│   └── EditarCliente.tsx               # Formulario de edición
├── tables/
│   └── ClientesTable.tsx               # Tabla de clientes
├── VerCliente.tsx                       # Vista de detalles
├── BulkUploadButton.tsx                 # Carga masiva
└── ConsultaDocumento.tsx                # Consulta de documentos

types/
└── cliente.interface.ts                 # Tipos e interfaces

services/
└── clientes.service.ts                  # Servicio de API
```

### Análisis del page.tsx Principal

```tsx
// app/(main)/vendedor/clientes/page.tsx

// 1️⃣ Este es un Server Component (no tiene "use client")
// 2️⃣ Define metadata para SEO
export const metadata = {
  title: 'Austral | Clientes',
  description: 'Interfaz de gestión de clientes para vendedores',
};

export default function ClientesPage() {
  // 3️⃣ Los datos se pueden pre-fetchear aquí (opcional)
  const clientes: Cliente[] = [];

  // 4️⃣ Estructura consistente: Header + Content
  return (
    <div className="space-y-6">
      {/* Header con título y botón de acción */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tu cartera de clientes
          </p>
        </div>
        <div className="flex gap-2">
          <BulkUploadButton />
          <Button asChild variant="new">
            <Link href="/vendedor/clientes/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Link>
          </Button>
        </div>
      </div>

      {/* 5️⃣ Client Component para la tabla interactiva */}
      <ClientesTable data={clientes} />
    </div>
  );
}
```

### Análisis del page.tsx de Nuevo

```tsx
// app/(main)/vendedor/clientes/nuevo/page.tsx

// 1️⃣ Server Component
export const metadata = {
  title: 'Austral | Nuevo Cliente',
  description: 'Crear un nuevo cliente como vendedor',
};

export default function NuevoClientePage() {
  return (
    <div className="space-y-6">
      {/* 2️⃣ Header con navegación de regreso */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/vendedor/clientes">
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nuevo Cliente</h1>
            <p className="text-muted-foreground">
              Registra un nuevo cliente en tu cartera
            </p>
          </div>
        </div>
      </div>

      {/* 3️⃣ Client Component del formulario */}
      <RegistrarCliente />
    </div>
  );
}
```

### Análisis del Client Component (Formulario)

```tsx
// components/clientes/forms/RegistrarCliente.tsx

'use client'; // 1️⃣ Marca como Client Component

import { useForm } from 'react-hook-form'; // 2️⃣ Puede usar hooks

export default function RegistrarCliente() {
  // 3️⃣ Hooks de formulario
  const { register, handleSubmit, formState: { errors } } = useForm<Cliente>();

  // 4️⃣ Handler de submit
  const onSubmit = async (data: Cliente) => {
    try {
      await clientesService.create(data);
      toast.success('Cliente creado exitosamente');
      router.push('/vendedor/clientes');
    } catch (error) {
      toast.error('Error al crear cliente');
    }
  };

  // 5️⃣ Render del formulario con validaciones
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Campos del formulario */}
    </form>
  );
}
```

---

## ✨ Checklist para Crear un Nuevo Módulo

Al crear un nuevo módulo, asegúrate de seguir estos pasos:

### ✅ Paso 1: Definir el Tipo/Interface
- [ ] Crear archivo `types/[entidad].interface.ts`
- [ ] Definir interface principal `[Entidad]`
- [ ] Definir DTOs: `Create[Entidad]Dto`, `Update[Entidad]Dto`
- [ ] Agregar enums necesarios en `types/enums.ts`

### ✅ Paso 2: Crear el Schema de Validación
- [ ] Crear archivo `lib/schemas/[entidad].schema.ts`
- [ ] Definir `create[Entidad]Schema` con validaciones Zod
- [ ] Definir `update[Entidad]Schema` (usualmente `.partial()` del create)
- [ ] Exportar tipos derivados con `z.infer<typeof schema>`

### ✅ Paso 3: Crear el Servicio
- [ ] Crear archivo `services/[entidad].service.ts`
- [ ] Implementar métodos CRUD: `getAll`, `getById`, `create`, `update`, `delete`
- [ ] Exportar instancia del servicio

### ✅ Paso 4: Crear Custom Hooks
- [ ] Crear archivo `lib/hooks/use[Entidad]s.ts`
- [ ] Definir query keys para TanStack Query
- [ ] Implementar hooks de queries: `use[Entidad]s()`, `use[Entidad](id)`
- [ ] Implementar hooks de mutations: `useCreate[Entidad]()`, `useUpdate[Entidad]()`, `useDelete[Entidad]()`
- [ ] Configurar invalidación de caché automática

### ✅ Paso 5: Crear Componentes
- [ ] Crear carpeta `components/[entidad]/`
- [ ] Crear subcarpetas `forms/` y `tables/`
- [ ] Crear formularios con validación (Zod + React Hook Form)
- [ ] Crear tabla usando DataTable con columnas TanStack Table
- [ ] Todos los componentes deben tener `"use client"`
- [ ] Usar componentes de `components/ui/` (Shadcn)

### ✅ Paso 6: Crear Pages en App Router
- [ ] Crear estructura de carpetas en `app/(main)/[rol]/[entidad]/`
- [ ] Crear `page.tsx` principal (lista/vista principal)
- [ ] Crear `nuevo/page.tsx` (formulario de creación)
- [ ] Crear `[id]/page.tsx` (vista de detalle)
- [ ] Crear `[id]/editar/page.tsx` (formulario de edición)
- [ ] Todos los pages deben ser Server Components (sin `"use client"`)
- [ ] Agregar metadata a cada page

### ✅ Paso 7: Validaciones
- [ ] Verificar que todos los imports funcionan
- [ ] Verificar que no hay errores de compilación
- [ ] Probar navegación entre páginas
- [ ] Probar formularios y validaciones con los schemas
- [ ] Verificar que los hooks de TanStack Query funcionan correctamente
- [ ] Validar que la tabla muestra los datos correctamente

---

## 🎯 Resumen de Principios Clave

1. **Server Components por Defecto**: Todo en `app/` es Server Component a menos que se marque con `"use client"`
2. **⚠️ camelCase OBLIGATORIO**: Todas las propiedades, variables y datos en camelCase
3. **Client Components Solo en `components/`**: Los componentes interactivos van en `components/` con `"use client"`
4. **Estructura Consistente**: Todos los módulos siguen la misma estructura (page.tsx, nuevo/, [id]/)
5. **Separación de Responsabilidades**:
   - `types/`: Solo tipos e interfaces (propiedades en camelCase)
   - `services/`: Solo lógica de API
   - `lib/schemas/`: Validaciones con Zod
   - `lib/hooks/`: Custom hooks con TanStack Query
   - `components/`: Solo UI con interactividad
   - `app/`: Solo layouts y estructuras de página
6. **Naming Conventions**: Seguir las convenciones de nombres establecidas (camelCase para propiedades)
7. **TypeScript Estricto**: Todo debe estar tipado
8. **Importar Client Components en Server Components**: Los Server Components pueden importar Client Components, pero no al revés
9. **Validaciones con Zod**: Siempre usar schemas para validar formularios
10. **TanStack Query**: Siempre usar custom hooks para fetching y mutaciones
11. **DataTable Reutilizable**: Usar el componente DataTable para todas las tablas
12. **Componentes UI de Shadcn**: Usar solo componentes de `components/ui/`

---

## 📖 Recursos Adicionales

- [Documentación de Next.js App Router](https://nextjs.org/docs/app)
- [Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Table](https://tanstack.com/table/latest)
- [Shadcn UI](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Última actualización**: 4 de noviembre de 2025
