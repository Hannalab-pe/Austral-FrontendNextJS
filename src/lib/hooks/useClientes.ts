/**
 * Hooks para gestión de Clientes con TanStack Query
 *
 * Estos hooks encapsulan toda la lógica de fetching y mutaciones de clientes,
 * proporcionando caché automático, optimistic updates y manejo de estados.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientesKeys } from '@/lib/constants/query-keys';
import { clientesService } from '@/services/clientes.service';
import {
    Cliente,
    UpdateClienteDto,
    ClienteStats,
} from '@/types/cliente.interface';
import { toast } from 'sonner';

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para obtener todos los clientes asignados al usuario autenticado
 * El backend ya filtra por jerarquía (Admin, Broker, Vendedor)
 *
 * @param filters - Filtros opcionales (esta_activo, search)
 * @param initialData - Datos iniciales (opcional, para SSR)
 * @returns Query con la lista de clientes
 */
export function useClientes(filters?: {
    esta_activo?: boolean;
    search?: string;
}, initialData?: Cliente[]) {
    return useQuery({
        queryKey: clientesKeys.list(filters),
        queryFn: () => clientesService.getAll(filters),
        initialData,
        staleTime: 30 * 1000, // 30 segundos
    });
}

/**
 * Hook para obtener clientes paginados
 *
 * @param page - Número de página
 * @param limit - Cantidad de registros por página
 * @param filters - Filtros opcionales
 * @returns Query con datos paginados
 */
export function useClientesPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: {
        esta_activo?: boolean;
        search?: string;
    }
) {
    return useQuery({
        queryKey: clientesKeys.list({ ...filters, page, limit }),
        queryFn: () => clientesService.getPaginated(page, limit, filters),
        staleTime: 30 * 1000,
        placeholderData: (previousData) => previousData, // Mantener datos anteriores mientras carga
    });
}

/**
 * Hook para obtener un cliente específico por ID
 *
 * @param id - ID del cliente
 * @param enabled - Si la query debe ejecutarse (por defecto true)
 * @returns Query con el cliente
 */
export function useCliente(id: string, enabled: boolean = true) {
    return useQuery({
        queryKey: clientesKeys.detail(id),
        queryFn: () => clientesService.getById(id),
        enabled: enabled && !!id,
    });
}

/**
 * Hook para obtener estadísticas de clientes
 *
 * @returns Query con estadísticas
 */
export function useClientesStats() {
    return useQuery({
        queryKey: clientesKeys.list({ stats: true }),
        queryFn: clientesService.getStats,
        staleTime: 60 * 1000, // 1 minuto
    });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para actualizar un cliente
 * Invalida automáticamente las queries relacionadas
 *
 * @returns Mutation para actualizar cliente
 */
export function useUpdateCliente() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateClienteDto }) =>
            clientesService.update(id, data),
        onSuccess: (data, variables) => {
            // Invalidar el cliente específico
            queryClient.invalidateQueries({ queryKey: clientesKeys.detail(variables.id) });
            // Invalidar todas las listas de clientes
            queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });

            toast.success('Cliente actualizado exitosamente');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Error al actualizar cliente');
        },
    });
}

/**
 * Hook para desactivar un cliente (soft delete)
 * Cambia esta_activo a false
 * Usa optimistic update para mejor UX
 *
 * @returns Mutation para desactivar cliente
 */
export function useDeactivateCliente() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => clientesService.deactivate(id),
        // Optimistic update
        onMutate: async (id) => {
            // Cancelar queries en progreso
            await queryClient.cancelQueries({ queryKey: clientesKeys.detail(id) });

            // Guardar snapshot del estado anterior
            const previousCliente = queryClient.getQueryData<Cliente>(clientesKeys.detail(id));

            // Actualizar optimistically - remover de las listas
            queryClient.setQueriesData<Cliente[]>(
                { queryKey: clientesKeys.lists() },
                (oldData) => oldData ? oldData.filter(cliente => cliente.idCliente !== id) : []
            );

            return { previousCliente, id };
        },
        onSuccess: (data, id) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });

            toast.success('Cliente desactivado exitosamente');
        },
        onError: (error: any, id, context) => {
            // Revertir el optimistic update en caso de error
            if (context?.previousCliente) {
                queryClient.setQueryData(clientesKeys.detail(id), context.previousCliente);
            }
            // Restaurar en las listas
            queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });

            toast.error(error.message || 'Error al desactivar cliente');
        },
    });
}

/**
 * Hook para activar un cliente
 * Cambia esta_activo a true
 * Usa optimistic update para mejor UX
 *
 * @returns Mutation para activar cliente
 */
export function useActivateCliente() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => clientesService.activate(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: clientesKeys.detail(id) });
            const previousCliente = queryClient.getQueryData<Cliente>(clientesKeys.detail(id));

            // Optimistic update - agregar a las listas activas
            queryClient.setQueriesData<Cliente[]>(
                { queryKey: clientesKeys.lists() },
                (oldData) => {
                    if (!oldData) return oldData;
                    // Aquí necesitaríamos obtener el cliente completo, pero por simplicidad
                    // solo invalidamos las queries para que se recarguen
                    return oldData;
                }
            );

            return { previousCliente, id };
        },
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });
            toast.success('Cliente activado exitosamente');
        },
        onError: (error: any, id, context) => {
            if (context?.previousCliente) {
                queryClient.setQueryData(clientesKeys.detail(id), context.previousCliente);
            }
            queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });
            toast.error(error.message || 'Error al activar cliente');
        },
    });
}
