'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  RefreshCw,
  Filter,
  Database,
  Activity,
  Clock,
  User,
} from 'lucide-react';
import {
  useAuditoria,
  useAuditoriaStats,
} from '@/lib/hooks/useAuditoria';
import {
  AuditoriaFiltros,
  AUDITORIA_TABLAS,
} from '@/types/auditoria.interface';

export default function AuditoriaClient() {
  const [filtros, setFiltros] = useState<AuditoriaFiltros>({});
  const [showFilters, setShowFilters] = useState(false);

  // Queries
  const { data: registros = [], isLoading, refetch } = useAuditoria(filtros);
  const { data: stats } = useAuditoriaStats();

  // Handlers
  const handleFilterChange = (key: keyof AuditoriaFiltros, value: string | Date) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFiltros({});
  };

  const getAccionColor = (accion: string) => {
    switch (accion) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'LOGIN':
        return 'bg-purple-100 text-purple-800';
      case 'LOGOUT':
        return 'bg-gray-100 text-gray-800';
      case 'VIEW':
        return 'bg-cyan-100 text-cyan-800';
      case 'EXPORT':
        return 'bg-orange-100 text-orange-800';
      case 'IMPORT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFecha = (fecha: string | Date) => {
    return format(new Date(fecha), 'dd/MM/yyyy HH:mm:ss', { locale: es });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Auditoría</h1>
          <p className="text-gray-600">
            Registro de todas las actividades realizadas en el sistema
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Recargar
        </Button>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRegistros.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registros Hoy</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.registrosHoy.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acción Más Común</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.accionesMasComunes[0]?.accion || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.accionesMasComunes[0]?.count || 0} veces
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tabla Más Auditada</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.tablasMasAuditadas[0]?.tabla || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.tablasMasAuditadas[0]?.count || 0} registros
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
              <CardDescription>
                Filtra los registros de auditoría por diferentes criterios
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>
        </CardHeader>

        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tabla">Tabla</Label>
                <Select
                  value={filtros.tabla || ''}
                  onValueChange={(value) => handleFilterChange('tabla', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tabla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las tablas</SelectItem>
                    {Object.values(AUDITORIA_TABLAS).map((tabla) => (
                      <SelectItem key={tabla} value={tabla}>
                        {tabla.charAt(0).toUpperCase() + tabla.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accion">Acción</Label>
                <Select
                  value={filtros.accion || ''}
                  onValueChange={(value) => handleFilterChange('accion', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar acción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las acciones</SelectItem>
                    <SelectItem value="CREATE">Crear</SelectItem>
                    <SelectItem value="UPDATE">Actualizar</SelectItem>
                    <SelectItem value="DELETE">Eliminar</SelectItem>
                    <SelectItem value="LOGIN">Iniciar Sesión</SelectItem>
                    <SelectItem value="LOGOUT">Cerrar Sesión</SelectItem>
                    <SelectItem value="VIEW">Ver</SelectItem>
                    <SelectItem value="EXPORT">Exportar</SelectItem>
                    <SelectItem value="IMPORT">Importar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaDesde">Fecha Desde</Label>
                <Input
                  id="fechaDesde"
                  type="date"
                  value={filtros.fechaDesde ? format(new Date(filtros.fechaDesde), 'yyyy-MM-dd') : ''}
                  onChange={(e) => handleFilterChange('fechaDesde', e.target.value ? new Date(e.target.value) : '')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaHasta">Fecha Hasta</Label>
                <Input
                  id="fechaHasta"
                  type="date"
                  value={filtros.fechaHasta ? format(new Date(filtros.fechaHasta), 'yyyy-MM-dd') : ''}
                  onChange={(e) => handleFilterChange('fechaHasta', e.target.value ? new Date(e.target.value) : '')}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearFilters}>
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tabla de Registros */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Auditoría</CardTitle>
          <CardDescription>
            {registros.length} registro{registros.length !== 1 ? 's' : ''} encontrado{registros.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-gray-600">Cargando registros...</p>
              </div>
            </div>
          ) : registros.length === 0 ? (
            <div className="text-center py-12">
              <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron registros
              </h3>
              <p className="text-gray-600">
                No hay registros de auditoría que coincidan con los filtros aplicados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Tabla</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registros.map((registro) => (
                    <TableRow key={registro.idAuditoria}>
                      <TableCell className="font-mono text-sm">
                        {formatFecha(registro.fechaAccion)}
                      </TableCell>
                      <TableCell>
                        {registro.usuario ? (
                          <div>
                            <div className="font-medium">
                              {registro.usuario.nombre} {registro.usuario.apellido}
                            </div>
                            <div className="text-sm text-gray-500">
                              {registro.usuario.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Sistema</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {registro.tabla}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAccionColor(registro.accion)}>
                          {registro.accion}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}