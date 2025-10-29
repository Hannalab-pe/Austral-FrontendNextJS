"use client";

import { useState, useEffect, useMemo } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Lead, KanbanColumn as KanbanColumnType } from "@/types/lead.interface";
import { EstadoLead } from "@/types/lead.interface";
import KanbanColumn from "./KanbanColumn";
import { toast } from "sonner";
import { LeadsService } from "@/services/leads.service";
import { EstadosLeadService } from "@/services/estados-lead.service";

interface LeadsKanbanProps {
  leads?: Lead[];
  estados?: EstadoLead[];
  searchTerm?: string;
  onLeadMove?: (leadId: string, newEstadoId: string) => void;
  onLeadClick?: (lead: Lead) => void;
}

export default function LeadsKanban({
  leads: propLeads,
  estados: propEstados,
  searchTerm = "",
  onLeadMove,
  onLeadClick,
}: LeadsKanbanProps) {
  const [leads, setLeads] = useState<Lead[]>(propLeads || []);
  const [estados, setEstados] = useState<EstadoLead[]>(propEstados || []);
  const [loading, setLoading] = useState(!propLeads || !propEstados);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales si no se pasaron como props
  useEffect(() => {
    if (propLeads && propEstados) {
      setLeads(propLeads);
      setEstados(propEstados);
      setLoading(false);
      return;
    }

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
        console.error("Error loading kanban data:", err);
        setError(err instanceof Error ? err.message : "Error al cargar datos");
        toast.error("Error al cargar los datos del kanban");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [propLeads, propEstados]);

  // Filtrar leads por búsqueda y validar que tengan id_lead
  const filteredLeads = useMemo(() => {
    // Primero filtrar solo leads válidos con id_lead
    const validLeads = leads.filter(lead => lead.id_lead);

    if (!searchTerm) return validLeads;
    const term = searchTerm.toLowerCase();
    return validLeads.filter(
      (lead) =>
        lead.nombre.toLowerCase().includes(term) ||
        lead.apellido?.toLowerCase().includes(term) ||
        lead.email?.toLowerCase().includes(term) ||
        lead.telefono.includes(term) ||
        lead.tipo_seguro_interes?.toLowerCase().includes(term)
    );
  }, [leads, searchTerm]);

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
      const nuevoEstado = estados.find(
        (e) => e.id_estado === destination.droppableId
      );

      // Mostrar notificación de éxito

      // Llamar al callback si existe
      onLeadMove?.(draggableId, destination.droppableId);
    } catch (err) {
      // Revertir el cambio si falla
      setLeads(leads);
      console.error("Error updating lead status:", err);
      toast.error("Error al actualizar el estado del lead");
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
