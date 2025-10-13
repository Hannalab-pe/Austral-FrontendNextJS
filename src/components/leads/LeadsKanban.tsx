'use client';

import { useState, useMemo } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Lead, KanbanColumn as KanbanColumnType } from '@/types/lead.interface';
import { EstadoLead } from '@/types/lead.interface';
import KanbanColumn from './KanbanColumn';
import { toast } from 'sonner';

interface LeadsKanbanProps {
  leads: Lead[];
  estados: EstadoLead[];
  onLeadMove?: (leadId: string, newEstadoId: string) => void;
  onLeadClick?: (lead: Lead) => void;
}

export default function LeadsKanban({ 
  leads: initialLeads, 
  estados,
  onLeadMove,
  onLeadClick,
}: LeadsKanbanProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  // Organizar leads por columnas
  const columns: KanbanColumnType[] = useMemo(() => {
    return estados
      .filter((estado) => estado.esta_activo)
      .sort((a, b) => a.orden_proceso - b.orden_proceso)
      .map((estado) => ({
        id: estado.id_estado,
        titulo: estado.nombre,
        color: estado.color_hex,
        orden: estado.orden_proceso,
        leads: leads.filter((lead) => lead.id_estado === estado.id_estado),
      }));
  }, [leads, estados]);

  // Manejar el drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Si no hay destino, no hacer nada
    if (!destination) return;

    // Si se suelta en la misma posición, no hacer nada
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Encontrar el lead que se movió
    const movedLead = leads.find((lead) => lead.id_lead === draggableId);
    if (!movedLead) return;

    // Actualizar el estado del lead
    const updatedLeads = leads.map((lead) =>
      lead.id_lead === draggableId
        ? { ...lead, id_estado: destination.droppableId }
        : lead
    );

    // Actualizar el estado local
    setLeads(updatedLeads);

    // Obtener el nombre del nuevo estado
    const nuevoEstado = estados.find((e) => e.id_estado === destination.droppableId);
    
    // Mostrar notificación
    toast.success(
      `Lead movido a "${nuevoEstado?.nombre || 'nuevo estado'}"`,
      {
        description: `${movedLead.nombre} ${movedLead.apellido || ''}`,
      }
    );

    // Llamar al callback si existe
    onLeadMove?.(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <KanbanColumn
              columnId={column.id}
              titulo={column.titulo}
              color={column.color}
              leads={column.leads}
              onLeadClick={onLeadClick}
            />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
