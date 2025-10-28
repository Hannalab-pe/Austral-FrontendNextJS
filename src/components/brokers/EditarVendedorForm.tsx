'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Esquema solo para los campos editables
const editarVendedorSchema = z.object({
  nombreUsuario: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guiones bajos'),
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'Máximo 255 caracteres'),
  telefono: z
    .string()
    .min(7, 'Teléfono inválido')
    .max(20, 'Máximo 20 caracteres')
    .optional()
    .or(z.literal('')),
  porcentajeComision: z
    .number()
    .min(0, 'El porcentaje no puede ser negativo')
    .max(100, 'El porcentaje no puede ser mayor a 100'),
});

export type EditarVendedorFormData = z.infer<typeof editarVendedorSchema>;

interface EditarVendedorFormProps {
  onSubmit: (data: EditarVendedorFormData) => void;
  initialData: {
    nombreUsuario: string;
    email: string;
    telefono?: string;
    porcentajeComision: number;
    nombre: string;
    apellido: string;
    documentoIdentidad?: string;
  };
  isLoading?: boolean;
  onCancel?: () => void;
}

export default function EditarVendedorForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
}: EditarVendedorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditarVendedorFormData>({
    resolver: zodResolver(editarVendedorSchema),
    defaultValues: {
      nombreUsuario: initialData.nombreUsuario,
      email: initialData.email,
      telefono: initialData.telefono || '',
      porcentajeComision: initialData.porcentajeComision,
    },
  });

  const handleFormSubmit = (data: EditarVendedorFormData) => {
    try {
      onSubmit(data);
    } catch (error) {
      toast.error('Error al procesar el formulario');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Información Personal - Solo lectura */}
      <Card className="border-gray-200 bg-gray-50/50">
        <CardHeader>
          <CardTitle className="text-gray-700">Información Personal (No editable)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={initialData.nombre}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">Este campo no se puede modificar</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                value={initialData.apellido}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">Este campo no se puede modificar</p>
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
                value={initialData.documentoIdentidad || ''}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">Este campo no se puede modificar</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de Cuenta - Editable */}
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
        </CardContent>
      </Card>

      {/* Configuración de Comisión - Editable */}
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
          {isLoading ? 'Actualizando Vendedor...' : 'Actualizar Vendedor'}
        </Button>
      </div>
    </form>
  );
}