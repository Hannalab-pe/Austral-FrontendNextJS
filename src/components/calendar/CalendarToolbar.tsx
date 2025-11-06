"use client";

import { ToolbarProps, View, Views } from 'react-big-calendar';
import { Button } from '@/components/ui/button';

interface CalendarToolbarProps<TEvent extends object = object> extends ToolbarProps<TEvent> {
  currentView: View;
  onViewChange: (view: View) => void;
}

/**
 * Toolbar personalizado para React Big Calendar
 * Componente reutilizable con navegación y selección de vista
 */
export function CalendarToolbar<TEvent extends object = object>({
  label,
  onNavigate,
  onView,
  currentView,
  onViewChange,
}: CalendarToolbarProps<TEvent>) {
  
  const handleViewChange = (view: View) => {
    onView(view);
    onViewChange(view);
  };

  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
      {/* Navegación */}
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

      {/* Título (Mes/Semana actual) */}
      <h2 className="text-lg font-semibold text-gray-900">{label}</h2>

      {/* Selector de vista */}
      <div className="flex items-center gap-2">
        <Button
          variant={currentView === Views.MONTH ? "default" : "outline"}
          size="sm"
          onClick={() => handleViewChange(Views.MONTH)}
        >
          Mes
        </Button>
        <Button
          variant={currentView === Views.WEEK ? "default" : "outline"}
          size="sm"
          onClick={() => handleViewChange(Views.WEEK)}
        >
          Semana
        </Button>
        <Button
          variant={currentView === Views.DAY ? "default" : "outline"}
          size="sm"
          onClick={() => handleViewChange(Views.DAY)}
        >
          Día
        </Button>
        <Button
          variant={currentView === Views.AGENDA ? "default" : "outline"}
          size="sm"
          onClick={() => handleViewChange(Views.AGENDA)}
        >
          Agenda
        </Button>
      </div>
    </div>
  );
}
