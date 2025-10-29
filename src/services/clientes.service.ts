import { clientsClient as api } from '@/lib/api/api';
import type {
    Cliente,
    CreateClienteDto,
    UpdateClienteDto,
    ClientePaginado,
    ClienteStats
} from '@/types/cliente.interface';

const CLIENTES_BASE_URL = '/clientes';

export interface ContactoCliente {
    idContacto: string;
    idCliente: string;
    nombre: string;
    cargo?: string;
    telefono?: string;
    correo?: string;
    fechaCreacion: string;
}

export interface CreateContactoData {
    nombre: string;
    cargo?: string;
    telefono?: string;
    correo?: string;
}

export const clientesService = {
    /**
     * Obtiene todos los clientes según la jerarquía del usuario autenticado
     * - Admin: Ve todos los clientes
     * - Broker: Ve clientes propios y de sus vendedores
     * - Vendedor: Ve solo sus clientes
     */
    async getAll(filters?: {
        esta_activo?: boolean;
        search?: string;
    }): Promise<Cliente[]> {
        const params = new URLSearchParams();
        if (filters?.esta_activo !== undefined) {
            params.append('esta_activo', filters.esta_activo.toString());
        }
        if (filters?.search) {
            params.append('search', filters.search);
        }

        const queryString = params.toString();
        const url = queryString ? `${CLIENTES_BASE_URL}?${queryString}` : CLIENTES_BASE_URL;

        const response = await api.get<Cliente[]>(url);
        return response.data;
    },

    /**
     * Obtiene clientes con paginación y filtros
     */
    async getPaginated(page: number = 1, limit: number = 10, filters?: {
        esta_activo?: boolean;
        search?: string;
    }): Promise<ClientePaginado> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(filters?.esta_activo !== undefined && { esta_activo: filters.esta_activo.toString() }),
            ...(filters?.search && { search: filters.search }),
        });

        const response = await api.get<ClientePaginado>(`${CLIENTES_BASE_URL}/paginated?${params}`);
        return response.data;
    },

    /**
     * Obtiene un cliente por su ID
     */
    async getById(id: string): Promise<Cliente> {
        const response = await api.get<Cliente>(`${CLIENTES_BASE_URL}/${id}`);
        return response.data;
    },

    /**
     * Crea un nuevo cliente con contactos opcionales
     */
    async create(data: CreateClienteDto & { contactos?: CreateContactoData[] }): Promise<Cliente> {
        console.log('🔧 clientesService.create() - Datos recibidos:', data);
        console.log('🔧 URL del servicio:', CLIENTES_BASE_URL);
        console.log('🔧 Base URL completa:', api.defaults.baseURL + CLIENTES_BASE_URL);

        try {
            const response = await api.post<Cliente>(CLIENTES_BASE_URL, data);
            console.log('✅ Respuesta del servidor:', response.data);
            console.log('✅ Status:', response.status);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error en clientesService.create():', error);
            throw error;
        }
    },

    /**
     * Actualiza un cliente existente
     */
    async update(id: string, data: UpdateClienteDto): Promise<Cliente> {
        const response = await api.put<Cliente>(`${CLIENTES_BASE_URL}/${id}`, data);
        return response.data;
    },

    /**
     * Actualización parcial de un cliente
     */
    async patch(id: string, data: Partial<UpdateClienteDto>): Promise<Cliente> {
        const response = await api.patch<Cliente>(`${CLIENTES_BASE_URL}/${id}`, data);
        return response.data;
    },

    /**
     * Activa un cliente (estaActivo = true)
     */
    async activate(id: string): Promise<Cliente> {
        const response = await api.patch<Cliente>(`${CLIENTES_BASE_URL}/${id}/activate`);
        return response.data;
    },

    /**
     * Desactiva un cliente (estaActivo = false)
     */
    async deactivate(id: string): Promise<{ message: string }> {
        const response = await api.patch(`${CLIENTES_BASE_URL}/${id}/deactivate`);
        return response.data;
    },

    /**
     * Busca cliente por documento
     */
    async findByDocumento(tipoDocumento: string, numeroDocumento: string): Promise<Cliente | null> {
        try {
            const response = await api.get<Cliente>(
                `${CLIENTES_BASE_URL}/documento/${tipoDocumento}/${numeroDocumento}`
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    /**
     * Obtiene estadísticas de clientes
     */
    async getStats(): Promise<ClienteStats> {
        const response = await api.get<ClienteStats>(`${CLIENTES_BASE_URL}/stats`);
        return response.data;
    },

    /**
     * Busca clientes por término (nombre, apellido, email, documento)
     */
    async search(term: string): Promise<Cliente[]> {
        const response = await api.get<Cliente[]>(`${CLIENTES_BASE_URL}?search=${encodeURIComponent(term)}`);
        return response.data;
    },

    /**
     * Descarga la plantilla Excel para subida masiva de clientes
     */
    async downloadTemplate(): Promise<Blob> {
        const response = await api.get('/documents/template', {
            responseType: 'blob',
        });
        return response.data;
    },

    /**
     * Sube archivo Excel para procesamiento masivo de clientes
     */
    async bulkUpload(file: File): Promise<{
        success: number;
        errors: Array<{
            row: number;
            error: string;
        }>;
        total: number;
    }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/documents/bulk-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
