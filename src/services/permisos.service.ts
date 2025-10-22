import axios from 'axios';
import { apiClient } from '@/lib/api/api';
import {
    VerificarPermisoRequest,
    VerificarVistaRequest,
    VerificarRutaRequest,
    VerificarPermisoResponse,
    VerificarVistaResponse,
    VerificarRutaResponse,
    VistasResponse,
    PermisosResponse,
    RolesResponse,
    EstadisticasPermisos,
    Vista,
    Permiso,
    Rol,
} from '@/types/permisos.interface';

/**
 * Servicio de permisos y control de acceso
 */
export const permisosService = {
    /**
     * Verificar si un rol tiene un permiso específico en una vista
     */
    async verificarPermiso(data: VerificarPermisoRequest): Promise<VerificarPermisoResponse> {
        try {
            const response = await apiClient.post<VerificarPermisoResponse>('/permisos/verificar-permiso', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al verificar permiso');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Verificar si un rol tiene acceso a una vista específica
     */
    async verificarVista(data: VerificarVistaRequest): Promise<VerificarVistaResponse> {
        try {
            const response = await apiClient.post<VerificarVistaResponse>('/permisos/verificar-vista', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al verificar vista');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Verificar si un rol tiene acceso a una ruta específica (soporta wildcards)
     */
    async verificarRuta(data: VerificarRutaRequest): Promise<VerificarRutaResponse> {
        try {
            const response = await apiClient.post<VerificarRutaResponse>('/permisos/verificar-ruta', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al verificar ruta');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Obtener todas las vistas disponibles
     */
    async getVistas(): Promise<VistasResponse> {
        try {
            const response = await apiClient.get<VistasResponse>('/permisos/vistas');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al obtener vistas');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Obtener vista por ID
     */
    async getVistaById(id: string): Promise<Vista> {
        try {
            const response = await apiClient.get<Vista>(`/permisos/vistas/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al obtener vista');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Obtener vistas asignadas a un rol específico
     */
    async getVistasByRol(idRol: string): Promise<Vista[]> {
        try {
            const response = await apiClient.get<Vista[]>(`/permisos/roles/${idRol}/vistas`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al obtener vistas del rol');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Obtener todos los permisos disponibles
     */
    async getPermisos(): Promise<PermisosResponse> {
        try {
            const response = await apiClient.get<PermisosResponse>('/permisos/permisos');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al obtener permisos');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Obtener todos los roles disponibles
     */
    async getRoles(): Promise<RolesResponse> {
        try {
            const response = await apiClient.get<RolesResponse>('/permisos/roles');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al obtener roles');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Obtener estadísticas de permisos
     */
    async getEstadisticas(): Promise<EstadisticasPermisos> {
        try {
            const response = await apiClient.get<EstadisticasPermisos>('/permisos/estadisticas');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al obtener estadísticas');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Verificar múltiples permisos a la vez
     */
    async verificarPermisosMasivo(permisos: VerificarPermisoRequest[]): Promise<VerificarPermisoResponse[]> {
        try {
            const response = await apiClient.post<VerificarPermisoResponse[]>('/permisos/verificar-masivo', {
                permisos
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al verificar permisos masivamente');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Obtener permisos de un rol específico
     */
    async getPermisosByRol(idRol: string): Promise<{
        vistas: Vista[];
        permisos: { [vistaId: string]: Permiso[] };
    }> {
        try {
            const response = await apiClient.get<{
                vistas: Vista[];
                permisos: { [vistaId: string]: Permiso[] };
            }>(`/permisos/roles/${idRol}/permisos`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al obtener permisos del rol');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Asignar una vista a un rol
     */
    async assignVistaToRol(idRol: string, idVista: string): Promise<{ message: string }> {
        try {
            const response = await apiClient.post<{ message: string }>(
                `/permisos/roles/${idRol}/vistas/${idVista}/assign`
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al asignar vista al rol');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    /**
     * Desasignar una vista de un rol
     */
    async unassignVistaFromRol(idRol: string, idVista: string): Promise<{ message: string }> {
        try {
            const response = await apiClient.delete<{ message: string }>(
                `/permisos/roles/${idRol}/vistas/${idVista}/unassign`
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Error al desasignar vista del rol');
            }
            throw new Error('Error de conexión con el servidor');
        }
    },
};