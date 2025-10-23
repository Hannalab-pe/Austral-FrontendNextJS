/**
 * Hooks para gestión de Auditoría con TanStack Query
 *
 * Estos hooks encapsulan toda la lógica de fetching de registros de auditoría,
 * proporcionando caché automático y manejo de estados.
 */

import { useQuery } from '@tanstack/react-query';
import { auditoriaKeys } from '@/lib/constants/query-keys';
import { auditoriaService } from '@/services/auditoria.service';
import {
    Auditoria,
    AuditoriaFiltros,
    AuditoriaStats,
} from '@/types/auditoria.interface';

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook para obtener todos los registros de auditoría con filtros opcionales
 *
 * @param filters - Filtros para la búsqueda (tabla, accion, fechaDesde, fechaHasta)
 * @param initialData - Datos iniciales (opcional, para SSR)
 * @returns Query con la lista de registros de auditoría
 */
export function useAuditoria(filters?: AuditoriaFiltros, initialData?: Auditoria[]) {
    return useQuery({
        queryKey: auditoriaKeys.list(filters),
        queryFn: () => auditoriaService.getAll(filters),
        initialData,
        staleTime: 60 * 1000, // 1 minuto (datos de auditoría cambian menos frecuentemente)
    });
}

/**
 * Hook para obtener registros de auditoría de un usuario específico
 *
 * @param idUsuario - ID del usuario
 * @param filters - Filtros adicionales (tabla, accion, fechas)
 * @param enabled - Si la query debe ejecutarse (por defecto true)
 * @returns Query con registros de auditoría del usuario
 */
export function useAuditoriaByUsuario(
    idUsuario: string,
    filters?: AuditoriaFiltros,
    enabled: boolean = true
) {
    return useQuery({
        queryKey: auditoriaKeys.byUsuario(idUsuario, filters),
        queryFn: () => auditoriaService.getByUsuario(idUsuario, filters),
        enabled: enabled && !!idUsuario,
        staleTime: 60 * 1000,
    });
}

/**
 * Hook para obtener estadísticas de auditoría
 *
 * @returns Query con estadísticas de auditoría
 */
export function useAuditoriaStats() {
    return useQuery({
        queryKey: auditoriaKeys.stats(),
        queryFn: auditoriaService.getStats,
        staleTime: 5 * 60 * 1000, // 5 minutos (estadísticas cambian menos frecuentemente)
    });
}