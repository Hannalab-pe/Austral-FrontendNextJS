/**
 * Barrel export para configuración y utilidades de calendario
 * Importa todo lo necesario desde un solo lugar
 */

// Configuración
export {
    calendarLocalizer,
    calendarMessages,
    CALENDAR_CULTURE,
    CALENDAR_DEFAULT_HEIGHT,
    DEFAULT_EVENT_DURATION_MINUTES,
} from './calendarConfig';

// Utilidades
export {
    actividadesToCalendarEvents,
    actividadToCalendarEvent,
} from './calendarUtils';

// Componentes
export { CalendarToolbar } from '@/components/calendar/CalendarToolbar';
export { CalendarEvent, calendarEventPropGetter } from '@/components/calendar/CalendarEvent';
