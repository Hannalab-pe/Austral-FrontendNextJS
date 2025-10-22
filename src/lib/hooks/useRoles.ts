/**
 * Hooks para gestión de Roles con TanStack Query
 * 
 * Estos hooks encapsulan toda la lógica de fetching y mutaciones de roles,
 * proporcionando caché automático y manejo de estados.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesKeys } from '@/lib/constants/query-keys';
import { rolesService } from '@/services/usuarios.service';
import { Rol } from '@/types/usuario.interface';
import { toast } from 'sonner';

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para obtener todos los roles activos
 * Los roles se cachean y se reutilizan en toda la aplicación
 * 
 * @param initialData - Datos iniciales (opcional, para SSR)
 * @returns Query con la lista de roles
 */
export function useRoles(initialData?: Rol[]) {
    return useQuery({
        queryKey: rolesKeys.list(),
        queryFn: rolesService.getAll,
        initialData,
        staleTime: 5 * 60 * 1000, // Los roles se consideran frescos por 5 minutos
        gcTime: 10 * 60 * 1000, // Mantener en caché por 10 minutos
    });
}

/**
 * Hook para obtener un rol específico por ID
 * 
 * @param id - ID del rol
 * @param enabled - Si la query debe ejecutarse (por defecto true)
 * @returns Query con el rol
 */
export function useRol(id: string, enabled: boolean = true) {
    return useQuery({
        queryKey: rolesKeys.detail(id),
        queryFn: () => rolesService.getById(id),
        enabled: enabled && !!id,
        staleTime: 5 * 60 * 1000,
    });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para crear un nuevo rol
 * Invalida automáticamente la lista de roles después de crear
 * 
 * @returns Mutation para crear rol
 */
export function useCreateRol() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<Rol, 'idRol' | 'fechaCreacion'>) => {
            // TODO: Implementar cuando exista el endpoint en rolesService
            throw new Error('Endpoint de crear rol no implementado');
        },
        onSuccess: () => {
            // Invalidar la lista de roles para que se recargue
            queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
            toast.success('Rol creado exitosamente');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Error al crear rol');
        },
    });
}

/**
 * Hook para actualizar un rol existente
 * Invalida automáticamente el rol específico y la lista después de actualizar
 * 
 * @returns Mutation para actualizar rol
 */
export function useUpdateRol() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Rol> }) => {
            // TODO: Implementar cuando exista el endpoint en rolesService
            throw new Error('Endpoint de actualizar rol no implementado');
        },
        onSuccess: (data, variables) => {
            // Invalidar el rol específico y la lista
            queryClient.invalidateQueries({ queryKey: rolesKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
            toast.success('Rol actualizado exitosamente');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Error al actualizar rol');
        },
    });
}

/**
 * Hook para eliminar un rol
 * Invalida automáticamente la lista de roles después de eliminar
 * 
 * @returns Mutation para eliminar rol
 */
export function useDeleteRol() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => {
            // TODO: Implementar cuando exista el endpoint en rolesService
            throw new Error('Endpoint de eliminar rol no implementado');
        },
        onSuccess: () => {
            // Invalidar la lista de roles
            queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
            toast.success('Rol eliminado exitosamente');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Error al eliminar rol');
        },
    });
}
