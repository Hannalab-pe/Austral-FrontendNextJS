import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activitiesClient } from '@/lib/api/api';
import {
    Actividad,
    CreateActividadDto,
    UpdateActividadDto,
} from '@/types/actividad.interface';

export const ACTIVIDAD_KEY = ['actividad'];

// ==========================================
// API - Funciones de servicio
// ==========================================

export const actividadApi = {
    getAll: async (): Promise<Actividad[]> => {
        const response = await activitiesClient.get<Actividad[]>('/actividades');
        return response.data;
    },

    getById: async (id: string): Promise<Actividad> => {
        const response = await activitiesClient.get<Actividad>(`/actividades/${id}`);
        return response.data;
    },

    getByUserId: async (userId: string): Promise<Actividad[]> => {
        const response = await activitiesClient.get<Actividad[]>(`/actividades/usuario/${userId}`);
        return response.data;
    },

    create: async (data: CreateActividadDto): Promise<Actividad> => {
        const response = await activitiesClient.post<Actividad>('/actividades', data);
        return response.data;
    },

    update: async (id: string, data: UpdateActividadDto): Promise<Actividad> => {
        const response = await activitiesClient.patch<Actividad>(`/actividades/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await activitiesClient.delete(`/actividades/${id}`);
    },
};
// ==========================================
// HOOKS - TanStack Query
// ==========================================

const useGetAll = () => {
    return useQuery({
        queryKey: ACTIVIDAD_KEY,
        queryFn: actividadApi.getAll,
    });
};

const useGetById = (id: string) => {
    return useQuery({
        queryKey: [...ACTIVIDAD_KEY, id],
        queryFn: () => actividadApi.getById(id),
        enabled: !!id,
    });
};

const useGetByUserId = (userId: string) => {
    return useQuery({
        queryKey: [...ACTIVIDAD_KEY, 'user', userId],
        queryFn: () => actividadApi.getByUserId(userId),
        enabled: !!userId,
    });
};

const useCreate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: actividadApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACTIVIDAD_KEY });
        },
    });
};

const useUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateActividadDto }) =>
            actividadApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACTIVIDAD_KEY });
        },
    });
};

const useDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => actividadApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACTIVIDAD_KEY });
        },
    });
};


export const ActividadService = {
    // API functions
    ...actividadApi,

    // Hooks
    useGetAll,
    useGetById,
    useGetByUserId,
    useCreate,
    useUpdate,
    useDelete,
};