import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendedoresService, VendedorResponse, UpdateVendedorDto } from '@/services/vendedores.service';
import { toast } from 'sonner';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const vendedoresKeys = {
    all: ['vendedores'] as const,
    lists: () => [...vendedoresKeys.all, 'list'] as const,
    list: (filters?: { estaActivo?: boolean; search?: string }) => [...vendedoresKeys.lists(), filters] as const,
    details: () => [...vendedoresKeys.all, 'detail'] as const,
    detail: (id: string) => [...vendedoresKeys.details(), id] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para obtener todos los vendedores del broker autenticado
 */
export function useVendedores(filters?: { estaActivo?: boolean; search?: string }) {
    return useQuery({
        queryKey: vendedoresKeys.list(filters),
        queryFn: () => vendedoresService.getAll(filters?.estaActivo, filters?.search),
        staleTime: 30 * 1000, // 30 segundos
    });
}

/**
 * Hook para obtener un vendedor específico por ID
 */
export function useVendedor(id: string, enabled: boolean = true) {
    return useQuery({
        queryKey: vendedoresKeys.detail(id),
        queryFn: () => vendedoresService.getById(id),
        enabled: enabled && !!id,
    });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para actualizar un vendedor
 */
export function useUpdateVendedor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateVendedorDto }) =>
            vendedoresService.update(id, data),
        onSuccess: (_, { id }) => {
            // Invalidar la caché del vendedor específico y la lista
            queryClient.invalidateQueries({ queryKey: vendedoresKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: vendedoresKeys.lists() });
            toast.success('Vendedor actualizado exitosamente');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al actualizar vendedor');
        },
    });
}

/**
 * Hook para desactivar un vendedor
 */
export function useDeactivateVendedor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => vendedoresService.remove(id),
        onSuccess: () => {
            // Invalidar la caché de la lista de vendedores
            queryClient.invalidateQueries({ queryKey: vendedoresKeys.lists() });
            toast.success('Vendedor desactivado exitosamente');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al desactivar vendedor');
        },
    });
}

/**
 * Hook para reactivar un vendedor
 */
export function useActivateVendedor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => vendedoresService.activate(id),
        onSuccess: () => {
            // Invalidar la caché de la lista de vendedores
            queryClient.invalidateQueries({ queryKey: vendedoresKeys.lists() });
            toast.success('Vendedor reactivado exitosamente');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al reactivar vendedor');
        },
    });
}
