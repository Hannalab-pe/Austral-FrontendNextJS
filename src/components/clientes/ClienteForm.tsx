'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  createClienteSchema, 
  type CreateClienteFormData,
  TIPOS_DOCUMENTO,
  ESTADOS_CIVILES,
  formatClienteForApi
} from '@/lib/schemas/cliente.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ClienteFormProps {
  onSubmit: (data: CreateClienteFormData) => void;
  initialData?: Partial<CreateClienteFormData>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export default function ClienteForm({ 
  onSubmit, 
  initialData, 
  isLoading = false, 
  onCancel 
}: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateClienteFormData>({
    resolver: zodResolver(createClienteSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: CreateClienteFormData) => {
    try {
      const formattedData = formatClienteForApi(data);
      onSubmit(formattedData as CreateClienteFormData);
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
              placeholder="Apellido del cliente"
              {...register('apellido')}
              disabled={isLoading}
            />
            {errors.apellido && (
              <p className="text-sm text-red-600">{errors.apellido.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
            <Controller
              name="tipoDocumento"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_DOCUMENTO.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipoDocumento && (
              <p className="text-sm text-red-600">{errors.tipoDocumento.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentoIdentidad">Número de Documento *</Label>
            <Input
              id="documentoIdentidad"
              placeholder="Número de documento"
              {...register('documentoIdentidad')}
              disabled={isLoading}
            />
            {errors.documentoIdentidad && (
              <p className="text-sm text-red-600">{errors.documentoIdentidad.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
            <Input
              id="fechaNacimiento"
              type="date"
              {...register('fechaNacimiento')}
              disabled={isLoading}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.fechaNacimiento && (
              <p className="text-sm text-red-600">{errors.fechaNacimiento.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estadoCivil">Estado Civil</Label>
            <Controller
              name="estadoCivil"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS_CIVILES.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.estadoCivil && (
              <p className="text-sm text-red-600">{errors.estadoCivil.message}</p>
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
            {errors.telefono && (
              <p className="text-sm text-red-600">{errors.telefono.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefonoSecundario">Teléfono Secundario</Label>
            <Input
              id="telefonoSecundario"
              placeholder="+51 999 999 999"
              {...register('telefonoSecundario')}
              disabled={isLoading}
            />
            {errors.telefonoSecundario && (
              <p className="text-sm text-red-600">{errors.telefonoSecundario.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="direccion">Dirección *</Label>
            <Textarea
              id="direccion"
              placeholder="Dirección completa"
              {...register('direccion')}
              disabled={isLoading}
              rows={2}
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
              disabled={isLoading}
            />
            {errors.distrito && (
              <p className="text-sm text-red-600">{errors.distrito.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="provincia">Provincia</Label>
            <Input
              id="provincia"
              placeholder="Provincia"
              {...register('provincia')}
              disabled={isLoading}
            />
            {errors.provincia && (
              <p className="text-sm text-red-600">{errors.provincia.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="departamento">Departamento</Label>
            <Input
              id="departamento"
              placeholder="Departamento"
              {...register('departamento')}
              disabled={isLoading}
            />
            {errors.departamento && (
              <p className="text-sm text-red-600">{errors.departamento.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información Laboral (Opcional)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ocupacion">Ocupación</Label>
            <Input
              id="ocupacion"
              placeholder="Ocupación"
              {...register('ocupacion')}
              disabled={isLoading}
            />
            {errors.ocupacion && (
              <p className="text-sm text-red-600">{errors.ocupacion.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa</Label>
            <Input
              id="empresa"
              placeholder="Nombre de la empresa"
              {...register('empresa')}
              disabled={isLoading}
            />
            {errors.empresa && (
              <p className="text-sm text-red-600">{errors.empresa.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contacto de Emergencia (Opcional)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactoEmergenciaNombre">Nombre Completo</Label>
            <Input
              id="contactoEmergenciaNombre"
              placeholder="Nombre del contacto"
              {...register('contactoEmergenciaNombre')}
              disabled={isLoading}
            />
            {errors.contactoEmergenciaNombre && (
              <p className="text-sm text-red-600">{errors.contactoEmergenciaNombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactoEmergenciaTelefono">Teléfono</Label>
            <Input
              id="contactoEmergenciaTelefono"
              placeholder="+51 999 999 999"
              {...register('contactoEmergenciaTelefono')}
              disabled={isLoading}
            />
            {errors.contactoEmergenciaTelefono && (
              <p className="text-sm text-red-600">{errors.contactoEmergenciaTelefono.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactoEmergenciaRelacion">Relación</Label>
            <Input
              id="contactoEmergenciaRelacion"
              placeholder="Ej: Padre, Madre, Hermano"
              {...register('contactoEmergenciaRelacion')}
              disabled={isLoading}
            />
            {errors.contactoEmergenciaRelacion && (
              <p className="text-sm text-red-600">{errors.contactoEmergenciaRelacion.message}</p>
            )}
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
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Cliente' : 'Registrar Cliente'}
        </Button>
      </div>
    </form>
  );
}
