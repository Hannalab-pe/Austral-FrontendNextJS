'use client';

import { useState } from 'react';
import { useRoles } from '@/lib/hooks/useRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Settings } from 'lucide-react';
import { Rol } from '@/types/usuario.interface';
import RolesConfiguracion from './RolesConfiguracion';

export default function ConfiguracionClient() {
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();

  if (isLoadingRoles) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
          <p className="text-gray-600">Gestiona roles, permisos y configuraciones del sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Roles */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Roles del Sistema
              </CardTitle>
              <CardDescription>
                Selecciona un rol para configurar sus permisos y vistas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {roles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay roles disponibles</p>
                </div>
              ) : (
                roles.map((rol) => (
                  <div
                    key={rol.idRol}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedRol?.idRol === rol.idRol
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRol(rol)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{rol.nombre}</h3>
                        {rol.descripcion && (
                          <p className="text-sm text-gray-600">{rol.descripcion}</p>
                        )}
                      </div>
                      <Badge variant={rol.estaActivo ? 'default' : 'secondary'}>
                        Nivel {rol.nivelAcceso}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel de Configuración */}
        <div className="lg:col-span-2">
          {selectedRol ? (
            <RolesConfiguracion rol={selectedRol} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Shield className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecciona un Rol
                </h3>
                <p className="text-gray-600 text-center">
                  Haz clic en un rol de la lista para configurar sus permisos y vistas de acceso
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}