/**
 * Hooks para gestión de Vistas con TanStack Query
 *
 * Estos hooks encapsulan toda la lógica de fetching y mutaciones de vistas,
 * proporcionando caché automático y manejo de estados.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vistasKeys } from '@/lib/constants/query-keys';
import { permisosService } from '@/services/permisos.service';
import { Vista } from '@/types/usuario.interface';
import { toast } from 'sonner';

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para obtener todas las vistas activas
 * Las vistas se cachean y se reutilizan en toda la aplicación
 *
 * @param initialData - Datos iniciales (opcional, para SSR)
 * @returns Query con la lista de vistas
 */
export function useVistas(initialData?: Vista[]) {
    return useQuery({
        queryKey: vistasKeys.list(),
        queryFn: async () => {
            const response = await permisosService.getVistas();
            return response.vistas;
        },
        initialData,
        staleTime: 5 * 60 * 1000, // Las vistas se consideran frescos por 5 minutos
        gcTime: 10 * 60 * 1000, // Mantener en caché por 10 minutos
    });
}

/**
 * Hook para obtener una vista específica por ID
 *
 * @param id - ID de la vista
 * @param enabled - Si la query debe ejecutarse (por defecto true)
 * @returns Query con la vista
 */
export function useVista(id: string, enabled: boolean = true) {
    return useQuery({
        queryKey: vistasKeys.detail(id),
        queryFn: () => permisosService.getVistaById(id),
        enabled: enabled && !!id,
        staleTime: 5 * 60 * 1000,
    });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para asignar una vista a un rol
 * Invalida automáticamente las queries relacionadas
 *
 * @returns Mutation para asignar vista a rol
 */
export function useAssignVistaToRol() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ idRol, idVista }: { idRol: string; idVista: string }) => {
            const response = await permisosService.assignVistaToRol(idRol, idVista);
            return response;
        },
        onSuccess: (_, variables) => {
            // Invalidar las queries relacionadas con permisos y navegación
            queryClient.invalidateQueries({ queryKey: vistasKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            queryClient.invalidateQueries({ queryKey: ['navigation'] });
            queryClient.invalidateQueries({ queryKey: vistasKeys.byRol(variables.idRol) });
            toast.success('Vista asignada al rol exitosamente');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Error al asignar vista al rol');
        },
    });
}

/**
 * Hook para desasignar una vista de un rol
 * Invalida automáticamente las queries relacionadas
 *
 * @returns Mutation para desasignar vista de rol
 */
export function useUnassignVistaFromRol() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ idRol, idVista }: { idRol: string; idVista: string }) => {
            const response = await permisosService.unassignVistaFromRol(idRol, idVista);
            return response;
        },
        onSuccess: (_, variables) => {
            // Invalidar las queries relacionadas con permisos y navegación
            queryClient.invalidateQueries({ queryKey: vistasKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            queryClient.invalidateQueries({ queryKey: ['navigation'] });
            queryClient.invalidateQueries({ queryKey: vistasKeys.byRol(variables.idRol) });
            toast.success('Vista removida del rol exitosamente');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Error al remover vista del rol');
        },
    });
}

/**
 * Hook para obtener las vistas asignadas a un rol específico
 *
 * @param idRol - ID del rol
 * @returns Query con las vistas asignadas al rol
 */
export function useVistasByRol(idRol: string) {
    return useQuery({
        queryKey: vistasKeys.byRol(idRol),
        queryFn: () => permisosService.getVistasByRol(idRol),
        enabled: !!idRol,
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 5 * 60 * 1000, // 5 minutos
    });
}