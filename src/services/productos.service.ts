/**
 * Servicio para gestión de Productos de Seguros
 * 
 * Este servicio maneja todas las operaciones CRUD relacionadas con productos de seguros,
 * comunicándose con el microservicio de products-service en el puerto 3004.
 */

import { productsClient } from '@/lib/api/api';
import {
  ProductoSeguro,
  CreateProductoSeguroDto,
  UpdateProductoSeguroDto,
} from '@/types/producto.interface';

const PRODUCTOS_ENDPOINT = '/productos-seguro';

export const productosService = {
  /**
   * Obtener todos los productos de seguros
   * @returns Promise con array de productos
   */
  getAll: async (): Promise<ProductoSeguro[]> => {
    const response = await productsClient.get<ProductoSeguro[]>(PRODUCTOS_ENDPOINT);
    return response.data;
  },

  /**
   * Obtener productos por compañía
   * @param idCompania - ID de la compañía
   * @returns Promise con array de productos de la compañía
   */
  getByCompania: async (idCompania: string): Promise<ProductoSeguro[]> => {
    const response = await productsClient.get<ProductoSeguro[]>(
      `${PRODUCTOS_ENDPOINT}/compania/${idCompania}`
    );
    return response.data;
  },

  /**
   * Obtener productos por tipo de seguro
   * @param idTipoSeguro - ID del tipo de seguro
   * @returns Promise con array de productos del tipo
   */
  getByTipo: async (idTipoSeguro: string): Promise<ProductoSeguro[]> => {
    const response = await productsClient.get<ProductoSeguro[]>(
      `${PRODUCTOS_ENDPOINT}/tipo/${idTipoSeguro}`
    );
    return response.data;
  },

  /**
   * Obtener un producto específico por ID
   * @param id - ID del producto
   * @returns Promise con el producto
   */
  getById: async (id: string): Promise<ProductoSeguro> => {
    const response = await productsClient.get<ProductoSeguro>(
      `${PRODUCTOS_ENDPOINT}/${id}`
    );
    return response.data;
  },

  /**
   * Crear un nuevo producto de seguro
   * @param data - Datos del producto a crear
   * @returns Promise con el producto creado
   */
  create: async (data: CreateProductoSeguroDto): Promise<ProductoSeguro> => {
    const response = await productsClient.post<ProductoSeguro>(
      PRODUCTOS_ENDPOINT,
      data
    );
    return response.data;
  },

  /**
   * Actualizar un producto de seguro
   * @param id - ID del producto a actualizar
   * @param data - Datos a actualizar
   * @returns Promise con el producto actualizado
   */
  update: async (
    id: string,
    data: UpdateProductoSeguroDto
  ): Promise<ProductoSeguro> => {
    const response = await productsClient.patch<ProductoSeguro>(
      `${PRODUCTOS_ENDPOINT}/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Eliminar (soft delete) un producto de seguro
   * @param id - ID del producto a eliminar
   * @returns Promise con void
   */
  delete: async (id: string): Promise<void> => {
    await productsClient.delete(`${PRODUCTOS_ENDPOINT}/${id}`);
  },

  /**
   * Activar un producto de seguro
   * @param id - ID del producto a activar
   * @returns Promise con el producto activado
   */
  activate: async (id: string): Promise<ProductoSeguro> => {
    const response = await productsClient.patch<ProductoSeguro>(
      `${PRODUCTOS_ENDPOINT}/${id}/activar`
    );
    return response.data;
  },

  /**
   * Desactivar un producto de seguro
   * @param id - ID del producto a desactivar
   * @returns Promise con el producto desactivado
   */
  deactivate: async (id: string): Promise<ProductoSeguro> => {
    const response = await productsClient.patch<ProductoSeguro>(
      `${PRODUCTOS_ENDPOINT}/${id}/desactivar`
    );
    return response.data;
  },
};
