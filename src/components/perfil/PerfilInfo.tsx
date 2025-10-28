"use client";

import { UserProfile } from "@/types/auth.interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, IdCard, Calendar, Shield } from "lucide-react";

interface PerfilInfoProps {
  profile: UserProfile;
}

export function PerfilInfo({ profile }: PerfilInfoProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Información del Perfil
        </CardTitle>
        <CardDescription>
          Información personal y detalles de tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nombre completo */}
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
            <p className="text-base font-semibold">
              {profile.nombre} {profile.apellido}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Correo Electrónico</p>
            <p className="text-base">{profile.email}</p>
          </div>
        </div>

        {/* Nombre de usuario */}
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Nombre de Usuario</p>
            <p className="text-base">{profile.nombreUsuario}</p>
          </div>
        </div>

        {/* Teléfono */}
        {profile.telefono && (
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="text-base">{profile.telefono}</p>
            </div>
          </div>
        )}

        {/* Documento de identidad */}
        {profile.documentoIdentidad && (
          <div className="flex items-start gap-3">
            <IdCard className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Documento de Identidad</p>
              <p className="text-base">{profile.documentoIdentidad}</p>
            </div>
          </div>
        )}

        {/* Rol */}
        {profile.rol && (
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Rol</p>
              <Badge variant="secondary" className="mt-1">
                {profile.rol.nombre}
              </Badge>
              {profile.rol.descripcion && (
                <p className="text-sm text-muted-foreground mt-1">
                  {profile.rol.descripcion}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Fecha de creación */}
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Miembro desde</p>
            <p className="text-base">{formatDate(profile.fechaCreacion)}</p>
          </div>
        </div>

        {/* Último acceso */}
        {profile.ultimoAcceso && (
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Último Acceso</p>
              <p className="text-base">{formatDate(profile.ultimoAcceso)}</p>
            </div>
          </div>
        )}

        {/* Estado */}
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 mt-0.5 flex items-center justify-center">
            <div className={`h-3 w-3 rounded-full ${profile.estaActivo ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Estado de Cuenta</p>
            <p className="text-base">
              {profile.estaActivo ? 'Activa' : 'Inactiva'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
