import { activitiesClient } from '@/lib/api/api';
import {
    Actividad,
    CreateActividadDto,
    UpdateActividadDto,
} from '@/types/actividad.interface';

export const actividadService = {
    /**
     * Obtiene todas las actividades
     */
    async getAll(): Promise<Actividad[]> {
        try {
            const response = await activitiesClient.get<Actividad[]>('/actividades');
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || error.message
                : 'Error al obtener actividades';
            throw new Error(message);
        }
    },

    /**
     * Obtiene actividades por usuario (campo realizadoPorUsuario)
     */
    async getByUsuario(realizadaPorUsuario: string): Promise<Actividad[]> {
        try {
            const response = await activitiesClient.get<Actividad[]>(`/actividades/usuario/${realizadaPorUsuario}`);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || error.message
                : 'Error al obtener actividades del usuario';
            throw new Error(message);
        }
    },

    /**
     * Obtiene actividades por tipo
     */
    async getByTipo(tipo: string): Promise<Actividad[]> {
        try {
            const response = await activitiesClient.get<Actividad[]>(`/actividades/tipo/${tipo}`);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || error.message
                : 'Error al obtener actividades por tipo';
            throw new Error(message);
        }
    },

    /**
     * Obtiene actividades por rango de fechas
     */
    async getByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Actividad[]> {
        try {
            const params = new URLSearchParams({
                fechaInicio: fechaInicio.toISOString(),
                fechaFin: fechaFin.toISOString(),
            });
            const response = await activitiesClient.get<Actividad[]>(`/actividades/fecha-rango?${params}`);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || error.message
                : 'Error al obtener actividades por rango de fechas';
            throw new Error(message);
        }
    },

    /**
     * Obtiene una actividad por ID
     */
    async getById(id: string): Promise<Actividad> {
        try {
            const response = await activitiesClient.get<Actividad>(`/actividades/${id}`);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || error.message
                : 'Error al obtener la actividad';
            throw new Error(message);
        }
    },

    /**
     * Crea una nueva actividad
     */
    async create(data: CreateActividadDto): Promise<Actividad> {
        try {
            const response = await activitiesClient.post<Actividad>('/actividades', data);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || error.message
                : 'Error al crear la actividad';
            throw new Error(message);
        }
    },

    /**
     * Actualiza una actividad
     */
    async update(id: string, data: UpdateActividadDto): Promise<Actividad> {
        try {
            const response = await activitiesClient.patch<Actividad>(`/actividades/${id}`, data);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || error.message
                : 'Error al actualizar la actividad';
            throw new Error(message);
        }
    },

    /**
     * Elimina una actividad
     */
    async delete(id: string): Promise<void> {
        try {
            await activitiesClient.delete(`/actividades/${id}`);
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || error.message
                : 'Error al eliminar la actividad';
            throw new Error(message);
        }
    },
};