'use client';

import { ProductoSeguro } from '@/types/producto.interface';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Package,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  DollarSign,
  Percent,
  Shield,
  Calendar,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProductoCardProps {
  producto: ProductoSeguro;
  onEdit?: (producto: ProductoSeguro) => void;
  onDelete?: (producto: ProductoSeguro) => void;
  onView?: (producto: ProductoSeguro) => void;
  onActivate?: (producto: ProductoSeguro) => void;
  onDeactivate?: (producto: ProductoSeguro) => void;
}

export default function ProductoCard({
  producto,
  onEdit,
  onDelete,
  onView,
  onActivate,
  onDeactivate,
}: ProductoCardProps) {
  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(value);
  };

  const formatPercentage = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return `${value}%`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`p-2 rounded-lg ${
                producto.estaActivo
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <Package className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 truncate">
                {producto.nombre}
              </h3>
              {producto.codigoProducto && (
                <p className="text-sm text-gray-500">
                  Código: {producto.codigoProducto}
                </p>
              )}
              {producto.tipoSeguro && (
                <Badge variant="outline" className="mt-1">
                  {producto.tipoSeguro.nombre}
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(producto)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalles
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(producto)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {producto.estaActivo ? (
                onDeactivate && (
                  <DropdownMenuItem onClick={() => onDeactivate(producto)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Desactivar
                  </DropdownMenuItem>
                )
              ) : (
                onActivate && (
                  <DropdownMenuItem onClick={() => onActivate(producto)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Activar
                  </DropdownMenuItem>
                )
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(producto)}
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

      <CardContent className="pb-3 space-y-3">
        {/* Descripción */}
        {producto.descripcion && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        {/* Información de Primas */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Prima Base</p>
              <p className="font-semibold text-gray-900">
                {formatCurrency(producto.primaBase)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Percent className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Comisión</p>
              <p className="font-semibold text-gray-900">
                {formatPercentage(producto.porcentajeComision)}
              </p>
            </div>
          </div>
        </div>

        {/* Rango de Primas */}
        {(producto.primaMinima || producto.primaMaxima) && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex-1">
              <p className="text-xs text-gray-500">Rango de Primas</p>
              <p className="text-sm text-gray-700">
                {formatCurrency(producto.primaMinima)} -{' '}
                {formatCurrency(producto.primaMaxima)}
              </p>
            </div>
          </div>
        )}

        {/* Cobertura Máxima */}
        {producto.coberturaMaxima && (
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Cobertura Máxima</p>
              <p className="font-semibold text-gray-900">
                {formatCurrency(producto.coberturaMaxima)}
              </p>
            </div>
          </div>
        )}

        {/* Edad */}
        {(producto.edadMinima || producto.edadMaxima) && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Rango de Edad</p>
              <p className="text-sm text-gray-700">
                {producto.edadMinima || 0} - {producto.edadMaxima || '∞'} años
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>
            {format(new Date(producto.fechaCreacion), 'dd/MM/yyyy', {
              locale: es,
            })}
          </span>
        </div>
        <Badge
          variant={producto.estaActivo ? 'default' : 'secondary'}
          className={
            producto.estaActivo
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600'
          }
        >
          {producto.estaActivo ? 'Activo' : 'Inactivo'}
        </Badge>
      </CardFooter>
    </Card>
  );
}
