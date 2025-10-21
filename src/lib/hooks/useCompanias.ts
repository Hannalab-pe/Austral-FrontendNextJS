/**
 * Hooks para gestión de Compañías de Seguros con TanStack Query
 * 
 * Estos hooks encapsulan toda la lógica de fetching y mutaciones de compañías,
 * proporcionando caché automático, optimistic updates y manejo de estados.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiasService } from '@/services/companias.service';
import {
  CompaniaSeguro,
  CreateCompaniaSeguroDto,
  UpdateCompaniaSeguroDto,
} from '@/types/compania.interface';
import { toast } from 'sonner';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const companiasKeys = {
  all: ['companias-seguro'] as const,
  lists: () => [...companiasKeys.all, 'list'] as const,
  list: () => [...companiasKeys.lists()] as const,
  details: () => [...companiasKeys.all, 'detail'] as const,
  detail: (id: string) => [...companiasKeys.details(), id] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para obtener todas las compañías de seguros
 * 
 * @param initialData - Datos iniciales (opcional, para SSR)
 * @returns Query con la lista de compañías
 */
export function useCompanias(initialData?: CompaniaSeguro[]) {
  return useQuery({
    queryKey: companiasKeys.list(),
    queryFn: () => companiasService.getAll(),
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutos (las compañías no cambian tan frecuentemente)
  });
}

/**
 * Hook para obtener una compañía específica por ID
 * 
 * @param id - ID de la compañía
 * @param enabled - Si la query debe ejecutarse (por defecto true)
 * @returns Query con la compañía
 */
export function useCompania(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: companiasKeys.detail(id),
    queryFn: () => companiasService.getById(id),
    enabled: enabled && !!id,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para crear una nueva compañía de seguros
 * 
 * @returns Mutation para crear compañía
 */
export function useCreateCompania() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompaniaSeguroDto) =>
      companiasService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companiasKeys.lists() });
      toast.success('Compañía de seguros creada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear la compañía de seguros');
    },
  });
}

/**
 * Hook para actualizar una compañía de seguros
 * 
 * @returns Mutation para actualizar compañía
 */
export function useUpdateCompania() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCompaniaSeguroDto }) =>
      companiasService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: companiasKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: companiasKeys.detail(data.idCompania),
      });
      toast.success('Compañía de seguros actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Error al actualizar la compañía de seguros'
      );
    },
  });
}

/**
 * Hook para eliminar (desactivar) una compañía de seguros
 * 
 * @returns Mutation para eliminar compañía
 */
export function useDeleteCompania() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => companiasService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companiasKeys.lists() });
      toast.success('Compañía de seguros eliminada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar la compañía de seguros');
    },
  });
}

/**
 * Hook para activar una compañía de seguros
 * 
 * @returns Mutation para activar compañía
 */
export function useActivateCompania() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => companiasService.activate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: companiasKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: companiasKeys.detail(data.idCompania),
      });
      toast.success('Compañía de seguros activada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al activar la compañía de seguros');
    },
  });
}

/**
 * Hook para desactivar una compañía de seguros
 * 
 * @returns Mutation para desactivar compañía
 */
export function useDeactivateCompania() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => companiasService.deactivate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: companiasKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: companiasKeys.detail(data.idCompania),
      });
      toast.success('Compañía de seguros desactivada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Error al desactivar la compañía de seguros'
      );
    },
  });
}
