import { useQuery } from "@tanstack/react-query";
import { leadsClient } from "@/lib/api/api";
import { FuenteLead } from "@/types/lead.interface";

// ==========================================
// CONSTANTES
// ==========================================

export const FUENTES_LEAD_KEY = ["fuentes-lead"];

// ==========================================
// API - Funciones de servicio
// ==========================================

const fuentesLeadApi = {
  getAll: async (): Promise<FuenteLead[]> => {
    const response = await leadsClient.get<FuenteLead[]>("/fuentes-lead");
    return response.data || [];
  },

  getById: async (id: string): Promise<FuenteLead> => {
    const response = await leadsClient.get<FuenteLead>(`/fuentes-lead/${id}`);
    return response.data;
  },
};

// ==========================================
// HOOKS - TanStack Query
// ==========================================

const useGetAll = () => {
  return useQuery({
    queryKey: FUENTES_LEAD_KEY,
    queryFn: fuentesLeadApi.getAll,
  });
};

const useGetById = (id: string) => {
  return useQuery({
    queryKey: [...FUENTES_LEAD_KEY, id],
    queryFn: () => fuentesLeadApi.getById(id),
    enabled: !!id,
  });
};

// ==========================================
// EXPORTACIÓN - Servicio completo
// ==========================================

export const FuentesLeadService = {
  // API functions
  ...fuentesLeadApi,

  // Hooks
  useGetAll,
  useGetById,
};