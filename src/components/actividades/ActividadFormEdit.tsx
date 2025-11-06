'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { actividadSchema, type ActividadFormData } from '@/lib/schemas/actividad.schema';
import { useActividades } from '@/lib/hooks/useActividades';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TIPOS_ACTIVIDAD, type Actividad, type TipoActividad } from '@/types/actividad.interface';

interface ActividadFormEditProps {
  actividad: Actividad;
}

export default function ActividadFormEdit({ actividad }: ActividadFormEditProps) {
  const router = useRouter();
  const { updateActividad, isUpdating } = useActividades();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ActividadFormData>({
    resolver: zodResolver(actividadSchema),
    defaultValues: {
      tipoActividad: actividad.tipoActividad as TipoActividad,
      titulo: actividad.titulo,
      fechaActividad: actividad.fechaActividad 
        ? new Date(actividad.fechaActividad).toISOString().slice(0, 16) 
        : '',
      duracionMinutos: actividad.duracionMinutos,
      descripcion: actividad.descripcion || '',
      resultado: actividad.resultado || '',
      proximaAccion: actividad.proximaAccion || '',
      fechaProximaAccion: actividad.fechaProximaAccion 
        ? new Date(actividad.fechaProximaAccion).toISOString().slice(0, 16) 
        : '',
    },
  });

  const handleFormSubmit = async (data: ActividadFormData) => {
    try {
      await updateActividad({
        idActividad: actividad.idActividad,
        tipoActividad: data.tipoActividad,
        titulo: data.titulo,
        fechaActividad: new Date(data.fechaActividad).toISOString(),
        duracionMinutos: data.duracionMinutos,
        descripcion: data.descripcion,
        resultado: data.resultado,
        proximaAccion: data.proximaAccion,
        fechaProximaAccion: data.fechaProximaAccion 
          ? new Date(data.fechaProximaAccion).toISOString() 
          : undefined,
      });

      // Redirigir al calendario después de actualizar
      router.push('/admin/actividades');
    } catch (error) {
      // El error ya se maneja en el hook
      console.error('Error al actualizar actividad:', error);
    }
  };

  const handleCancel = () => {
    router.push('/admin/actividades');
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
        <Button type="button" variant="outline" onClick={handleCancel} disabled={isUpdating}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Actualizando...' : 'Actualizar Actividad'}
        </Button>
      </div>
    </form>
  );
}
