'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadFormData } from '@/lib/schemas/lead.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { EstadoLead, FuenteLead } from '@/types/lead.interface';

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => void;
  initialData?: Partial<LeadFormData>;
  isLoading?: boolean;
  onCancel?: () => void;
  estados: EstadoLead[];
  fuentes: FuenteLead[];
}

export default function LeadForm({ 
  onSubmit, 
  initialData, 
  isLoading = false, 
  onCancel,
  estados,
  fuentes,
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema) as any,
    defaultValues: {
      puntaje_calificacion: 0,
      prioridad: 'MEDIA',
      ...initialData,
    },
  });

  const handleFormSubmit = (data: LeadFormData) => {
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
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              placeholder="Nombre del lead"
              {...register('nombre')}
            />
            {errors.nombre && (
              <p className="text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              placeholder="Apellido del lead"
              {...register('apellido')}
            />
            {errors.apellido && (
              <p className="text-sm text-red-600">{errors.apellido.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono *</Label>
            <Input
              id="telefono"
              placeholder="+51 999 999 999"
              {...register('telefono')}
            />
            {errors.telefono && (
              <p className="text-sm text-red-600">{errors.telefono.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
            <Input
              id="fecha_nacimiento"
              type="date"
              {...register('fecha_nacimiento')}
            />
            {errors.fecha_nacimiento && (
              <p className="text-sm text-red-600">{errors.fecha_nacimiento.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información del Negocio</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tipo_seguro_interes">Tipo de Seguro de Interés</Label>
            <Input
              id="tipo_seguro_interes"
              placeholder="Ej: Seguro Vehicular, Vida, etc."
              {...register('tipo_seguro_interes')}
            />
            {errors.tipo_seguro_interes && (
              <p className="text-sm text-red-600">{errors.tipo_seguro_interes.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="presupuesto_aproximado">Presupuesto Aproximado (S/)</Label>
            <Input
              id="presupuesto_aproximado"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('presupuesto_aproximado', { 
                setValueAs: (v) => v === '' ? undefined : parseFloat(v) 
              })}
            />
            {errors.presupuesto_aproximado && (
              <p className="text-sm text-red-600">{errors.presupuesto_aproximado.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="puntaje_calificacion">Puntaje de Calificación (0-100)</Label>
            <Input
              id="puntaje_calificacion"
              type="number"
              min="0"
              max="100"
              {...register('puntaje_calificacion', { 
                setValueAs: (v) => v === '' ? 0 : parseInt(v) 
              })}
            />
            {errors.puntaje_calificacion && (
              <p className="text-sm text-red-600">{errors.puntaje_calificacion.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prioridad">Prioridad *</Label>
            <Controller
              name="prioridad"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALTA">Alta</SelectItem>
                    <SelectItem value="MEDIA">Media</SelectItem>
                    <SelectItem value="BAJA">Baja</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.prioridad && (
              <p className="text-sm text-red-600">{errors.prioridad.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gestión del Lead</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="id_estado">Estado *</Label>
            <Controller
              name="id_estado"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un estado..." />
                  </SelectTrigger>
                  <SelectContent>
                    {estados
                      .filter((e) => e.esta_activo)
                      .sort((a, b) => a.orden_proceso - b.orden_proceso)
                      .map((estado) => (
                        <SelectItem key={estado.id_estado} value={estado.id_estado}>
                          {estado.nombre}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.id_estado && (
              <p className="text-sm text-red-600">{errors.id_estado.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="id_fuente">Fuente *</Label>
            <Controller
              name="id_fuente"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione una fuente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {fuentes
                      .filter((f) => f.esta_activo)
                      .map((fuente) => (
                        <SelectItem key={fuente.id_fuente} value={fuente.id_fuente}>
                          {fuente.nombre}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.id_fuente && (
              <p className="text-sm text-red-600">{errors.id_fuente.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="proxima_fecha_seguimiento">Próxima Fecha de Seguimiento</Label>
            <Input
              id="proxima_fecha_seguimiento"
              type="datetime-local"
              {...register('proxima_fecha_seguimiento')}
            />
            {errors.proxima_fecha_seguimiento && (
              <p className="text-sm text-red-600">{errors.proxima_fecha_seguimiento.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              placeholder="Agregar notas sobre el lead..."
              rows={4}
              {...register('notas')}
            />
            {errors.notas && (
              <p className="text-sm text-red-600">{errors.notas.message}</p>
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
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Lead' : 'Registrar Lead'}
        </Button>
      </div>
    </form>
  );
}
