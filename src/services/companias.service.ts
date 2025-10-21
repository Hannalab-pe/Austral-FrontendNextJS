import { productsClient } from '@/lib/api/api';
import {
  CompaniaSeguro,
  CreateCompaniaSeguroDto,
  UpdateCompaniaSeguroDto,
} from '@/types/compania.interface';

export const companiasService = {
  /**
   * Obtiene todas las compañías de seguros activas
   */
  async getAll(): Promise<CompaniaSeguro[]> {
    try {
      const response = await productsClient.get<CompaniaSeguro[]>(
        '/companias-seguro'
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al obtener compañías de seguros'
      );
    }
  },

  /**
   * Obtiene una compañía de seguros por ID
   */
  async getById(id: string): Promise<CompaniaSeguro> {
    try {
      const response = await productsClient.get<CompaniaSeguro>(
        `/companias-seguro/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          'Error al obtener la compañía de seguros'
      );
    }
  },

  /**
   * Crea una nueva compañía de seguros
   */
  async create(data: CreateCompaniaSeguroDto): Promise<CompaniaSeguro> {
    try {
      const response = await productsClient.post<CompaniaSeguro>(
        '/companias-seguro',
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al crear la compañía de seguros'
      );
    }
  },

  /**
   * Actualiza una compañía de seguros existente
   */
  async update(
    id: string,
    data: UpdateCompaniaSeguroDto
  ): Promise<CompaniaSeguro> {
    try {
      const response = await productsClient.patch<CompaniaSeguro>(
        `/companias-seguro/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          'Error al actualizar la compañía de seguros'
      );
    }
  },

  /**
   * Desactiva una compañía de seguros (soft delete)
   */
  async delete(id: string): Promise<void> {
    try {
      await productsClient.delete(`/companias-seguro/${id}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          'Error al eliminar la compañía de seguros'
      );
    }
  },

  /**
   * Activa una compañía de seguros
   */
  async activate(id: string): Promise<CompaniaSeguro> {
    try {
      const response = await productsClient.patch<CompaniaSeguro>(
        `/companias-seguro/${id}`,
        { estaActivo: true }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          'Error al activar la compañía de seguros'
      );
    }
  },

  /**
   * Desactiva una compañía de seguros
   */
  async deactivate(id: string): Promise<CompaniaSeguro> {
    try {
      const response = await productsClient.patch<CompaniaSeguro>(
        `/companias-seguro/${id}`,
        { estaActivo: false }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          'Error al desactivar la compañía de seguros'
      );
    }
  },
};
