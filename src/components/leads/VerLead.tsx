"use client";

import { useParams, useRouter } from "next/navigation";
import { Loader2, Edit, Mail, Phone, Calendar, DollarSign, User, FileText, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLeads } from "@/lib/hooks/useLeads";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const VerLead = () => {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  // ==========================================
  // HOOKS - Obtener lead específico
  // ==========================================

  const { leads, isLoading, isError } = useLeads();
  const lead = leads?.find((l) => l.id_lead === leadId);

  // ==========================================
  // RENDER - Estados de carga y error
  // ==========================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando detalles del lead...</p>
        </div>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Lead no encontrado</p>
          <Button onClick={() => router.push("/admin/leads")} variant="outline">
            Volver a Leads
          </Button>
        </div>
      </div>
    );
  }

  // ==========================================
  // HELPERS - Formateo de datos
  // ==========================================

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "No especificada";
    try {
      return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return "Fecha inválida";
    }
  };

  const formatDateTime = (date: string | Date | undefined) => {
    if (!date) return "No especificada";
    try {
      return format(new Date(date), "dd/MM/yyyy 'a las' HH:mm", { locale: es });
    } catch {
      return "Fecha inválida";
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "ALTA":
        return "bg-red-100 text-red-800";
      case "MEDIA":
        return "bg-yellow-100 text-yellow-800";
      case "BAJA":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ==========================================
  // RENDER - Vista de detalles
  // ==========================================

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {lead.nombre} {lead.apellido}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <Badge className={getPrioridadColor(lead.prioridad)}>
              Prioridad: {lead.prioridad}
            </Badge>
            {lead.estado && (
              <Badge 
                style={{ backgroundColor: lead.estado.color_hex }}
                className="text-white"
              >
                {lead.estado.nombre}
              </Badge>
            )}
            <span className="text-sm text-gray-500">
              Calificación: {lead.puntaje_calificacion}/100
            </span>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/admin/leads/${leadId}/editar`)}
          className="bg-blue-700 hover:bg-blue-800"
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar Lead
        </Button>
      </div>

      {/* Información de Contacto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información de Contacto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{lead.email || "No especificado"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium text-green-600">{lead.telefono}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                <p className="font-medium">{formatDate(lead.fecha_nacimiento)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información del Negocio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Información del Negocio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tipo de Seguro de Interés</p>
              <p className="font-medium">{lead.tipo_seguro_interes || "No especificado"}</p>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Presupuesto Aproximado</p>
                <p className="font-medium">
                  {lead.presupuesto_aproximado
                    ? `S/ ${lead.presupuesto_aproximado.toLocaleString()}`
                    : "No especificado"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fuente</p>
              <p className="font-medium">{lead.fuente?.nombre || "No especificada"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seguimiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Seguimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Primer Contacto</p>
              <p className="font-medium">{formatDateTime(lead.fecha_primer_contacto)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Último Contacto</p>
              <p className="font-medium">{formatDateTime(lead.fecha_ultimo_contacto)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Próximo Seguimiento</p>
              <p className="font-medium">{formatDateTime(lead.proxima_fecha_seguimiento)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de Creación</p>
              <p className="font-medium">{formatDateTime(lead.fecha_creacion)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notas */}
      {lead.notas && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{lead.notas}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

