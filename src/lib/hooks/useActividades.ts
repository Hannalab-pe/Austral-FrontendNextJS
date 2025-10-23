import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { actividadService } from '@/services/actividad.service';
import { actividadesKeys } from '@/lib/constants/query-keys';
import { CreateActividadDto, UpdateActividadDto, ActividadFiltros } from '@/types/actividad.interface';
import { toast } from 'sonner';

// Hook para obtener todas las actividades
export const useActividades = (filtros?: ActividadFiltros) => {
    return useQuery({
        queryKey: actividadesKeys.list(filtros),
        queryFn: () => actividadService.getAll(),
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
};

// Hook para obtener actividades por usuario
export const useActividadesByUsuario = (realizadaPorUsuario: string) => {
    return useQuery({
        queryKey: actividadesKeys.byUsuario(realizadaPorUsuario),
        queryFn: () => actividadService.getByUsuario(realizadaPorUsuario),
        enabled: !!realizadaPorUsuario,
        staleTime: 5 * 60 * 1000,
    });
};

// Hook para obtener actividades por tipo
export const useActividadesByTipo = (tipo: string) => {
    return useQuery({
        queryKey: actividadesKeys.byTipo(tipo),
        queryFn: () => actividadService.getByTipo(tipo),
        enabled: !!tipo,
        staleTime: 5 * 60 * 1000,
    });
};

// Hook para obtener actividades por rango de fechas
export const useActividadesByFechaRange = (fechaInicio: Date, fechaFin: Date) => {
    return useQuery({
        queryKey: actividadesKeys.byFechaRange(fechaInicio, fechaFin),
        queryFn: () => actividadService.getByFechaRange(fechaInicio, fechaFin),
        enabled: !!fechaInicio && !!fechaFin,
        staleTime: 5 * 60 * 1000,
    });
};

// Hook para obtener una actividad específica
export const useActividad = (id: string) => {
    return useQuery({
        queryKey: actividadesKeys.detail(id),
        queryFn: () => actividadService.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

// Hook para crear una actividad
export const useCreateActividad = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateActividadDto) => actividadService.create(data),
        onSuccess: () => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: actividadesKeys.all });

            toast.success('Actividad creada exitosamente');
        },
        onError: (error) => {
            toast.error(error.message || 'Error al crear la actividad');
        },
    });
};

// Hook para actualizar una actividad
export const useUpdateActividad = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateActividadDto }) =>
            actividadService.update(id, data),
        onSuccess: (updatedActividad) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: actividadesKeys.all });
            queryClient.invalidateQueries({
                queryKey: actividadesKeys.detail(updatedActividad.idActividad)
            });

            toast.success('Actividad actualizada exitosamente');
        },
        onError: (error) => {
            toast.error(error.message || 'Error al actualizar la actividad');
        },
    });
};

// Hook para eliminar una actividad
export const useDeleteActividad = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => actividadService.delete(id),
        onSuccess: () => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: actividadesKeys.all });

            toast.success('Actividad eliminada exitosamente');
        },
        onError: (error) => {
            toast.error(error.message || 'Error al eliminar la actividad');
        },
    });
};