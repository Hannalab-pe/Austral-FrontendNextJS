"use client";

import { useVendedor } from '@/lib/hooks/useVendedores';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Mail, Phone, User, Calendar, Percent, IdCard } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface VerVendedorProps {
  idVendedor: string;
}

export default function VerVendedor({ idVendedor }: VerVendedorProps) {
  const { data: vendedor, isLoading, isError } = useVendedor(idVendedor);

  if (isLoading) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !vendedor) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-lg font-semibold text-destructive">Error al cargar vendedor</p>
            <p className="text-sm text-muted-foreground mt-2">
              No se pudo obtener la información del vendedor
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/broker/vendedores">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header con acciones */}
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href="/broker/vendedores">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/broker/vendedores/${idVendedor}/editar`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Vendedor
          </Link>
        </Button>
      </div>

      {/* Card principal */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                {vendedor.nombre} {vendedor.apellido}
              </CardTitle>
              <CardDescription className="mt-1">
                Información detallada del vendedor
              </CardDescription>
            </div>
            <Badge variant={vendedor.estaActivo ? "default" : "secondary"}>
              {vendedor.estaActivo ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información de Usuario */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              INFORMACIÓN DE USUARIO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usuario</p>
                  <p className="text-base">{vendedor.nombreUsuario}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{vendedor.email}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información de Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              INFORMACIÓN DE CONTACTO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                  <p className="text-base">{vendedor.telefono || 'No registrado'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IdCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Documento</p>
                  <p className="text-base">{vendedor.documentoIdentidad || 'No registrado'}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información Comercial */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              INFORMACIÓN COMERCIAL
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Percent className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Comisión</p>
                  <p className="text-base font-semibold">
                    {vendedor.porcentajeComision ? `${vendedor.porcentajeComision}%` : 'No definida'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha de Asignación</p>
                  <p className="text-base">
                    {format(new Date(vendedor.fechaAsignacion), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
