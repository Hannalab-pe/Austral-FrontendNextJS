# API Configuration

## 📡 Cliente HTTP Centralizado

Este directorio contiene la configuración centralizada de Axios para toda la aplicación.

## 🏗️ Estructura

```
lib/api/
├── api.ts              # Configuración principal de Axios
└── README.md           # Este archivo
```

## 🔧 Uso

### Cliente Principal (`apiClient`)

Cliente configurado con la URL base y los interceptores globales:

```typescript
import { apiClient } from '@/lib/api/api';

// GET request
const response = await apiClient.get('/auth/profile');

// POST request
const response = await apiClient.post('/auth/login', {
  usuario: 'admin',
  contrasena: 'password'
});

// PUT request
const response = await apiClient.put('/clientes/123', clientData);

// DELETE request
const response = await apiClient.delete('/clientes/123');
```

### Crear Servicios Específicos

Para crear un nuevo servicio (clientes, leads, polizas, etc.):

```typescript
// services/clientes.service.ts
import { apiClient } from '@/lib/api/api';
import { Cliente } from '@/types/cliente.interface';

export const clientesService = {
  async getAll(): Promise<Cliente[]> {
    const response = await apiClient.get<Cliente[]>('/clientes');
    return response.data;
  },

  async getById(id: string): Promise<Cliente> {
    const response = await apiClient.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  async create(data: Omit<Cliente, 'id_cliente'>): Promise<Cliente> {
    const response = await apiClient.post<Cliente>('/clientes', data);
    return response.data;
  },

  async update(id: string, data: Partial<Cliente>): Promise<Cliente> {
    const response = await apiClient.put<Cliente>(`/clientes/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/clientes/${id}`);
  },
};
```

### Función Helper `createServiceClient`

Para casos donde necesites una instancia específica:

```typescript
import { createServiceClient } from '@/lib/api/api';

// Cliente específico para un microservicio
const notificationsClient = createServiceClient('/notifications');

// Luego configura interceptores específicos si es necesario
notificationsClient.interceptors.request.use(/* ... */);
```

## ⚙️ Configuración

### Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Si no está definida, se usa `http://localhost:3000` por defecto.

### Interceptores Configurados

#### Request Interceptor
- **Función**: Agrega automáticamente el token JWT a los headers
- **Storage**: Lee de `localStorage.getItem('auth-token')`
- **Header**: `Authorization: Bearer {token}`

#### Response Interceptor
- **Función**: Maneja errores de autenticación globalmente
- **Status 401**: Limpia localStorage y redirige a `/login`
- **Otros errores**: Los propaga para manejo específico

## 🔒 Seguridad

### Token Storage
- El token se lee de `localStorage.getItem('auth-token')`
- Se limpia automáticamente en errores 401

### Cookies
- `withCredentials: true` permite enviar cookies HTTP-only
- Útil para refresh tokens y CSRF protection

## 📝 Ejemplo Completo: Servicio de Leads

```typescript
// services/leads.service.ts
import axios from 'axios';
import { apiClient } from '@/lib/api/api';
import { Lead, LeadEstado } from '@/types/lead.interface';

export const leadsService = {
  /**
   * Obtener todos los leads
   */
  async getAll(): Promise<Lead[]> {
    try {
      const response = await apiClient.get<Lead[]>('/leads');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error al obtener leads');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Crear nuevo lead
   */
  async create(data: Omit<Lead, 'id_lead'>): Promise<Lead> {
    try {
      const response = await apiClient.post<Lead>('/leads', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error al crear lead');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Actualizar estado de un lead (para drag & drop)
   */
  async updateEstado(id: string, estado: LeadEstado): Promise<Lead> {
    try {
      const response = await apiClient.patch<Lead>(`/leads/${id}/estado`, { estado });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error al actualizar lead');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Eliminar lead
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/leads/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error al eliminar lead');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};
```

## 🚀 Beneficios

1. **DRY (Don't Repeat Yourself)**: Configuración única
2. **Mantenibilidad**: Cambios en un solo lugar
3. **Consistencia**: Todos los servicios usan la misma configuración
4. **Seguridad**: Token management centralizado
5. **Error Handling**: Interceptores globales
6. **Type Safety**: TypeScript con tipos genéricos

## 🔄 Migración desde auth.service.ts

**Antes:**
```typescript
// Cada servicio tenía su propia instancia
const axiosInstance = axios.create({ ... });
```

**Después:**
```typescript
// Todos los servicios usan apiClient
import { apiClient } from '@/lib/api/api';
```

## 📚 Próximas Mejoras

- [ ] Retry logic para requests fallidos
- [ ] Request cancellation con AbortController
- [ ] Rate limiting
- [ ] Request/Response logging en desarrollo
- [ ] Cache de responses con TTL
- [ ] Refresh token automático
- [ ] Offline queue para requests
- [ ] Progress tracking para uploads
