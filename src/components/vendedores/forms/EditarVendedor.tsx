"use client";

import { useVendedor, useUpdateVendedor } from '@/lib/hooks/useVendedores';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { UpdateVendedorDto } from '@/services/vendedores.service';

interface EditarVendedorProps {
  idVendedor: string;
}

interface FormData {
  telefono: string;
  porcentajeComision: number;
}

export default function EditarVendedor({ idVendedor }: EditarVendedorProps) {
  const router = useRouter();
  const { data: vendedor, isLoading, isError } = useVendedor(idVendedor);
  const updateMutation = useUpdateVendedor();

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isDirty } 
  } = useForm<FormData>({
    values: vendedor ? {
      telefono: vendedor.telefono || '',
      porcentajeComision: vendedor.porcentajeComision || 0,
    } : undefined,
  });

  const submitHandler = async (data: FormData) => {
    console.log('Submitting data:', data);
    
    // Solo enviar los campos que realmente queremos actualizar
    const updateData: UpdateVendedorDto = {};
    
    // Solo agregar teléfono si tiene valor
    if (data.telefono && data.telefono.trim() !== '') {
      updateData.telefono = data.telefono.trim();
    }
    
    // Siempre enviar porcentaje de comisión (es requerido)
    updateData.porcentajeComision = Number(data.porcentajeComision);

    await updateMutation.mutateAsync({ id: idVendedor, data: updateData });
    router.push(`/broker/vendedores/${idVendedor}`);
  };

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !vendedor) {
    return (
      <Card className="max-w-2xl mx-auto">
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Vendedor</CardTitle>
        <CardDescription>
          Actualiza la información de comisión y contacto de{' '}
          <span className="font-semibold">{vendedor.nombre} {vendedor.apellido}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          {/* Información no editable */}
          <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-muted-foreground">
              INFORMACIÓN DEL VENDEDOR (No editable)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Nombre Completo</Label>
                <p className="text-sm font-medium">{vendedor.nombre} {vendedor.apellido}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Usuario</Label>
                <p className="text-sm font-medium">{vendedor.nombreUsuario}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="text-sm font-medium">{vendedor.email}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Documento</Label>
                <p className="text-sm font-medium">{vendedor.documentoIdentidad || 'No registrado'}</p>
              </div>
            </div>
          </div>

          {/* Campos editables */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              INFORMACIÓN EDITABLE
            </h3>

            <div className="space-y-2">
              <Label htmlFor="telefono">
                Teléfono
              </Label>
              <Input
                id="telefono"
                type="tel"
                {...register('telefono', {
                  maxLength: {
                    value: 20,
                    message: 'Máximo 20 caracteres'
                  }
                })}
                className={errors.telefono ? 'border-red-500' : ''}
                placeholder="+51 999 999 999"
              />
              {errors.telefono && (
                <p className="text-sm text-red-500">{errors.telefono.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="porcentajeComision">
                Porcentaje de Comisión (%) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="porcentajeComision"
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...register('porcentajeComision', {
                  required: 'El porcentaje de comisión es requerido',
                  min: {
                    value: 0,
                    message: 'El porcentaje debe ser mayor o igual a 0'
                  },
                  max: {
                    value: 100,
                    message: 'El porcentaje debe ser menor o igual a 100'
                  },
                  valueAsNumber: true
                })}
                className={errors.porcentajeComision ? 'border-red-500' : ''}
                placeholder="15.50"
              />
              {errors.porcentajeComision && (
                <p className="text-sm text-red-500">{errors.porcentajeComision.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Porcentaje de comisión que el vendedor recibirá por sus ventas
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={updateMutation.isPending || !isDirty}
            >
              {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
