import { CompaniaSeguro } from '@/types/compania.interface';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  User,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CompaniaCardProps {
  compania: CompaniaSeguro;
  onView?: (compania: CompaniaSeguro) => void;
  onEdit?: (compania: CompaniaSeguro) => void;
  onDelete?: (compania: CompaniaSeguro) => void;
  onActivate?: (compania: CompaniaSeguro) => void;
  onDeactivate?: (compania: CompaniaSeguro) => void;
  onViewProducts?: (compania: CompaniaSeguro) => void;
}

export default function CompaniaCard({
  compania,
  onView,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onViewProducts,
}: CompaniaCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 truncate">
                {compania.nombre}
              </h3>
              {compania.razonSocial && (
                <p className="text-sm text-gray-600 truncate">
                  {compania.razonSocial}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant={compania.estaActivo ? 'default' : 'secondary'}
                  className={
                    compania.estaActivo
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700'
                  }
                >
                  {compania.estaActivo ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {compania.estaActivo ? 'Activa' : 'Inactiva'}
                </Badge>
                {compania.ruc && (
                  <Badge variant="outline" className="text-xs">
                    RUC: {compania.ruc}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onView && (
                <DropdownMenuItem onClick={() => onView(compania)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalles
                </DropdownMenuItem>
              )}
              {onViewProducts && (
                <DropdownMenuItem onClick={() => onViewProducts(compania)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Ver productos
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(compania)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              )}
              {compania.estaActivo ? (
                <>
                  {onDeactivate && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDeactivate(compania)}
                        className="text-orange-600"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Desactivar
                      </DropdownMenuItem>
                    </>
                  )}
                </>
              ) : (
                <>
                  {onActivate && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onActivate(compania)}
                        className="text-green-600"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Activar
                      </DropdownMenuItem>
                    </>
                  )}
                </>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(compania)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Información de contacto */}
        <div className="space-y-2">
          {compania.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{compania.email}</span>
            </div>
          )}
          {compania.telefono && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{compania.telefono}</span>
            </div>
          )}
          {compania.sitioWeb && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <a
                href={compania.sitioWeb}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {compania.sitioWeb.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {compania.direccion && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{compania.direccion}</span>
            </div>
          )}
        </div>

        {/* Contacto principal */}
        {compania.contactoPrincipal && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Contacto Principal
              </span>
            </div>
            <div className="ml-6 space-y-1">
              <p className="text-sm text-gray-900">
                {compania.contactoPrincipal}
              </p>
              {compania.emailContacto && (
                <p className="text-xs text-gray-600 truncate">
                  {compania.emailContacto}
                </p>
              )}
              {compania.telefonoContacto && (
                <p className="text-xs text-gray-600">
                  {compania.telefonoContacto}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Botones de acción rápida */}
        <div className="pt-3 flex gap-2">
          {onViewProducts && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewProducts(compania)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Productos
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(compania)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
