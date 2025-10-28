import { clientsClient as api } from '@/lib/api/api';
import type {
    ClienteContacto,
    CreateClienteContactoDto
} from '@/types/cliente.interface';

const CONTACTOS_BASE_URL = '/contactos-cliente';

export const contactosClienteService = {
    /**
     * Obtiene todos los contactos de un cliente específico
     */
    async getByClienteId(clienteId: string): Promise<ClienteContacto[]> {
        const response = await api.get<ClienteContacto[]>(`${CONTACTOS_BASE_URL}/cliente/${clienteId}`);
        return response.data;
    },

    /**
     * Crea un nuevo contacto para un cliente
     */
    async create(clienteId: string, data: CreateClienteContactoDto): Promise<ClienteContacto> {
        const response = await api.post<ClienteContacto>(`${CONTACTOS_BASE_URL}/cliente/${clienteId}`, data);
        return response.data;
    },

    /**
     * Actualiza un contacto existente
     */
    async update(contactoId: string, data: Partial<CreateClienteContactoDto>): Promise<ClienteContacto> {
        const response = await api.put<ClienteContacto>(`${CONTACTOS_BASE_URL}/${contactoId}`, data);
        return response.data;
    },

    /**
     * Elimina un contacto
     */
    async delete(contactoId: string): Promise<void> {
        await api.delete(`${CONTACTOS_BASE_URL}/${contactoId}`);
    },

    /**
     * Crea múltiples contactos para un cliente (útil para formularios)
     */
    async createMultiple(clienteId: string, contactos: CreateClienteContactoDto[]): Promise<ClienteContacto[]> {
        const promises = contactos.map(contacto => this.create(clienteId, contacto));
        return await Promise.all(promises);
    },
};