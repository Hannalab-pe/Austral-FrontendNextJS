"use client";

import { Badge } from '@/components/ui/badge';
import { ActividadCalendario } from '@/types/actividad.interface';

interface CalendarEventProps {
  event: ActividadCalendario;
}

/**
 * Componente personalizado para renderizar eventos en el calendario
 * Muestra tipo de actividad como badge y título
 */
export function CalendarEvent({ event }: CalendarEventProps) {
  return (
    <div className="text-xs font-medium truncate px-1">
      <div className="flex items-center gap-1">
        <Badge
          variant="secondary"
          className="text-[10px] px-1 py-0 h-4 font-medium"
          style={{
            backgroundColor: event.backgroundColor,
            color: event.textColor,
            border: 'none',
          }}
        >
          {event.resource?.tipoActividad}
        </Badge>
        <span className="truncate text-white">{event.title}</span>
      </div>
    </div>
  );
}

/**
 * Props getter para estilizar los eventos del calendario
 * Retorna estilos CSS basados en las propiedades del evento
 */
export const calendarEventPropGetter = (event: ActividadCalendario) => ({
  style: {
    backgroundColor: event.backgroundColor,
    borderColor: event.borderColor,
    color: event.textColor,
    borderRadius: '4px',
    border: `1px solid ${event.borderColor}`,
  },
});
