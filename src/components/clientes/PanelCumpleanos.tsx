"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  View,
  Views,
  ToolbarProps,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useClientes } from "@/lib/hooks/useClientes";
import { useAuthStore } from "@/store/authStore";
import { Cliente } from "@/types/cliente.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

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
  allDay: "Todo el día",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "No hay cumpleaños en este rango.",
  showMore: (total: number) => `+ Ver ${total} más`,
};

interface CumpleanosCalendario {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Cliente;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

interface PanelCumpleanosProps {
  className?: string;
}

export function PanelCumpleanos({ className }: PanelCumpleanosProps) {
  const { user } = useAuthStore();
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Obtener clientes del usuario actual
  const {
    data: clientes,
    isLoading,
    error,
  } = useClientes({ esta_activo: true });

  // Convertir cumpleaños al formato del calendario
  const eventosCalendario: CumpleanosCalendario[] = useMemo(() => {
    if (!clientes) return [];

    console.log("📅 Clientes obtenidos:", clientes);
    console.log(
      "🎂 Clientes con cumpleaños:",
      clientes.filter((c) => c.cumpleanos)
    );

    return clientes
      .filter((cliente: Cliente) => cliente.cumpleanos) // Solo clientes con cumpleaños
      .map((cliente: Cliente) => {
        // Extraer fecha del cumpleaños correctamente para evitar problemas de zona horaria
        const fechaString = cliente.cumpleanos!.toString().split("T")[0]; // "YYYY-MM-DD"
        const [year, month, day] = fechaString.split("-").map(Number);

        const fechaActual = new Date();

        // Crear fecha del cumpleaños para este año
        const fechaCumpleanos = new Date(
          fechaActual.getFullYear(),
          month - 1, // month es 0-based
          day
        );

        // Si ya pasó este año, mostrar para el próximo año
        if (fechaCumpleanos < fechaActual) {
          fechaCumpleanos.setFullYear(fechaActual.getFullYear() + 1);
        }

        const nombreCompleto =
          cliente.nombres && cliente.apellidos
            ? `${cliente.nombres} ${cliente.apellidos}`
            : cliente.razonSocial || "Cliente sin nombre";

        const evento = {
          id: cliente.idCliente,
          title: `🎂 ${nombreCompleto}`,
          start: fechaCumpleanos,
          end: fechaCumpleanos,
          resource: cliente,
          backgroundColor: "#f59e0b", // Color amarillo para cumpleaños
          borderColor: "#d97706",
          textColor: "#ffffff",
        };

        console.log("🎉 Evento creado:", evento);
        return evento;
      });
  }, [clientes]);

  // Componente personalizado para los eventos en el calendario
  const EventComponent = ({ event }: { event: CumpleanosCalendario }) => {
    const edad = event.resource.cumpleanos
      ? ((new Date().getFullYear() - new Date(event.resource.cumpleanos).getFullYear()) + 1)
      : null;

    return (
      <div className="text-xs font-medium truncate">
        <div className="flex flex-col">
          <Badge
            variant="secondary"
            className="text-xs px-1 py-0"
            style={{
              backgroundColor: event.backgroundColor,
              color: event.textColor,
              border: "none",
            }}
          >
            <span className="truncate">🎂{event.title.replace("🎂 ", " ")}</span>
          </Badge>
          <span className="truncate">{edad !== null && ` (${edad} años)`}</span>
        </div>
      </div>
    );
  };

  // Componente personalizado para el toolbar del calendario
  const CustomToolbar = ({
    label,
    onNavigate,
    onView,
  }: ToolbarProps<CumpleanosCalendario>) => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("PREV")}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("TODAY")}
          >
            Hoy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("NEXT")}
          >
            <ChevronRight className="w-4 h-4" />
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
            Panel de Cumpleaños
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            <span className="text-muted-foreground">
              Cargando cumpleaños...
            </span>
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
            Panel de Cumpleaños
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <p className="text-red-500">Error al cargar los cumpleaños</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Panel de Cumpleaños
        </CardTitle>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            {eventosCalendario.length} cumpleaños próximos
          </Badge>
          <div className="text-sm text-muted-foreground">
            Visualiza los cumpleaños de tus clientes
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <Calendar
            localizer={localizer}
            culture="es"
            events={eventosCalendario}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            view={currentView}
            onView={setCurrentView}
            date={currentDate}
            onNavigate={setCurrentDate}
            messages={messages}
            components={{
              event: EventComponent,
              toolbar: CustomToolbar,
            }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.backgroundColor,
                borderColor: event.borderColor,
                color: event.textColor,
                borderRadius: "4px",
                border: "1px solid",
                fontSize: "12px",
              },
            })}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            popup
          />
        </div>
      </CardContent>
    </Card>
  );
}
