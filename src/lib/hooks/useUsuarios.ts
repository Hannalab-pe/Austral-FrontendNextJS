/**
 * Hooks para gestión de Usuarios con TanStack Query
 * 
 * Estos hooks encapsulan toda la lógica de fetching y mutaciones de usuarios,
 * proporcionando caché automático, optimistic updates y manejo de estados.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosKeys } from '@/lib/constants/query-keys';
import { usuariosService } from '@/services/usuarios.service';
import {
    Usuario,
    UpdateUsuarioDto,
    UsuarioFiltros,
    UsuarioStats,
} from '@/types/usuario.interface';
import { toast } from 'sonner';

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para obtener todos los usuarios con filtros opcionales
 * 
 * @param filters - Filtros para la búsqueda (esta_activo, id_rol, search)
 * @param initialData - Datos iniciales (opcional, para SSR)
 * @returns Query con la lista de usuarios
 */
export function useUsuarios(filters?: UsuarioFiltros, initialData?: Usuario[]) {
    return useQuery({
        queryKey: usuariosKeys.list(filters),
        queryFn: () => usuariosService.getAll(filters),
        initialData,
        staleTime: 30 * 1000, // 30 segundos
    });
}

/**
 * Hook para obtener usuarios paginados
 * 
 * @param page - Número de página
 * @param limit - Cantidad de registros por página
 * @param filters - Filtros opcionales
 * @returns Query con datos paginados
 */
export function useUsuariosPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: UsuarioFiltros
) {
    return useQuery({
        queryKey: usuariosKeys.paginated(page, limit, filters),
        queryFn: () => usuariosService.getPaginated(page, limit, filters),
        staleTime: 30 * 1000,
        placeholderData: (previousData) => previousData, // Mantener datos anteriores mientras carga
    });
}

/**
 * Hook para obtener un usuario específico por ID
 * 
 * @param id - ID del usuario
 * @param enabled - Si la query debe ejecutarse (por defecto true)
 * @returns Query con el usuario
 */
export function useUsuario(id: string, enabled: boolean = true) {
    return useQuery({
        queryKey: usuariosKeys.detail(id),
        queryFn: () => usuariosService.getById(id),
        enabled: enabled && !!id,
    });
}

/**
 * Hook para obtener usuarios por rol
 * 
 * @param id_rol - ID del rol
 * @param enabled - Si la query debe ejecutarse
 * @returns Query con usuarios del rol
 */
export function useUsuariosByRole(id_rol: string, enabled: boolean = true) {
    return useQuery({
        queryKey: usuariosKeys.byRole(id_rol),
        queryFn: () => usuariosService.getByRole(id_rol),
        enabled: enabled && !!id_rol,
    });
}

/**
 * Hook para obtener estadísticas de usuarios
 * 
 * @returns Query con estadísticas
 */
export function useUsuariosStats() {
    return useQuery({
        queryKey: usuariosKeys.stats(),
        queryFn: usuariosService.getStats,
        staleTime: 60 * 1000, // 1 minuto
    });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para actualizar un usuario
 * Invalida automáticamente las queries relacionadas
 * 
 * @returns Mutation para actualizar usuario
 */
export function useUpdateUsuario() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUsuarioDto }) =>
            usuariosService.update(id, data),
        onSuccess: (data, variables) => {
            // Invalidar el usuario específico
            queryClient.invalidateQueries({ queryKey: usuariosKeys.detail(variables.id) });
            // Invalidar todas las listas de usuarios
            queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() });
            // Invalidar estadísticas
            queryClient.invalidateQueries({ queryKey: usuariosKeys.stats() });

            toast.success('Usuario actualizado exitosamente');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Error al actualizar usuario');
        },
    });
}

/**
 * Hook para activar un usuario
 * Usa optimistic update para mejor UX
 * 
 * @returns Mutation para activar usuario
 */
export function useActivateUsuario() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => usuariosService.activate(id),
        // Optimistic update
        onMutate: async (id) => {
            // Cancelar queries en progreso
            await queryClient.cancelQueries({ queryKey: usuariosKeys.detail(id) });

            // Guardar snapshot del estado anterior
            const previousUsuario = queryClient.getQueryData<Usuario>(usuariosKeys.detail(id));

            // Actualizar optimistically
            if (previousUsuario) {
                queryClient.setQueryData<Usuario>(usuariosKeys.detail(id), {
                    ...previousUsuario,
                    esta_activo: true,
                    cuenta_bloqueada: false,
                });
            }

            return { previousUsuario };
        },
        onSuccess: (data, id) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() });
            queryClient.invalidateQueries({ queryKey: usuariosKeys.stats() });

            toast.success('Usuario activado exitosamente');
        },
        onError: (error: any, id, context) => {
            // Revertir el optimistic update en caso de error
            if (context?.previousUsuario) {
                queryClient.setQueryData(usuariosKeys.detail(id), context.previousUsuario);
            }
            toast.error(error.message || 'Error al activar usuario');
        },
    });
}

/**
 * Hook para desactivar un usuario
 * Usa optimistic update para mejor UX
 * 
 * @returns Mutation para desactivar usuario
 */
export function useDeactivateUsuario() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => usuariosService.deactivate(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: usuariosKeys.detail(id) });
            const previousUsuario = queryClient.getQueryData<Usuario>(usuariosKeys.detail(id));

            if (previousUsuario) {
                queryClient.setQueryData<Usuario>(usuariosKeys.detail(id), {
                    ...previousUsuario,
                    esta_activo: false,
                });
            }

            return { previousUsuario };
        },
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() });
            queryClient.invalidateQueries({ queryKey: usuariosKeys.stats() });
            toast.success('Usuario desactivado exitosamente');
        },
        onError: (error: any, id, context) => {
            if (context?.previousUsuario) {
                queryClient.setQueryData(usuariosKeys.detail(id), context.previousUsuario);
            }
            toast.error(error.message || 'Error al desactivar usuario');
        },
    });
}

/**
 * Hook para bloquear un usuario
 * Usa optimistic update para mejor UX
 * 
 * @returns Mutation para bloquear usuario
 */
export function useBlockUsuario() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => usuariosService.block(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: usuariosKeys.detail(id) });
            const previousUsuario = queryClient.getQueryData<Usuario>(usuariosKeys.detail(id));

            if (previousUsuario) {
                queryClient.setQueryData<Usuario>(usuariosKeys.detail(id), {
                    ...previousUsuario,
                    cuenta_bloqueada: true,
                });
            }

            return { previousUsuario };
        },
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() });
            queryClient.invalidateQueries({ queryKey: usuariosKeys.stats() });
            toast.success('Usuario bloqueado exitosamente');
        },
        onError: (error: any, id, context) => {
            if (context?.previousUsuario) {
                queryClient.setQueryData(usuariosKeys.detail(id), context.previousUsuario);
            }
            toast.error(error.message || 'Error al bloquear usuario');
        },
    });
}

/**
 * Hook para desbloquear un usuario
 * Usa optimistic update para mejor UX
 * 
 * @returns Mutation para desbloquear usuario
 */
export function useUnblockUsuario() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => usuariosService.unblock(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: usuariosKeys.detail(id) });
            const previousUsuario = queryClient.getQueryData<Usuario>(usuariosKeys.detail(id));

            if (previousUsuario) {
                queryClient.setQueryData<Usuario>(usuariosKeys.detail(id), {
                    ...previousUsuario,
                    cuenta_bloqueada: false,
                    intentos_fallidos: 0,
                });
            }

            return { previousUsuario };
        },
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() });
            queryClient.invalidateQueries({ queryKey: usuariosKeys.stats() });
            toast.success('Usuario desbloqueado exitosamente');
        },
        onError: (error: any, id, context) => {
            if (context?.previousUsuario) {
                queryClient.setQueryData(usuariosKeys.detail(id), context.previousUsuario);
            }
            toast.error(error.message || 'Error al desbloquear usuario');
        },
    });
}
