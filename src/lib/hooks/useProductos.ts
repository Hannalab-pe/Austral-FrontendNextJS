/**
 * Hooks para gestión de Productos de Seguros con TanStack Query
 * 
 * Estos hooks encapsulan toda la lógica de fetching y mutaciones de productos,
 * proporcionando caché automático, optimistic updates y manejo de estados.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productosService } from '@/services/productos.service';
import {
  ProductoSeguro,
  CreateProductoSeguroDto,
  UpdateProductoSeguroDto,
} from '@/types/producto.interface';
import { toast } from 'sonner';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const productosKeys = {
  all: ['productos-seguro'] as const,
  lists: () => [...productosKeys.all, 'list'] as const,
  list: () => [...productosKeys.lists()] as const,
  byCompania: (idCompania: string) =>
    [...productosKeys.lists(), 'compania', idCompania] as const,
  byTipo: (idTipoSeguro: string) =>
    [...productosKeys.lists(), 'tipo', idTipoSeguro] as const,
  details: () => [...productosKeys.all, 'detail'] as const,
  detail: (id: string) => [...productosKeys.details(), id] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para obtener todos los productos de seguros
 * 
 * @param initialData - Datos iniciales (opcional, para SSR)
 * @returns Query con la lista de productos
 */
export function useProductos(initialData?: ProductoSeguro[]) {
  return useQuery({
    queryKey: productosKeys.list(),
    queryFn: () => productosService.getAll(),
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obtener productos de una compañía específica
 * 
 * @param idCompania - ID de la compañía
 * @param enabled - Si la query debe ejecutarse (por defecto true)
 * @returns Query con la lista de productos de la compañía
 */
export function useProductosByCompania(
  idCompania: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: productosKeys.byCompania(idCompania),
    queryFn: () => productosService.getByCompania(idCompania),
    enabled: enabled && !!idCompania,
  });
}

/**
 * Hook para obtener productos de un tipo de seguro específico
 * 
 * @param idTipoSeguro - ID del tipo de seguro
 * @param enabled - Si la query debe ejecutarse (por defecto true)
 * @returns Query con la lista de productos del tipo
 */
export function useProductosByTipo(
  idTipoSeguro: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: productosKeys.byTipo(idTipoSeguro),
    queryFn: () => productosService.getByTipo(idTipoSeguro),
    enabled: enabled && !!idTipoSeguro,
  });
}

/**
 * Hook para obtener un producto específico por ID
 * 
 * @param id - ID del producto
 * @param enabled - Si la query debe ejecutarse (por defecto true)
 * @returns Query con el producto
 */
export function useProducto(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: productosKeys.detail(id),
    queryFn: () => productosService.getById(id),
    enabled: enabled && !!id,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook para crear un nuevo producto de seguro
 * 
 * @returns Mutation para crear producto
 */
export function useCreateProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductoSeguroDto) =>
      productosService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productosKeys.byCompania(data.idCompania),
      });
      toast.success('Producto de seguro creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear el producto de seguro');
    },
  });
}

/**
 * Hook para actualizar un producto de seguro
 * 
 * @returns Mutation para actualizar producto
 */
export function useUpdateProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductoSeguroDto }) =>
      productosService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productosKeys.detail(data.idProducto),
      });
      queryClient.invalidateQueries({
        queryKey: productosKeys.byCompania(data.idCompania),
      });
      toast.success('Producto de seguro actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Error al actualizar el producto de seguro'
      );
    },
  });
}

/**
 * Hook para eliminar (desactivar) un producto de seguro
 * 
 * @returns Mutation para eliminar producto
 */
export function useDeleteProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
      toast.success('Producto de seguro eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar el producto de seguro');
    },
  });
}

/**
 * Hook para activar un producto de seguro
 * 
 * @returns Mutation para activar producto
 */
export function useActivateProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productosService.activate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productosKeys.detail(data.idProducto),
      });
      queryClient.invalidateQueries({
        queryKey: productosKeys.byCompania(data.idCompania),
      });
      toast.success('Producto de seguro activado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al activar el producto de seguro');
    },
  });
}

/**
 * Hook para desactivar un producto de seguro
 * 
 * @returns Mutation para desactivar producto
 */
export function useDeactivateProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productosService.deactivate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productosKeys.detail(data.idProducto),
      });
      queryClient.invalidateQueries({
        queryKey: productosKeys.byCompania(data.idCompania),
      });
      toast.success('Producto de seguro desactivado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Error al desactivar el producto de seguro'
      );
    },
  });
}
