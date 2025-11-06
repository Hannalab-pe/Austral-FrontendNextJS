import { ActividadService } from "@/services/actividad.service";
import {
    CreateActividadDto,
    UpdateActividadDto,
} from '@/types/actividad.interface';
import { toast } from "sonner";
import { getErrorMessage } from "../utils/getErrorMessage";

export const useActividades = () => {

    // ==========================================
    // QUERIES - Hooks de React Query
    // ==========================================

    const {
        data: actividades,
        isLoading,
        isError,
        error,
        refetch,
    } = ActividadService.useGetAll(); // Obtener todas las actividades

    // ==========================================
    // MUTATIONS - Hooks de React Query
    // ==========================================

    const createMutation = ActividadService.useCreate();
    const updateMutation = ActividadService.useUpdate();
    const deleteMutation = ActividadService.useDelete();

    // ==========================================
    // FUNCIONES - Wrappers con manejo de errores
    // ==========================================

    const addActividad = async (data: CreateActividadDto) => {
        try {
            const actividad = await createMutation.mutateAsync(data);
            toast.success("Actividad creada con éxito");
            return actividad;
        } catch (err) {
            const errorMessage = getErrorMessage(err, "Error al crear la actividad");
            toast.error(errorMessage);
            throw err;
        }
    }; // Crear una nueva actividad

    const updateActividad = async (data: UpdateActividadDto & { idActividad: string }) => {
        try {
            // Extraer idActividad del objeto
            const { idActividad, ...restData } = data;

            // El resto de los datos son compatibles con UpdateActividadDto (sin idActividad)
            const actividad = await updateMutation.mutateAsync({
                id: idActividad,
                data: restData as UpdateActividadDto,
            });

            toast.success("Actividad actualizada con éxito");
            return actividad;
        } catch (err) {
            const errorMessage = getErrorMessage(err, "Error al actualizar la actividad");
            toast.error(errorMessage);
            throw err;
        }
    }; // Actualizar una actividad existente

    const removeActividad = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
            toast.success("Actividad eliminada con éxito");
        } catch (err) {
            const errorMessage = getErrorMessage(err, "Error al eliminar la actividad");
            toast.error(errorMessage);
            throw err;
        }
    }; // Eliminar una actividad por ID

    // ==========================================
    // RETORNO - API pública del hook
    // ==========================================

    return {
        // Datos
        actividades,
        isLoading,
        isError,
        error,
        refetch,

        // Estados de mutaciones
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,

        // Funciones
        addActividad,
        updateActividad,
        removeActividad,
    };
};

/**
 * Hook para obtener una actividad específica por ID
 * Usar cuando necesites cargar una sola actividad
 */
export const useActividad = (actividadId: string) => {
    const {
        data: actividad,
        isLoading,
        isError,
        error,
        refetch,
    } = ActividadService.useGetById(actividadId);

    return {
        actividad,
        isLoading,
        isError,
        error,
        refetch,
    };
};

/**
 * Hook para obtener actividades de un usuario específico
 * Usar cuando necesites filtrar por usuario
 */
export const useActividadesPorUsuario = (userId: string) => {
    const {
        data: actividades,
        isLoading,
        isError,
        error,
        refetch,
    } = ActividadService.useGetByUserId(userId);

    return {
        actividades,
        isLoading,
        isError,
        error,
        refetch,
    };
};
