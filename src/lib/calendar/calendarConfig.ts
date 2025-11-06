/**
 * Configuración reutilizable para React Big Calendar
 * Incluye localizer en español y mensajes traducidos
 */

import { dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';

// ==========================================
// LOCALIZER - Configuración en español
// ==========================================

export const calendarLocalizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: {
        es: es,
    },
});

// ==========================================
// MESSAGES - Mensajes traducidos
// ==========================================

export const calendarMessages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango.',
    showMore: (total: number) => `+ Ver ${total} más`,
};

// ==========================================
// CONSTANTS - Constantes útiles
// ==========================================

export const DEFAULT_EVENT_DURATION_MINUTES = 60;
export const CALENDAR_CULTURE = 'es';
export const CALENDAR_DEFAULT_HEIGHT = 600;
