import { apiClient } from '@/lib/api/api';

export interface CreateVendedorDto {
    nombreUsuario: string;
    email: string;
    contrasena: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    documentoIdentidad?: string;
    porcentajeComision: number;
}

export interface UpdateVendedorDto {
    nombreUsuario?: string;
    email?: string;
    telefono?: string;
    porcentajeComision?: number;
}

export interface VendedorResponse {
    idUsuario: string;
    nombreUsuario: string;
    email: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    documentoIdentidad?: string;
    estaActivo: boolean;
    porcentajeComision: number;
    relacionActiva: boolean;
    fechaAsignacion: string;
}

export interface VendedoresPaginadosResponse {
    data: VendedorResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const vendedoresService = {
    /**
     * Crear nuevo vendedor (se asigna automáticamente al broker autenticado)
     */
    async create(data: CreateVendedorDto): Promise<VendedorResponse> {
        try {
            const response = await apiClient.post<VendedorResponse>('/auth/vendedores', data);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error &&
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                (error as { response?: { data?: { message?: string } } }).response?.data?.message
                ? (error as { response: { data: { message: string } } }).response.data.message
                : 'Error al crear vendedor';
            throw new Error(message);
        }
    },

    /**
     * Obtener todos los vendedores del broker autenticado
     */
    async getAll(estaActivo?: boolean, search?: string): Promise<VendedorResponse[]> {
        try {
            const params = new URLSearchParams();
            if (estaActivo !== undefined) params.append('esta_activo', String(estaActivo));
            if (search) params.append('search', search);

            const response = await apiClient.get<VendedorResponse[]>(
                `/auth/vendedores${params.toString() ? `?${params.toString()}` : ''}`
            );
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error &&
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                (error as { response?: { data?: { message?: string } } }).response?.data?.message
                ? (error as { response: { data: { message: string } } }).response.data.message
                : 'Error al obtener vendedores';
            throw new Error(message);
        }
    },

    /**
     * Obtener vendedores con paginación
     */
    async getAllPaginated(
        page: number = 1,
        limit: number = 10,
        estaActivo?: boolean,
        search?: string
    ): Promise<VendedoresPaginadosResponse> {
        try {
            const params = new URLSearchParams();
            params.append('page', String(page));
            params.append('limit', String(limit));
            if (estaActivo !== undefined) params.append('esta_activo', String(estaActivo));
            if (search) params.append('search', search);

            const response = await apiClient.get<VendedoresPaginadosResponse>(
                `/auth/vendedores/paginado?${params.toString()}`
            );
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error &&
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                (error as { response?: { data?: { message?: string } } }).response?.data?.message
                ? (error as { response: { data: { message: string } } }).response.data.message
                : 'Error al obtener vendedores paginados';
            throw new Error(message);
        }
    },

    /**
     * Obtener un vendedor por ID
     */
    async getById(id: string): Promise<VendedorResponse> {
        try {
            const response = await apiClient.get<VendedorResponse>(`/auth/vendedores/${id}`);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error &&
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                (error as { response?: { data?: { message?: string } } }).response?.data?.message
                ? (error as { response: { data: { message: string } } }).response.data.message
                : 'Error al obtener vendedor';
            throw new Error(message);
        }
    },

    /**
     * Actualizar vendedor
     */
    async update(id: string, data: UpdateVendedorDto): Promise<VendedorResponse> {
        try {
            const response = await apiClient.put<VendedorResponse>(`/auth/vendedores/${id}`, data);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error &&
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                (error as { response?: { data?: { message?: string } } }).response?.data?.message
                ? (error as { response: { data: { message: string } } }).response.data.message
                : 'Error al actualizar vendedor';
            throw new Error(message);
        }
    },

    /**
     * Desactivar vendedor
     */
    async remove(id: string): Promise<{ message: string }> {
        try {
            const response = await apiClient.delete<{ message: string }>(`/auth/vendedores/${id}`);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error &&
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                (error as { response?: { data?: { message?: string } } }).response?.data?.message
                ? (error as { response: { data: { message: string } } }).response.data.message
                : 'Error al desactivar vendedor';
            throw new Error(message);
        }
    },

    /**
     * Reactivar vendedor
     */
    async activate(id: string): Promise<VendedorResponse> {
        try {
            const response = await apiClient.patch<VendedorResponse>(`/auth/vendedores/${id}/activar`);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error &&
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                (error as { response?: { data?: { message?: string } } }).response?.data?.message
                ? (error as { response: { data: { message: string } } }).response.data.message
                : 'Error al reactivar vendedor';
            throw new Error(message);
        }
    },
};
