'use client';

import { useState, useEffect, useMemo } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Lead, KanbanColumn as KanbanColumnType } from '@/types/lead.interface';
import { EstadoLead } from '@/types/lead.interface';
import KanbanColumn from './KanbanColumn';
import { toast } from 'sonner';
import { LeadsService } from '@/services/leads.service';
import { EstadosLeadService } from '@/services/estados-lead.service';

interface LeadsKanbanProps {
  onLeadMove?: (leadId: string, newEstadoId: string) => void;
  onLeadClick?: (lead: Lead) => void;
}

export default function LeadsKanban({ 
  onLeadMove,
  onLeadClick,
}: LeadsKanbanProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [estados, setEstados] = useState<EstadoLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener leads y estados en paralelo
        const [leadsData, estadosData] = await Promise.all([
          LeadsService.getLeads(),
          EstadosLeadService.getEstadosLead(),
        ]);

        setLeads(leadsData);
        setEstados(estadosData);
      } catch (err) {
        console.error('Error loading kanban data:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
        toast.error('Error al cargar los datos del kanban');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

    // Optimistic update: actualizar el estado local inmediatamente
    const updatedLeads = leads.map((lead) =>
      lead.id_lead === draggableId
        ? { ...lead, id_estado: destination.droppableId }
        : lead
    );
    setLeads(updatedLeads);

    try {
      // Actualizar en el servidor
      await LeadsService.updateLeadStatus(draggableId, destination.droppableId);

      // Obtener el nombre del nuevo estado
      const nuevoEstado = estados.find((e) => e.id_estado === destination.droppableId);
      
      // Mostrar notificación de éxito
      toast.success(
        `Lead movido a "${nuevoEstado?.nombre || 'nuevo estado'}"`,
        {
          description: `${movedLead.nombre} ${movedLead.apellido || ''}`,
        }
      );

      // Llamar al callback si existe
      onLeadMove?.(draggableId, destination.droppableId);
    } catch (err) {
      // Revertir el cambio si falla
      setLeads(leads);
      console.error('Error updating lead status:', err);
      toast.error('Error al actualizar el estado del lead');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando kanban...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
