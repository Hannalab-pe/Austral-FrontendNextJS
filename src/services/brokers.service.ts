import { apiClient } from '@/lib/api/api';

export interface VendedorBroker {
    idUsuario: string;
    nombreUsuario: string;
    email: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    documentoIdentidad?: string;
    estaActivo: boolean;
    ultimoAcceso?: string;
    fechaCreacion: string;
    cuentaBloqueada: boolean;
    porcentajeComision: number;
    fechaAsignacion: string;
    rol: {
        idRol: string;
        nombre: string;
        descripcion?: string;
    };
}

export interface VendedoresBrokerResponse {
    vendedores: VendedorBroker[];
    total: number;
    activos: number;
}

export interface UpdateVendedorDto {
    nombreUsuario?: string;
    email?: string;
    telefono?: string;
    porcentajeComision?: number;
}

export interface UpdateVendedorResponse {
    vendedor: VendedorBroker;
    brokerVendedor: {
        idBroker: string;
        idVendedor: string;
        porcentajeComision: number;
        fechaAsignacion: string;
    } | null;
}

export interface BrokerMetrics {
    totalVendedores: number;
    vendedoresActivos: number;
    comisionTotalMes: number;
    comisionPromedio: number;
}

export const brokersService = {
    /**
     * Obtener vendedores del broker actual
     */
    async getMyVendedores(): Promise<VendedoresBrokerResponse> {
        try {
            const response = await apiClient.get<VendedoresBrokerResponse>('/auth/my-vendedores');
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
     * Actualizar vendedor del broker actual
     */
    async updateVendedor(vendedorId: string, data: UpdateVendedorDto): Promise<UpdateVendedorResponse> {
        try {
            const response = await apiClient.patch<UpdateVendedorResponse>(`/auth/vendedores/${vendedorId}`, data);
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
     * Obtener métricas del broker actual
     */
    async getMetrics(): Promise<BrokerMetrics> {
        try {
            const response = await apiClient.get<BrokerMetrics>('/auth/my-metrics');
            return response.data;
        } catch (error: unknown) {
            // Si no existe el endpoint, devolver métricas calculadas
            try {
                const vendedores = await this.getMyVendedores();
                const comisionTotal = vendedores.vendedores.reduce((total, vendedor) =>
                    total + (vendedor.porcentajeComision * 100), 0); // Simulación

                return {
                    totalVendedores: vendedores.total,
                    vendedoresActivos: vendedores.activos,
                    comisionTotalMes: comisionTotal,
                    comisionPromedio: vendedores.total > 0 ? comisionTotal / vendedores.total : 0,
                };
            } catch (fallbackError) {
                const message = fallbackError instanceof Error ? fallbackError.message : 'Error al obtener métricas';
                throw new Error(message);
            }
        }
    },
};