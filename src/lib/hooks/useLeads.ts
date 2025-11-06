import { LeadsService } from "@/services/leads.service";
import { CreateLeadDto, UpdateLeadDto } from "@/types/lead.interface";
import { getErrorMessage } from "../utils/getErrorMessage";
import { toast } from "sonner";

export const useLeads = () => {

    // ==========================================
    // MUTATIONS - Hooks de React Query
    // ==========================================

    const createMutation = LeadsService.useCreate();
    const updateMutation = LeadsService.useUpdate();
    const deleteMutation = LeadsService.useDelete();
    const updateStatusMutation = LeadsService.useUpdateStatus();

    // ==========================================
    // FUNCIONES - Wrappers con manejo de errores
    // ==========================================

    const {
        data: leads,
        isLoading,
        isError,
        error,
        refetch,
    } = LeadsService.useGetAll(); // Obtener todos los leads

    const addLead = async (data: CreateLeadDto) => {
        try {
            const lead = await createMutation.mutateAsync(data);
            toast.success("Lead creado con éxito");
            return lead;
        } catch (err) {
            const errorMessage = getErrorMessage(err, "Error al crear el lead");
            toast.error(errorMessage);
            throw err;
        }
    }; // Crear un nuevo lead

    const updateLead = async (data: UpdateLeadDto) => {
        try {
            // Extraer id_lead del objeto
            const { id_lead, ...restData } = data;

            // El resto de los datos son compatibles con UpdateLeadDto (sin id_lead)
            const lead = await updateMutation.mutateAsync({
                id: id_lead,
                data: restData as UpdateLeadDto,
            });

            toast.success("Lead actualizado con éxito");
            return lead;
        } catch (err) {
            const errorMessage = getErrorMessage(err, "Error al actualizar el lead");
            toast.error(errorMessage);
            throw err;
        }
    }; // Actualizar un lead existente

    const removeLead = async (id: string) => {
        try {
            const response = await deleteMutation.mutateAsync(id);
            toast.success(response.message || "Lead eliminado con éxito");
            return response;
        } catch (err) {
            const errorMessage = getErrorMessage(err, "Error al eliminar el lead");
            toast.error(errorMessage);
            throw err;
        }
    }; // Eliminar un lead

    const changeLeadStatus = async (id: string, idEstado: string) => {
        try {
            const lead = await updateStatusMutation.mutateAsync({ id, idEstado });
            toast.success("Estado actualizado con éxito");
            return lead;
        } catch (err) {
            const errorMessage = getErrorMessage(err, "Error al actualizar el estado");
            toast.error(errorMessage);
            throw err;
        }
    }; // Cambiar el estado de un lead

    // ==========================================
    // RETORNO - API pública del hook
    // ==========================================

    return {
        // Datos
        leads,
        isLoading,
        isError,
        error,
        refetch,

        // Estados de mutaciones
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isChangingStatus: updateStatusMutation.isPending,

        // Funciones
        addLead,
        updateLead,
        removeLead,
        changeLeadStatus,
    };
};

// ==========================================
// UTILIDADES - Funciones auxiliares
// ==========================================
