"use client";

import { Cliente } from "@/types/cliente.interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, IdCard, MapPin, Building } from "lucide-react";

interface ClienteInfoProps {
  cliente: Cliente;
}

export function ClienteInfo({ cliente }: ClienteInfoProps) {
  const nombreCompleto = cliente.tipoPersona === 'NATURAL'
    ? `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim()
    : cliente.razonSocial || '';

  const direccionCompleta = [
    cliente.direccion,
    cliente.distrito,
    cliente.provincia,
    cliente.departamento,
  ].filter(Boolean).join(', ');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Información del Cliente
        </CardTitle>
        <CardDescription>
          Datos generales del cliente seleccionado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre/Razón Social */}
          <div className="flex items-start gap-3">
            {cliente.tipoPersona === 'NATURAL' ? (
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            ) : (
              <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {cliente.tipoPersona === 'NATURAL' ? 'Nombre Completo' : 'Razón Social'}
              </p>
              <p className="text-base font-semibold">{nombreCompleto}</p>
              <Badge variant="secondary" className="mt-1">
                {cliente.tipoPersona === 'NATURAL' ? 'Persona Natural' : 'Persona Jurídica'}
              </Badge>
            </div>
          </div>

          {/* Documento */}
          <div className="flex items-start gap-3">
            <IdCard className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Documento</p>
              <p className="text-base font-mono">{cliente.numeroDocumento}</p>
              <p className="text-xs text-muted-foreground mt-1">{cliente.tipoDocumento}</p>
            </div>
          </div>

          {/* Email */}
          {cliente.emailNotificaciones && (
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base">{cliente.emailNotificaciones}</p>
              </div>
            </div>
          )}

          {/* Teléfono */}
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="text-base">{cliente.telefono1}</p>
              {cliente.whatsapp && (
                <p className="text-xs text-green-600 mt-1">WhatsApp: {cliente.whatsapp}</p>
              )}
            </div>
          </div>

          {/* Dirección */}
          {direccionCompleta && (
            <div className="flex items-start gap-3 md:col-span-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                <p className="text-base">{direccionCompleta}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
