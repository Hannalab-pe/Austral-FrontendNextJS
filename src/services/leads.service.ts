import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsClient } from "@/lib/api/api";
import { Lead, CreateLeadDto, UpdateLeadDto } from "@/types/lead.interface";

// ==========================================
// CONSTANTES
// ==========================================

export const LEADS_QUERY_KEY = ["leads"];

// ==========================================
// API - Funciones de servicio
// ==========================================

const leadsApi = {
  getAll: async (): Promise<Lead[]> => {
    const response = await leadsClient.get<Lead[]>("/leads");
    return response.data || [];
  },

  create: async (data: CreateLeadDto): Promise<Lead> => {
    const response = await leadsClient.post<Lead>("/leads", data);
    return response.data;
  },

  update: async (id: string, data: UpdateLeadDto): Promise<Lead> => {
    const response = await leadsClient.patch<Lead>(`/leads/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, idEstado: string): Promise<Lead> => {
    const response = await leadsClient.patch<Lead>(`/leads/${id}/status`, {
      id_estado: idEstado
    });
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await leadsClient.delete<{ message: string }>(`/leads/${id}`);
    return response.data;
  },
};

// ==========================================
// HOOKS - TanStack Query
// ==========================================

const useGetAll = () => {
  return useQuery({
    queryKey: LEADS_QUERY_KEY,
    queryFn: leadsApi.getAll,
  });
};

const useCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leadsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    },
  });
};

const useUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadDto }) =>
      leadsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    },
  });
};

const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, idEstado }: { id: string; idEstado: string }) =>
      leadsApi.updateStatus(id, idEstado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    },
  });
};

const useDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leadsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    },
  });
};

// ==========================================
// EXPORTACIÓN - Servicio completo
// ==========================================

export const LeadsService = {
  // API functions
  ...leadsApi,

  // Hooks
  useGetAll,
  useCreate,
  useUpdate,
  useUpdateStatus,
  useDelete,
};