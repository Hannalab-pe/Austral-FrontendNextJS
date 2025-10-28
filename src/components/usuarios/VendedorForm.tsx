'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vendedorSchema, type VendedorFormData } from '@/lib/schemas/vendedor.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface VendedorFormProps {
  onSubmit: (data: VendedorFormData) => void;
  initialData?: Partial<VendedorFormData>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export default function VendedorForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
}: VendedorFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VendedorFormData>({
    resolver: zodResolver(vendedorSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: VendedorFormData) => {
    try {
      onSubmit(data);
    } catch (error) {
      toast.error('Error al procesar el formulario');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                {...register('nombre')}
                placeholder="Juan"
                disabled={isLoading}
              />
              {errors.nombre && (
                <p className="text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                {...register('apellido')}
                placeholder="Pérez"
                disabled={isLoading}
              />
              {errors.apellido && (
                <p className="text-sm text-red-600">{errors.apellido.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                {...register('telefono')}
                placeholder="+54 11 1234-5678"
                disabled={isLoading}
              />
              {errors.telefono && (
                <p className="text-sm text-red-600">{errors.telefono.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentoIdentidad">Documento de Identidad</Label>
              <Input
                id="documentoIdentidad"
                {...register('documentoIdentidad')}
                placeholder="12345678"
                disabled={isLoading}
              />
              {errors.documentoIdentidad && (
                <p className="text-sm text-red-600">{errors.documentoIdentidad.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información de Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombreUsuario">Nombre de Usuario *</Label>
              <Input
                id="nombreUsuario"
                {...register('nombreUsuario')}
                placeholder="juan_perez"
                disabled={isLoading}
              />
              {errors.nombreUsuario && (
                <p className="text-sm text-red-600">{errors.nombreUsuario.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="juan.perez@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contrasena">Contraseña *</Label>
            <div className="relative">
              <Input
                id="contrasena"
                type={showPassword ? 'text' : 'password'}
                {...register('contrasena')}
                placeholder="Contraseña segura"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.contrasena && (
              <p className="text-sm text-red-600">{errors.contrasena.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Comisión</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="porcentajeComision">Porcentaje de Comisión (%) *</Label>
            <Input
              id="porcentajeComision"
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...register('porcentajeComision', { valueAsNumber: true })}
              placeholder="15.5"
              disabled={isLoading}
            />
            {errors.porcentajeComision && (
              <p className="text-sm text-red-600">{errors.porcentajeComision.message}</p>
            )}
            <p className="text-sm text-gray-600">
              Este porcentaje se aplicará a las comisiones generadas por las ventas del vendedor.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creando Vendedor...' : 'Crear Vendedor'}
        </Button>
      </div>
    </form>
  );
}