import { EstadosLeadService } from "@/services/estados-lead.service";

/**
 * Hook personalizado para gestionar Estados de Leads
 * Proporciona acceso a los estados con caché automática
 */
export const useEstadoLeads = () => {

    // ==========================================
    // QUERIES - Obtener datos
    // ==========================================

    const {
        data: estadosLead,
        isLoading,
        isError,
        error,
        refetch,
    } = EstadosLeadService.useGetAll();

    // ==========================================
    // RETORNO - API pública del hook
    // ==========================================

    return {
        // Datos
        estadosLead,
        isLoading,
        isError,
        error,
        refetch,
    };
};