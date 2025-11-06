import { useQuery } from "@tanstack/react-query";
import { leadsClient } from "@/lib/api/api";
import { EstadoLead } from "@/types/lead.interface";

// ==========================================
// CONSTANTES
// ==========================================

export const ESTADOS_LEAD_KEY = ["estados-lead"];

// ==========================================
// API - Funciones de servicio
// ==========================================

const estadosLeadApi = {
  getAll: async (): Promise<EstadoLead[]> => {
    const response = await leadsClient.get<EstadoLead[]>("/estados-lead");
    return response.data || [];
  },
};

// ==========================================
// HOOKS - TanStack Query
// ==========================================

const useGetAll = () => {
  return useQuery({
    queryKey: ESTADOS_LEAD_KEY,
    queryFn: estadosLeadApi.getAll,
  });
};

// ==========================================
// EXPORTACIÓN - Servicio completo
// ==========================================

export const EstadosLeadService = {
  // API functions
  ...estadosLeadApi,

  // Hooks
  useGetAll,
};