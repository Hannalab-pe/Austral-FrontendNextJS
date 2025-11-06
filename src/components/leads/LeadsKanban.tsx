"use client";

import { useMemo } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Lead, KanbanColumn as KanbanColumnType } from "@/types/lead.interface";
import { EstadoLead } from "@/types/lead.interface";
import KanbanColumn from "./KanbanColumn";
import { toast } from "sonner";

interface LeadsKanbanProps {
  leads: Lead[];
  estados: EstadoLead[];
  searchTerm?: string;
  onLeadMove?: (leadId: string, newEstadoId: string) => void;
  onLeadClick?: (lead: Lead) => void;
}

export default function LeadsKanban({
  leads,
  estados,
  searchTerm = "",
  onLeadMove,
  onLeadClick,
}: LeadsKanbanProps) {

  // Los leads ya vienen filtrados desde el componente padre
  // Solo necesitamos validar que tengan id_lead
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => lead.id_lead);
  }, [leads]);

  // Organizar leads por columnas
  const columns: KanbanColumnType[] = useMemo(() => {
    const activeEstados = estados.filter((estado) => estado.esta_activo);

    return activeEstados
      .sort((a, b) => a.orden_proceso - b.orden_proceso)
      .map((estado) => ({
        id: estado.id_estado,
        titulo: estado.nombre,
        color: estado.color_hex,
        orden: estado.orden_proceso,
        leads: filteredLeads.filter(
          (lead) => lead.id_estado === estado.id_estado
        ),
      }));
  }, [filteredLeads, estados]);

  // Manejar el drag and drop
  const handleDragEnd = async (result: DropResult) => {
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

    try {
      // Llamar al callback del componente padre que maneja la actualización
      await onLeadMove?.(draggableId, destination.droppableId);
    } catch (err) {
      console.error("Error updating lead status:", err);
      toast.error("Error al actualizar el estado del lead");
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="overflow-x-auto max-w-[1400px]">
        <div className="flex gap-4">
          {columns.length === 0 ? (
            <div className="flex items-center justify-center w-full h-64">
              <div className="text-center">
                <p className="text-gray-500 mb-2">No hay estados de lead configurados</p>
                <p className="text-sm text-gray-400">Verifica que existan estados activos en el sistema</p>
              </div>
            </div>
          ) : (
            columns.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-80">
                <KanbanColumn
                  columnId={column.id}
                  titulo={column.titulo}
                  color={column.color}
                  leads={column.leads}
                  onLeadClick={onLeadClick}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </DragDropContext>
  );
}
