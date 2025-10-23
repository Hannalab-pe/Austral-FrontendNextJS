import { agenteRutasClient } from '@/lib/api/api';
import { RutaQuery, RutaResponse } from '@/types/agente-rutas.interface';

export const agenteRutasService = {
    /**
     * Genera una ruta optimizada basada en la consulta del usuario
     */
    async generateRoute(query: RutaQuery): Promise<RutaResponse> {
        try {
            const response = await agenteRutasClient.post<RutaResponse>('/api/route', query);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || error.message
                : 'Error al generar la ruta';
            throw new Error(message);
        }
    },
};