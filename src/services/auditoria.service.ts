import { apiClient } from '@/lib/api/api';
import {
    Auditoria,
    CreateAuditoriaDto,
    AuditoriaFiltros,
    AuditoriaStats,
} from '@/types/auditoria.interface';

export const auditoriaService = {
    /**
     * Obtiene todos los registros de auditoría con filtros opcionales
     */
    async getAll(filtros?: AuditoriaFiltros): Promise<Auditoria[]> {
        try {
            const params = new URLSearchParams();

            if (filtros?.tabla) {
                params.append('tabla', filtros.tabla);
            }
            if (filtros?.accion) {
                params.append('accion', filtros.accion);
            }
            if (filtros?.fechaDesde) {
                params.append('fecha_desde', filtros.fechaDesde instanceof Date
                    ? filtros.fechaDesde.toISOString().split('T')[0]
                    : filtros.fechaDesde);
            }
            if (filtros?.fechaHasta) {
                params.append('fecha_hasta', filtros.fechaHasta instanceof Date
                    ? filtros.fechaHasta.toISOString().split('T')[0]
                    : filtros.fechaHasta);
            }

            const response = await apiClient.get<Auditoria[]>(
                `/auditoria${params.toString() ? `?${params.toString()}` : ''}`
            );
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error
                ? (error as any).response?.data?.message || error.message
                : 'Error al obtener registros de auditoría';
            throw new Error(message);
        }
    },

    /**
     * Obtiene registros de auditoría por usuario
     */
    async getByUsuario(idUsuario: string, filtros?: AuditoriaFiltros): Promise<Auditoria[]> {
        try {
            const params = new URLSearchParams();

            if (filtros?.tabla) {
                params.append('tabla', filtros.tabla);
            }
            if (filtros?.accion) {
                params.append('accion', filtros.accion);
            }
            if (filtros?.fechaDesde) {
                params.append('fecha_desde', filtros.fechaDesde instanceof Date
                    ? filtros.fechaDesde.toISOString().split('T')[0]
                    : filtros.fechaDesde);
            }
            if (filtros?.fechaHasta) {
                params.append('fecha_hasta', filtros.fechaHasta instanceof Date
                    ? filtros.fechaHasta.toISOString().split('T')[0]
                    : filtros.fechaHasta);
            }

            const response = await apiClient.get<Auditoria[]>(
                `/auditoria/usuario/${idUsuario}${params.toString() ? `?${params.toString()}` : ''}`
            );
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error
                ? (error as any).response?.data?.message || error.message
                : 'Error al obtener registros de auditoría del usuario';
            throw new Error(message);
        }
    },

    /**
     * Obtiene estadísticas de auditoría
     */
    async getStats(): Promise<AuditoriaStats> {
        try {
            const response = await apiClient.get<AuditoriaStats>('/auditoria/stats');
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error
                ? (error as any).response?.data?.message || error.message
                : 'Error al obtener estadísticas de auditoría';
            throw new Error(message);
        }
    },

    /**
     * Crea un nuevo registro de auditoría
     * NOTA: Este método generalmente se usa internamente por el backend,
     * pero puede ser útil para casos especiales en el frontend
     */
    async create(data: CreateAuditoriaDto): Promise<Auditoria> {
        try {
            const response = await apiClient.post<Auditoria>('/auditoria', data);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error
                ? (error as any).response?.data?.message || error.message
                : 'Error al crear registro de auditoría';
            throw new Error(message);
        }
    },
};