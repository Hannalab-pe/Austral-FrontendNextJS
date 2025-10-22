import { apiClient } from '@/lib/api/api';
import {
    Usuario,
    CreateUsuarioDto,
    UpdateUsuarioDto,
    UsuarioFiltros,
    UsuarioPaginado,
    UsuarioStats,
    Rol,
} from '@/types/usuario.interface';

export const usuariosService = {
    /**
     * Obtiene todos los usuarios con filtros opcionales
     */
    async getAll(filtros?: UsuarioFiltros): Promise<Usuario[]> {
        try {
            const params = new URLSearchParams();

            if (filtros?.estaActivo !== undefined) {
                params.append('esta_activo', String(filtros.estaActivo));
            }
            if (filtros?.idRol) {
                params.append('id_rol', filtros.idRol);
            }
            if (filtros?.search) {
                params.append('search', filtros.search);
            }

            const response = await apiClient.get<Usuario[]>(
                `/usuarios${params.toString() ? `?${params.toString()}` : ''}`
            );
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
        }
    },

    /**
     * Obtiene usuarios paginados con filtros opcionales
     */
    async getPaginated(
        page: number = 1,
        limit: number = 10,
        filtros?: UsuarioFiltros
    ): Promise<UsuarioPaginado> {
        try {
            const params = new URLSearchParams();
            params.append('page', String(page));
            params.append('limit', String(limit));

            if (filtros?.estaActivo !== undefined) {
                params.append('esta_activo', String(filtros.estaActivo));
            }
            if (filtros?.idRol) {
                params.append('id_rol', filtros.idRol);
            }
            if (filtros?.search) {
                params.append('search', filtros.search);
            }

            const response = await apiClient.get<UsuarioPaginado>(
                `/usuarios/paginated?${params.toString()}`
            );
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener usuarios paginados');
        }
    },

    /**
     * Obtiene un usuario por ID
     */
    async getById(id: string): Promise<Usuario> {
        try {
            const response = await apiClient.get<Usuario>(`/usuarios/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener usuario');
        }
    },

    /**
     * Actualiza un usuario
     */
    async update(id: string, data: UpdateUsuarioDto): Promise<Usuario> {
        try {
            const response = await apiClient.put<Usuario>(`/usuarios/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
        }
    },

    /**
     * Activa un usuario
     */
    async activate(id: string): Promise<Usuario> {
        try {
            const response = await apiClient.patch<Usuario>(`/usuarios/${id}/activate`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al activar usuario');
        }
    },

    /**
     * Desactiva un usuario (soft delete)
     */
    async deactivate(id: string): Promise<Usuario> {
        try {
            const response = await apiClient.patch<Usuario>(`/usuarios/${id}/deactivate`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al desactivar usuario');
        }
    },

    /**
     * Bloquea un usuario
     */
    async block(id: string): Promise<Usuario> {
        try {
            const response = await apiClient.patch<Usuario>(`/usuarios/${id}/block`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al bloquear usuario');
        }
    },

    /**
     * Desbloquea un usuario
     */
    async unblock(id: string): Promise<Usuario> {
        try {
            const response = await apiClient.patch<Usuario>(`/usuarios/${id}/unblock`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al desbloquear usuario');
        }
    },

    /**
     * Obtiene usuarios por rol
     */
    async getByRole(idRol: string): Promise<Usuario[]> {
        try {
            const response = await apiClient.get<Usuario[]>(`/usuarios/rol/${idRol}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener usuarios por rol');
        }
    },

    /**
     * Obtiene estadísticas de usuarios
     */
    async getStats(): Promise<UsuarioStats> {
        try {
            const response = await apiClient.get<UsuarioStats>('/usuarios/stats');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
        }
    },
};

// Servicio para roles
export const rolesService = {
    /**
     * Obtiene todos los roles activos
     */
    async getAll(): Promise<Rol[]> {
        try {
            const response = await apiClient.get<Rol[]>('/roles');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener roles');
        }
    },

    /**
     * Obtiene un rol por ID
     */
    async getById(id: string): Promise<Rol> {
        try {
            const response = await apiClient.get<Rol>(`/roles/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener rol');
        }
    },
};
