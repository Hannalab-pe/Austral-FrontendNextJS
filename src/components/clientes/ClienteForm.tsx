'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clienteSchema, type ClienteFormData } from '@/lib/schemas/cliente.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ClienteFormProps {
  onSubmit: (data: ClienteFormData) => void;
  initialData?: Partial<ClienteFormData>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export default function ClienteForm({ onSubmit, initialData, isLoading = false, onCancel }: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: ClienteFormData) => {
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
              placeholder="Nombre del cliente"
              {...register('nombre')}
            />
            {errors.nombre && (
              <p className="text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido *</Label>
            <Input
              id="apellido"
              placeholder="Apellido del cliente"
              {...register('apellido')}
            />
            {errors.apellido && (
              <p className="text-sm text-red-600">{errors.apellido.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_documento">Tipo de Documento *</Label>
            <Controller
              name="tipo_documento"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DNI">DNI</SelectItem>
                    <SelectItem value="CE">Carnet de Extranjería</SelectItem>
                    <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                    <SelectItem value="RUC">RUC</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipo_documento && (
              <p className="text-sm text-red-600">{errors.tipo_documento.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="documento_identidad">Número de Documento *</Label>
            <Input
              id="documento_identidad"
              placeholder="Número de documento"
              {...register('documento_identidad')}
            />
            {errors.documento_identidad && (
              <p className="text-sm text-red-600">{errors.documento_identidad.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
            <Input
              id="fecha_nacimiento"
              type="date"
              {...register('fecha_nacimiento')}
            />
            {errors.fecha_nacimiento && (
              <p className="text-sm text-red-600">{errors.fecha_nacimiento.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado_civil">Estado Civil</Label>
            <Controller
              name="estado_civil"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOLTERO">Soltero(a)</SelectItem>
                    <SelectItem value="CASADO">Casado(a)</SelectItem>
                    <SelectItem value="DIVORCIADO">Divorciado(a)</SelectItem>
                    <SelectItem value="VIUDO">Viudo(a)</SelectItem>
                    <SelectItem value="CONVIVIENTE">Conviviente</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.estado_civil && (
              <p className="text-sm text-red-600">{errors.estado_civil.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
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
            <Label htmlFor="telefono_secundario">Teléfono Secundario</Label>
            <Input
              id="telefono_secundario"
              placeholder="+51 999 999 999"
              {...register('telefono_secundario')}
            />
            {errors.telefono_secundario && (
              <p className="text-sm text-red-600">{errors.telefono_secundario.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="direccion">Dirección *</Label>
            <Textarea
              id="direccion"
              placeholder="Dirección completa"
              {...register('direccion')}
            />
            {errors.direccion && (
              <p className="text-sm text-red-600">{errors.direccion.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="distrito">Distrito</Label>
            <Input
              id="distrito"
              placeholder="Distrito"
              {...register('distrito')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provincia">Provincia</Label>
            <Input
              id="provincia"
              placeholder="Provincia"
              {...register('provincia')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="departamento">Departamento</Label>
            <Input
              id="departamento"
              placeholder="Departamento"
              {...register('departamento')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información Laboral</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ocupacion">Ocupación</Label>
            <Input
              id="ocupacion"
              placeholder="Ocupación"
              {...register('ocupacion')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa</Label>
            <Input
              id="empresa"
              placeholder="Nombre de la empresa"
              {...register('empresa')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contacto de Emergencia</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contacto_emergencia_nombre">Nombre Completo</Label>
            <Input
              id="contacto_emergencia_nombre"
              placeholder="Nombre del contacto"
              {...register('contacto_emergencia_nombre')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contacto_emergencia_telefono">Teléfono</Label>
            <Input
              id="contacto_emergencia_telefono"
              placeholder="+51 999 999 999"
              {...register('contacto_emergencia_telefono')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contacto_emergencia_relacion">Relación</Label>
            <Input
              id="contacto_emergencia_relacion"
              placeholder="Ej: Padre, Madre, Hermano, etc."
              {...register('contacto_emergencia_relacion')}
            />
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
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Cliente' : 'Registrar Cliente'}
        </Button>
      </div>
    </form>
  );
}
