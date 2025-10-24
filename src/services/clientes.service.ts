import { clientsClient as api } from '@/lib/api/api';
import type {
    Cliente,
    CreateClienteDto,
    UpdateClienteDto,
    ClientePaginado,
    ClienteStats
} from '@/types/cliente.interface';

const CLIENTES_BASE_URL = '/clientes';

export const clientesService = {
    /**
     * Obtiene todos los clientes según la jerarquía del usuario autenticado
     * - Admin: Ve todos los clientes
     * - Broker: Ve clientes propios y de sus vendedores
     * - Vendedor: Ve solo sus clientes
     */
    async getAll(): Promise<Cliente[]> {
        const response = await api.get<Cliente[]>(CLIENTES_BASE_URL);
        return response.data;
    },

    /**
     * Obtiene clientes con paginación y filtros
     */
    async getPaginated(page: number = 1, limit: number = 10, filters?: {
        estaActivo?: boolean;
        search?: string;
    }): Promise<ClientePaginado> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(filters?.estaActivo !== undefined && { estaActivo: filters.estaActivo.toString() }),
            ...(filters?.search && { search: filters.search }),
        });

        const response = await api.get<ClientePaginado>(`${CLIENTES_BASE_URL}?${params}`);
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
     * Crea un nuevo cliente
     * - registradoPor se asigna automáticamente desde el token JWT
     * - brokerAsignado se asigna según el rol:
     *   - Admin: no asigna broker
     *   - Broker: se asigna a sí mismo
     *   - Vendedor: se asigna su supervisor (broker)
     */
    async create(data: CreateClienteDto): Promise<Cliente> {
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
        const response = await api.patch<Cliente>(`${CLIENTES_BASE_URL}/${id}/activar`);
        return response.data;
    },

    /**
     * Desactiva un cliente (estaActivo = false)
     */
    async deactivate(id: string): Promise<Cliente> {
        const response = await api.patch<Cliente>(`${CLIENTES_BASE_URL}/${id}/desactivar`);
        return response.data;
    },

    /**
     * Obtiene estadísticas de clientes
     */
    async getStats(): Promise<ClienteStats> {
        const clientes = await this.getAll();
        return {
            total: clientes.length,
            activos: clientes.filter(c => c.estaActivo).length,
            inactivos: clientes.filter(c => !c.estaActivo).length,
        };
    },

    /**
     * Busca clientes por término (nombre, apellido, email, documento)
     */
    async search(term: string): Promise<Cliente[]> {
        const response = await api.get<Cliente[]>(`${CLIENTES_BASE_URL}?search=${encodeURIComponent(term)}`);
        return response.data;
    },
};
