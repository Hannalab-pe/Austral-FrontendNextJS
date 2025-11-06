/**
 * Utilidades para transformar datos a formato de calendario
 */

import { Actividad, ActividadCalendario, COLORES_ACTIVIDAD, TipoActividad } from '@/types/actividad.interface';
import { DEFAULT_EVENT_DURATION_MINUTES } from './calendarConfig';

/**
 * Convierte un array de actividades al formato de eventos del calendario
 * @param actividades - Array de actividades a convertir
 * @returns Array de eventos formateados para React Big Calendar
 */
export function actividadesToCalendarEvents(actividades: Actividad[]): ActividadCalendario[] {
    if (!actividades || actividades.length === 0) return [];

    return actividades.map((actividad) => {
        const fechaInicio = new Date(actividad.fechaActividad);

        // Calcular fecha fin basada en duración o usar 1 hora por defecto
        const duracionMs = (actividad.duracionMinutos || DEFAULT_EVENT_DURATION_MINUTES) * 60000;
        const fechaFin = new Date(fechaInicio.getTime() + duracionMs);

        // Obtener color según tipo de actividad
        const tipoActividad = actividad.tipoActividad as TipoActividad;
        const color = COLORES_ACTIVIDAD[tipoActividad] || COLORES_ACTIVIDAD.OTRO;

        return {
            id: actividad.idActividad,
            title: actividad.titulo,
            start: fechaInicio,
            end: fechaFin,
            resource: actividad,
            backgroundColor: color,
            borderColor: color,
            textColor: '#ffffff',
        };
    });
}

/**
 * Convierte una sola actividad al formato de evento del calendario
 * @param actividad - Actividad a convertir
 * @returns Evento formateado para React Big Calendar
 */
export function actividadToCalendarEvent(actividad: Actividad): ActividadCalendario {
    const eventos = actividadesToCalendarEvents([actividad]);
    return eventos[0];
}
