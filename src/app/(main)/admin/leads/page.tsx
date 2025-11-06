"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLeads } from "@/lib/hooks/useLeads";
import { useEstadoLeads } from "@/lib/hooks/useEstadoLeads";
import LeadsKanban from "@/components/leads/LeadsKanban";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
import { Lead } from "@/types/lead.interface";
import { toast } from "sonner";

/**
 * Página principal de gestión de Leads
 * Utiliza hooks useLeads y useEstadoLeads para todas las operaciones
 */
export default function LeadsPage() {
  const router = useRouter();
  
  // ==========================================
  // STATE - Estados locales
  // ==========================================
  
  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // HOOKS - Gestión de Leads y Estados
  // ==========================================
  
  const {
    leads,
    isLoading: isLoadingLeads,
    isError: isErrorLeads,
    error: errorLeads,
    changeLeadStatus,
    isChangingStatus,
  } = useLeads();

  const {
    estadosLead,
    isLoading: isLoadingEstados,
    isError: isErrorEstados,
    error: errorEstados,
  } = useEstadoLeads();

  // ==========================================
  // COMPUTED - Valores calculados
  // ==========================================
  
  // Filtrar leads por búsqueda (memoizado para optimización)
  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    if (!searchTerm) return leads;
    
    const term = searchTerm.toLowerCase();
    return leads.filter((lead) =>
      lead.nombre.toLowerCase().includes(term) ||
      lead.apellido?.toLowerCase().includes(term) ||
      lead.email?.toLowerCase().includes(term) ||
      lead.telefono.includes(term) ||
      lead.tipo_seguro_interes?.toLowerCase().includes(term)
    );
  }, [leads, searchTerm]);

  // Estadísticas (memoizado para optimización)
  const stats = useMemo(() => ({
    total: leads?.length || 0,
    activos: leads?.filter((l) => l.esta_activo).length || 0,
    altaPrioridad: leads?.filter((l) => l.prioridad === "ALTA").length || 0,
  }), [leads]);

  // ==========================================
  // HANDLERS - Manejadores de eventos
  // ==========================================
  
  /**
   * Manejar movimiento de lead entre columnas del Kanban
   */
  const handleLeadMove = async (leadId: string, newEstadoId: string) => {
    try {
      await changeLeadStatus(leadId, newEstadoId);
    } catch (err) {
      // El error ya fue manejado por el hook con toast
      console.error("Error moving lead:", err);
    }
  };

  /**
   * Manejar click en un lead del Kanban
   */
  const handleLeadClick = (lead: Lead) => {
    // Navegar a la página de detalle del lead
    router.push(`/admin/leads/${lead.id_lead}`);
  };

  // ==========================================
  // RENDER - Estados de carga y error
  // ==========================================
  
  const loading = isLoadingLeads || isLoadingEstados;
  const isError = isErrorLeads || isErrorEstados;
  const error = errorLeads || errorEstados;

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

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar los datos</p>
          <p className="text-gray-600 mb-4">{error?.message || "Error desconocido"}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER - Vista principal
  // ==========================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y da seguimiento a tus oportunidades de negocio
          </p>
          
          {/* Estadísticas rápidas */}
          <div className="flex gap-4 mt-3 text-sm">
            <span className="text-gray-600">
              Total: <span className="font-semibold text-gray-900">{stats.total}</span>
            </span>
            <span className="text-gray-600">
              Activos: <span className="font-semibold text-green-600">{stats.activos}</span>
            </span>
            <span className="text-gray-600">
              Alta Prioridad: <span className="font-semibold text-red-600">{stats.altaPrioridad}</span>
            </span>
          </div>
        </div>
        
        <Button onClick={() => router.push("/admin/leads/nuevo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Lead
        </Button>
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
      </div>

      {/* Vista Kanban */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Pipeline de Ventas
            </h2>
            {isChangingStatus && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Actualizando...</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">
                {searchTerm ? "No se encontraron leads" : "No hay leads registrados"}
              </p>
              <p className="text-gray-400 text-sm">
                {searchTerm 
                  ? "Intenta con otros términos de búsqueda" 
                  : "Comienza creando tu primer lead"}
              </p>
            </div>
          ) : (
            <LeadsKanban
              leads={filteredLeads}
              estados={estadosLead || []}
              onLeadMove={handleLeadMove}
              onLeadClick={handleLeadClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
