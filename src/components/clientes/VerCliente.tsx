'use client';

import { useParams } from 'next/navigation';
import { useCliente } from '@/lib/hooks/useClientes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, Phone, Mail, MapPin, FileText, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { StaggerChildren } from '../animations/StaggerChildren';

export default function VerCliente() {
  const params = useParams();
  const clienteId = params.id as string;

  const { data: cliente, isLoading, isError, error } = useCliente(clienteId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <div className="text-gray-600">Cargando información del cliente...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">Error al cargar cliente</div>
          <div className="text-gray-600">{error?.message || 'Error desconocido'}</div>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">Cliente no encontrado</div>
          <div className="text-gray-400">El cliente solicitado no existe o no tienes permisos para verlo.</div>
        </div>
      </div>
    );
  }

  const nombreCompleto = cliente.tipoPersona === 'NATURAL'
    ? `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim()
    : cliente.razonSocial || '';

  const direccionCompleta = [
    cliente.direccion,
    cliente.distrito,
    cliente.provincia,
    cliente.departamento,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-6">
      {/* Título del cliente */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{nombreCompleto}</h1>
          <p className="text-gray-600 mt-1">Información detallada del cliente</p>
        </div>
        <Badge variant={cliente.estaActivo ? 'default' : 'secondary'} className="text-sm">
          {cliente.estaActivo ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Datos básicos del cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Tipo de Persona</label>
                  <p className="text-sm text-gray-900">
                    {cliente.tipoPersona === 'NATURAL' ? 'Persona Natural' : 'Persona Jurídica'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tipo de Documento</label>
                  <p className="text-sm text-gray-900">{cliente.tipoDocumento}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Número de Documento</label>
                  <p className="text-sm text-gray-900 font-mono">{cliente.numeroDocumento}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha de Registro</label>
                  <p className="text-sm text-gray-900">
                    {cliente.fechaRegistro
                      ? format(new Date(cliente.fechaRegistro), 'dd/MM/yyyy', { locale: es })
                      : 'No especificada'
                    }
                  </p>
                </div>
                {cliente.cumpleanos && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fecha de Nacimiento</label>
                    <p className="text-sm text-gray-900">
                      {format(cliente.cumpleanos, 'dd/MM/yyyy', { locale: es })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contactos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Información de Contacto
              </CardTitle>
              <CardDescription>
                Teléfonos, email y dirección
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Teléfono Principal</label>
                  <p className="text-sm text-gray-900">{cliente.telefono1 || 'No especificado'}</p>
                </div>
                {cliente.telefono2 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Teléfono Secundario</label>
                    <p className="text-sm text-gray-900">{cliente.telefono2}</p>
                  </div>
                )}
                {cliente.whatsapp && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">WhatsApp</label>
                    <p className="text-sm text-green-600 font-mono">{cliente.whatsapp}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Email para Notificaciones</label>
                  <p className="text-sm text-gray-900">{cliente.emailNotificaciones || 'No especificado'}</p>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Dirección
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {direccionCompleta || 'No especificada'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {cliente.recibirNotificaciones ? 'Recibe notificaciones' : 'No recibe notificaciones'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Contactos Adicionales */}
          {cliente.contactos && cliente.contactos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Contactos Adicionales
                </CardTitle>
                <CardDescription>
                  Personas de contacto asociadas al cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cliente.contactos.map((contacto) => (
                    <div key={contacto.idContacto} className="border rounded-lg p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Nombre</label>
                          <p className="text-sm text-gray-900">{contacto.nombre}</p>
                        </div>
                        {contacto.cargo && (
                          <div>
                            <label className="text-sm font-medium text-gray-600">Cargo</label>
                            <p className="text-sm text-gray-900">{contacto.cargo}</p>
                          </div>
                        )}
                        {contacto.telefono && (
                          <div>
                            <label className="text-sm font-medium text-gray-600">Teléfono</label>
                            <p className="text-sm text-gray-900">{contacto.telefono}</p>
                          </div>
                        )}
                        {contacto.correo && (
                          <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <p className="text-sm text-gray-900">{contacto.correo}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">ID del Cliente</label>
                <p className="text-xs text-gray-500 font-mono break-all">{cliente.idCliente}</p>
              </div>

              {cliente.asignadoA && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Asignado A</label>
                  <p className="text-sm text-gray-900">{cliente.asignadoANombre || cliente.asignadoA}</p>
                </div>
              )}

              {cliente.registradoPor && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Registrado Por</label>
                  <p className="text-sm text-gray-900">{cliente.registradoPorNombre || cliente.registradoPor}</p>
                </div>
              )}

              {cliente.idLead && (
                <div>
                  <label className="text-sm font-medium text-gray-600">ID del Lead</label>
                  <p className="text-xs text-gray-500 font-mono">{cliente.idLead}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {cliente.whatsapp && (
                <Button
                  variant="outline"
                  className="w-full justify-start text-green-600 border-green-300 hover:bg-green-50"
                  onClick={() => {
                    const cleanNumber = cliente.whatsapp!.replace(/[\s\-\(\)]/g, '');
                    const whatsappUrl = `https://wa.me/${cleanNumber}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contactar por WhatsApp
                </Button>
              )}

              {cliente.telefono1 && (
                <Button
                  variant="outline"
                  className="w-full justify-start text-blue-600 border-blue-300 hover:bg-blue-50"
                  onClick={() => window.open(`tel:${cliente.telefono1}`, '_blank')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar
                </Button>
              )}

              {cliente.emailNotificaciones && (
                <Button
                  variant="outline"
                  className="w-full justify-start text-orange-600 border-orange-300 hover:bg-orange-50"
                  onClick={() => window.open(`mailto:${cliente.emailNotificaciones}`, '_blank')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
              )}
            </CardContent>
          </Card>
          </div>
        </div>
    </div>
  );
}