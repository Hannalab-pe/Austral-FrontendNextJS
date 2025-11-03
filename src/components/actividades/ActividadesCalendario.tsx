"use client";

import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, View, Views, ToolbarProps } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { useActividadesByUsuario } from '@/lib/hooks/useActividades';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import {
  Actividad,
  ActividadCalendario,
  COLORES_ACTIVIDAD,
  TipoActividad
} from '@/types/actividad.interface';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, PlusIcon, FilterIcon } from 'lucide-react';
import { FlipCard } from '../animations/FlipCard';
import { SlideUp } from '../animations/SlideUp';

// Configuración del localizer para español
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    es: es,
  },
});

// Mensajes en español para el calendario
const messages = {
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
  noEventsInRange: 'No hay actividades en este rango.',
  showMore: (total: number) => `+ Ver ${total} más`,
};

interface ActividadesCalendarioProps {
  className?: string;
}

export function ActividadesCalendario({ className }: ActividadesCalendarioProps) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Obtener actividades del usuario actual
  const { data: actividades, isLoading, error } = useActividadesByUsuario(user?.idUsuario || '');

  // Determinar el prefijo de ruta según el rol del usuario
  const rolePrefix = useMemo(() => {
    // Intentar obtener el rol desde el token JWT
    if (token) {
      const decoded = authService.decodeToken(token);
      if (decoded?.rol?.nombre) {
        const rolNombre = decoded.rol.nombre.toLowerCase();
        if (rolNombre === 'administrador' || rolNombre === 'admin') return 'admin';
        if (rolNombre === 'broker') return 'broker';
        if (rolNombre === 'vendedor') return 'vendedor';
      }
    }
    return 'admin'; // default
  }, [token]);

  // Convertir actividades al formato del calendario
  const eventosCalendario: ActividadCalendario[] = useMemo(() => {
    if (!actividades) return [];

    return actividades.map((actividad: Actividad) => {
      const fechaInicio = new Date(actividad.fechaActividad);
      const fechaFin = actividad.duracionMinutos
        ? new Date(fechaInicio.getTime() + actividad.duracionMinutos * 60000)
        : new Date(fechaInicio.getTime() + 60 * 60000); // 1 hora por defecto

      return {
        id: actividad.idActividad,
        title: actividad.titulo,
        start: fechaInicio,
        end: fechaFin,
        resource: actividad,
        backgroundColor: COLORES_ACTIVIDAD[actividad.tipoActividad as TipoActividad] || COLORES_ACTIVIDAD.OTRO,
        borderColor: COLORES_ACTIVIDAD[actividad.tipoActividad as TipoActividad] || COLORES_ACTIVIDAD.OTRO,
        textColor: '#ffffff',
      };
    });
  }, [actividades]);

  // Manejar clic en evento para editar
  const handleEventClick = (event: ActividadCalendario) => {
    router.push(`/${rolePrefix}/actividades/${event.id}/editar`);
  };

  // Manejar clic en botón nueva actividad
  const handleNuevaActividad = () => {
    router.push(`/${rolePrefix}/actividades/nuevo`);
  };

  // Componente personalizado para los eventos en el calendario
  const EventComponent = ({ event }: { event: ActividadCalendario }) => {
    return (
      <div className="text-xs font-medium truncate">
        <div className="flex items-center gap-1">
          <Badge
            variant="secondary"
            className="text-xs px-1 py-0"
            style={{
              backgroundColor: event.backgroundColor,
              color: event.textColor,
              border: 'none'
            }}
          >
            {event.resource?.tipoActividad}
          </Badge>
          <span className="truncate">{event.title}</span>
        </div>
      </div>
    );
  };

  // Componente personalizado para el toolbar del calendario
  const CustomToolbar = ({ label, onNavigate, onView }: ToolbarProps<ActividadCalendario>) => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('PREV')}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('TODAY')}
          >
            Hoy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('NEXT')}
          >
            Siguiente
          </Button>
        </div>

        <h2 className="text-lg font-semibold">{label}</h2>

        <div className="flex items-center gap-2">
          <Button
            variant={currentView === Views.MONTH ? "default" : "outline"}
            size="sm"
            onClick={() => onView(Views.MONTH)}
          >
            Mes
          </Button>
          <Button
            variant={currentView === Views.WEEK ? "default" : "outline"}
            size="sm"
            onClick={() => onView(Views.WEEK)}
          >
            Semana
          </Button>
          <Button
            variant={currentView === Views.DAY ? "default" : "outline"}
            size="sm"
            onClick={() => onView(Views.DAY)}
          >
            Día
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendario de Actividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <div className="text-muted-foreground">Cargando actividades...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendario de Actividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <div className="text-red-500">
              Error al cargar las actividades: {error.message}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <SlideUp>
      <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendario de Actividades
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleNuevaActividad}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nueva Actividad
            </Button>
            <Button variant="outline" size="sm">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <Calendar
            localizer={localizer}
            events={eventosCalendario}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            view={currentView}
            onView={setCurrentView}
            date={currentDate}
            onNavigate={setCurrentDate}
            messages={messages}
            culture="es"
            onSelectEvent={handleEventClick}
            components={{
              toolbar: CustomToolbar,
              event: EventComponent,
            }}
            eventPropGetter={(event: ActividadCalendario) => ({
              style: {
                backgroundColor: event.backgroundColor,
                borderColor: event.borderColor,
                color: event.textColor,
              },
            })}
          />
        </div>
      </CardContent>
      </Card>
    </SlideUp>
  );
}