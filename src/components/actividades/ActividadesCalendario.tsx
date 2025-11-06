"use client";

import React, { useState, useMemo } from 'react';
import { Calendar, View, Views } from 'react-big-calendar';
import { useRouter } from 'next/navigation';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { useActividadesPorUsuario } from '@/lib/hooks/useActividades';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import {
  calendarLocalizer,
  calendarMessages,
  CALENDAR_CULTURE,
  CALENDAR_DEFAULT_HEIGHT,
  actividadesToCalendarEvents,
  CalendarToolbar,
  CalendarEvent,
  calendarEventPropGetter,
} from '@/lib/calendar';
import { ActividadCalendario } from '@/types/actividad.interface';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, PlusIcon, FilterIcon } from 'lucide-react';
import { SlideUp } from '../animations/SlideUp';

interface ActividadesCalendarioProps {
  className?: string;
}

export function ActividadesCalendario({ className }: ActividadesCalendarioProps) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Obtener actividades del usuario actual
  const { actividades, isLoading, error } = useActividadesPorUsuario(user?.idUsuario || '');

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
    return actividadesToCalendarEvents(actividades || []);
  }, [actividades]);

  // Manejar clic en evento para editar
  const handleEventClick = (event: ActividadCalendario) => {
    router.push(`/${rolePrefix}/actividades/${event.id}/editar`);
  };

  // Manejar clic en botón nueva actividad
  const handleNuevaActividad = () => {
    router.push(`/${rolePrefix}/actividades/nuevo`);
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
        <div style={{ height: CALENDAR_DEFAULT_HEIGHT }}>
          <Calendar
            localizer={calendarLocalizer}
            events={eventosCalendario}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            view={currentView}
            onView={setCurrentView}
            date={currentDate}
            onNavigate={setCurrentDate}
            messages={calendarMessages}
            culture={CALENDAR_CULTURE}
            onSelectEvent={handleEventClick}
            components={{
              toolbar: (props) => (
                <CalendarToolbar
                  {...props}
                  currentView={currentView}
                  onViewChange={setCurrentView}
                />
              ),
              event: CalendarEvent,
            }}
            eventPropGetter={calendarEventPropGetter}
          />
        </div>
      </CardContent>
      </Card>
    </SlideUp>
  );
}