'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Rol } from '@/types/usuario.interface';
import { useVistas, useVistasByRol, useAssignVistaToRol, useUnassignVistaFromRol } from '@/lib/hooks/useVistas';
import { toast } from 'sonner';

interface RolesConfiguracionProps {
  rol: Rol;
}

export default function RolesConfiguracion({ rol }: RolesConfiguracionProps) {
  const [loadingVista, setLoadingVista] = useState<string | null>(null);

  // Hooks para obtener vistas
  const { data: allVistas = [], isLoading: isLoadingVistas } = useVistas();
  const { data: vistasAsignadas = [], isLoading: isLoadingAsignadas } = useVistasByRol(rol.idRol);

  // Hooks para mutaciones
  const assignVistaMutation = useAssignVistaToRol();
  const unassignVistaMutation = useUnassignVistaFromRol();

  // Crear un Set con las IDs de vistas asignadas para búsqueda rápida
  const vistasAsignadasIds = new Set(vistasAsignadas.map(v => v.idVista));

  const handleToggleVista = async (vistaId: string, isChecked: boolean) => {
    try {
      setLoadingVista(vistaId);

      if (isChecked) {
        // Asignar vista al rol
        await assignVistaMutation.mutateAsync({
          idRol: rol.idRol,
          idVista: vistaId,
        });
      } else {
        // Desasignar vista del rol
        await unassignVistaMutation.mutateAsync({
          idRol: rol.idRol,
          idVista: vistaId,
        });
      }
    } catch (error) {
      // El error ya se maneja en las mutaciones
      console.error('Error al cambiar asignación de vista:', error);
    } finally {
      setLoadingVista(null);
    }
  };

  if (isLoadingVistas || isLoadingAsignadas) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Cargando configuración...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Configuración de {rol.nombre}
        </CardTitle>
        <CardDescription>
          Gestiona las vistas y permisos de acceso para el rol "{rol.nombre}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">Información del Rol</h4>
              <p className="text-sm text-gray-600">
                {rol.descripcion || 'Sin descripción'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={rol.estaActivo ? 'default' : 'secondary'}>
                {rol.estaActivo ? 'Activo' : 'Inactivo'}
              </Badge>
              <Badge variant="outline">
                Nivel {rol.nivelAcceso}
              </Badge>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-4">Vistas de Acceso</h4>
            <p className="text-sm text-gray-600 mb-4">
              Activa o desactiva las vistas a las que tendrá acceso este rol.
              Los usuarios con este rol podrán navegar a las vistas activadas.
            </p>

            {allVistas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <EyeOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay vistas disponibles para configurar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allVistas.map((vista) => {
                  const isAssigned = vistasAsignadasIds.has(vista.idVista);
                  const isLoading = loadingVista === vista.idVista;

                  return (
                    <div
                      key={vista.idVista}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium">{vista.nombre}</h5>
                          {isAssigned && (
                            <Badge variant="default" className="text-xs">
                              Asignada
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{vista.descripcion || vista.ruta}</p>
                        <p className="text-xs text-gray-500">Ruta: {vista.ruta}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isLoading && (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        )}
                        <Switch
                          id={`vista-${vista.idVista}`}
                          checked={isAssigned}
                          onCheckedChange={(checked) => handleToggleVista(vista.idVista, checked)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Vistas asignadas: {vistasAsignadas.length} de {allVistas.length}
              </span>
              <span className="text-gray-600">
                {Math.round((vistasAsignadas.length / allVistas.length) * 100)}% de acceso
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}