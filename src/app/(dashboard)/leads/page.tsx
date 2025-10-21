"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LeadsKanban from "@/components/leads/LeadsKanban";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
import { EstadoLead, Lead } from "@/types/lead.interface";
import { LeadsService } from "@/services/leads.service";
import { EstadosLeadService } from "@/services/estados-lead.service";
import { toast } from "sonner";

export default function LeadsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [estados, setEstados] = useState<EstadoLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar leads y estados desde la API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar leads y estados en paralelo
        const [leadsData, estadosData] = await Promise.all([
          LeadsService.getLeads(),
          EstadosLeadService.getEstadosLead(),
        ]);

        setLeads(leadsData);
        setEstados(estadosData);

        // Mostrar notificación si se están usando datos mock
        const isUsingMockData =
          leadsData.length > 0 &&
          leadsData[0]?.fecha_creacion?.includes("2025-10-01");
        if (isUsingMockData) {
          toast.info("Modo Desarrollo", {
            description: "Usando datos de ejemplo. La API no está disponible.",
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        toast.error("Error al cargar datos", {
          description: errorMessage,
        });
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar leads por búsqueda
  const filteredLeads = leads.filter((lead) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      lead.nombre.toLowerCase().includes(term) ||
      lead.apellido?.toLowerCase().includes(term) ||
      lead.email?.toLowerCase().includes(term) ||
      lead.telefono.includes(term) ||
      lead.tipo_seguro_interes?.toLowerCase().includes(term)
    );
  });

  // Manejar movimiento de lead entre columnas
  const handleLeadMove = async (leadId: string, newEstadoId: string) => {
    try {
      // Actualizar localmente primero para feedback inmediato
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id_lead === leadId ? { ...lead, id_estado: newEstadoId } : lead
        )
      );

      // Intentar actualizar en la API
      try {
        await LeadsService.updateLeadStatus(leadId, newEstadoId);
        toast.success("Lead actualizado", {
          description: "El estado del lead ha sido actualizado correctamente.",
        });
      } catch (apiError) {
        // Si la API falla, revertir el cambio local
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead.id_lead === leadId
              ? { ...lead, id_estado: lead.id_estado } // Mantener el estado original
              : lead
          )
        );

        const errorMessage =
          apiError instanceof Error
            ? apiError.message
            : "Error al actualizar lead";
        toast.warning("Actualización Local", {
          description: "Cambio aplicado localmente. " + errorMessage,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar lead";
      toast.error("Error al actualizar lead", {
        description: errorMessage,
      });
      console.error("Error updating lead status:", err);
    }
  };

  // Manejar click en un lead
  const handleLeadClick = (lead: Lead) => {
    toast.info("Detalle del lead", {
      description: `${lead.nombre} ${lead.apellido || ""}`,
    });
    // Aquí se podría abrir un modal o navegar a la página de detalle
    // router.push(`/leads/${lead.id_lead}`);
  };

  // Estadísticas rápidas
  const stats = {
    total: leads.length,
    activos: leads.filter((l) => l.esta_activo).length,
    alta_prioridad: leads.filter((l) => l.prioridad === "ALTA").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando leads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar los leads</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y da seguimiento a tus oportunidades de negocio
          </p>
        </div>
        <Button onClick={() => router.push("/leads/nuevo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Lead
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total de Leads</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Leads Activos</p>
          <p className="text-2xl font-bold text-blue-600">{stats.activos}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Alta Prioridad</p>
          <p className="text-2xl font-bold text-red-600">
            {stats.alta_prioridad}
          </p>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar leads por nombre, email, teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Vista Kanban */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Pipeline de Ventas
          </h2>
        </div>
        <div className="p-6">
          <LeadsKanban
            leads={filteredLeads}
            estados={estados}
            onLeadMove={handleLeadMove}
            onLeadClick={handleLeadClick}
          />
        </div>
      </div>
    </div>
  );
}
