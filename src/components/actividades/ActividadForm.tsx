'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { actividadSchema, type ActividadFormData } from '@/lib/schemas/actividad.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { TIPOS_ACTIVIDAD } from '@/types/actividad.interface';

interface ActividadFormProps {
  onSubmit: (data: ActividadFormData) => void;
  initialData?: Partial<ActividadFormData>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export default function ActividadForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
}: ActividadFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ActividadFormData>({
    resolver: zodResolver(actividadSchema),
    defaultValues: {
      tipoActividad: 'OTRO' as const,
      ...initialData,
    },
  });

  const handleFormSubmit = (data: ActividadFormData) => {
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
          <CardTitle>Información de la Actividad</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tipoActividad">Tipo de Actividad *</Label>
            <Controller
              name="tipoActividad"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TIPOS_ACTIVIDAD).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {key.charAt(0) + key.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipoActividad && (
              <p className="text-sm text-red-600">{errors.tipoActividad.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              placeholder="Título de la actividad"
              {...register('titulo')}
            />
            {errors.titulo && (
              <p className="text-sm text-red-600">{errors.titulo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaActividad">Fecha y Hora de Actividad *</Label>
            <Input
              id="fechaActividad"
              type="datetime-local"
              {...register('fechaActividad')}
            />
            {errors.fechaActividad && (
              <p className="text-sm text-red-600">{errors.fechaActividad.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="duracionMinutos">Duración (minutos)</Label>
            <Input
              id="duracionMinutos"
              type="number"
              min="1"
              max="480"
              placeholder="60"
              {...register('duracionMinutos', {
                setValueAs: (v) => {
                  if (v === '' || v === undefined || v === null) return undefined;
                  const num = parseInt(v, 10);
                  return isNaN(num) ? undefined : num;
                }
              })}
            />
            {errors.duracionMinutos && (
              <p className="text-sm text-red-600">{errors.duracionMinutos.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Descripción detallada de la actividad..."
              rows={3}
              {...register('descripcion')}
            />
            {errors.descripcion && (
              <p className="text-sm text-red-600">{errors.descripcion.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados y Seguimiento</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="resultado">Resultado</Label>
            <Textarea
              id="resultado"
              placeholder="Resultado obtenido de la actividad..."
              rows={2}
              {...register('resultado')}
            />
            {errors.resultado && (
              <p className="text-sm text-red-600">{errors.resultado.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="proximaAccion">Próxima Acción</Label>
            <Textarea
              id="proximaAccion"
              placeholder="Acciones a seguir..."
              rows={2}
              {...register('proximaAccion')}
            />
            {errors.proximaAccion && (
              <p className="text-sm text-red-600">{errors.proximaAccion.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaProximaAccion">Fecha Próxima Acción</Label>
            <Input
              id="fechaProximaAccion"
              type="datetime-local"
              {...register('fechaProximaAccion')}
            />
            {errors.fechaProximaAccion && (
              <p className="text-sm text-red-600">{errors.fechaProximaAccion.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Actividad' : 'Registrar Actividad'}
        </Button>
      </div>
    </form>
  );
}