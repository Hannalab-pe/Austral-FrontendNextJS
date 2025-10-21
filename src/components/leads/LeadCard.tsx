import { Lead, Prioridad } from '@/types/lead.interface';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Phone, 
  DollarSign, 
  Target,
  Clock,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
}

const PRIORIDAD_CONFIG: Record<Prioridad, { color: string; label: string }> = {
  ALTA: { color: "bg-red-100 text-red-800 border-red-200", label: "Alta" },
  MEDIA: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    label: "Media",
  },
  BAJA: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Baja" },
};

export default function LeadCard({ lead, onClick }: LeadCardProps) {
  const prioridadConfig = PRIORIDAD_CONFIG[lead.prioridad];

  return (
    <Card
      className="p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow bg-white border border-gray-200"
      onClick={onClick}
    >
      {/* Header: Nombre, Estado y Prioridad */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base mb-1">
            {lead.nombre} {lead.apellido}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            {lead.estado && (
              <div className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: lead.estado.color_hex }}
                />
                <span className="text-xs text-gray-600 font-medium">
                  {lead.estado.nombre}
                </span>
              </div>
            )}
            <Badge className={`${prioridadConfig.color} text-xs font-medium`}>
              {prioridadConfig.label}
            </Badge>
          </div>
          {lead.tipo_seguro_interes && (
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <Target className="h-3 w-3" />
              {lead.tipo_seguro_interes}
            </p>
          )}
        </div>
      </div>

      {/* Información de Contacto */}
      <div className="space-y-2 mb-3">
        {lead.email && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Phone className="h-3 w-3 shrink-0" />
          <span>{lead.telefono}</span>
        </div>
        {lead.fuente && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <TrendingUp className="h-3 w-3 shrink-0" />
            <span className="truncate">{lead.fuente.nombre}</span>
          </div>
        )}
      </div>

      {/* Presupuesto, Puntaje y Fechas */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {lead.presupuesto_aproximado && (
          <div className="flex items-center gap-1 text-xs">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="font-medium text-gray-700">
              S/ {typeof lead.presupuesto_aproximado === 'string' 
                ? parseFloat(lead.presupuesto_aproximado).toLocaleString() 
                : lead.presupuesto_aproximado.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  lead.puntaje_calificacion >= 80
                    ? "bg-green-500"
                    : lead.puntaje_calificacion >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${lead.puntaje_calificacion}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 font-medium">
              {lead.puntaje_calificacion}%
            </span>
          </div>
        </div>
      </div>

      {/* Fechas y Asignación */}
      <div className="space-y-1 mb-3">
        {lead.fecha_primer_contacto && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Primer contacto: {format(new Date(lead.fecha_primer_contacto), 'dd/MM/yyyy', { locale: es })}</span>
          </div>
        )}
        {lead.proxima_fecha_seguimiento && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Seguimiento: {format(new Date(lead.proxima_fecha_seguimiento), 'dd/MM/yyyy HH:mm', { locale: es })}</span>
          </div>
        )}
        {lead.asignado_a_usuario && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User className="h-3 w-3" />
            <span>Asignado a usuario</span>
          </div>
        )}
      </div>

      {/* Notas */}
      {lead.notas && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 line-clamp-2">{lead.notas}</p>
        </div>
      )}
    </Card>
  );
}
