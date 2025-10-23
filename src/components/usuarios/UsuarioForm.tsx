'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usuarioSchema, type UsuarioFormData } from '@/lib/schemas/usuario.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Rol } from '@/types/usuario.interface';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface UsuarioFormProps {
  onSubmit: (data: UsuarioFormData) => void;
  initialData?: Partial<UsuarioFormData>;
  isLoading?: boolean;
  onCancel?: () => void;
  roles: Rol[];
}

export default function UsuarioForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
  roles,
}: UsuarioFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: UsuarioFormData) => {
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
          <CardTitle>Información de Acceso</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombreUsuario">Nombre de Usuario *</Label>
            <Input
              id="nombreUsuario"
              placeholder="usuario123"
              {...register('nombreUsuario')}
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
              placeholder="usuario@ejemplo.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contrasena">Contraseña *</Label>
            <div className="relative">
              <Input
                id="contrasena"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                {...register('contrasena')}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.contrasena && (
              <p className="text-sm text-red-600">{errors.contrasena.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="idRol">Rol *</Label>
            <Controller
              name="idRol"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un rol..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.length === 0 ? (
                      <div className="px-2 py-1 text-sm text-gray-500">
                        No hay roles disponibles
                      </div>
                    ) : (
                      roles
                        .filter((rol) => rol.estaActivo)
                        .map((rol) => (
                          <SelectItem key={rol.idRol} value={rol.idRol}>
                            {rol.nombre}
                            {rol.descripcion && (
                              <span className="text-xs text-gray-500 ml-2">
                                - {rol.descripcion}
                              </span>
                            )}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.idRol && (
              <p className="text-sm text-red-600">{errors.idRol.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              placeholder="Juan"
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
              placeholder="Pérez"
              {...register('apellido')}
            />
            {errors.apellido && (
              <p className="text-sm text-red-600">{errors.apellido.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentoIdentidad">Documento de Identidad</Label>
            <Input
              id="documentoIdentidad"
              placeholder="12345678"
              {...register('documentoIdentidad')}
            />
            {errors.documentoIdentidad && (
              <p className="text-sm text-red-600">{errors.documentoIdentidad.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              placeholder="+51 999 999 999"
              {...register('telefono')}
            />
            {errors.telefono && (
              <p className="text-sm text-red-600">{errors.telefono.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información Organizacional (Opcional)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="id_asociado">ID Asociado</Label>
            <Input
              id="idAsociado"
              placeholder="UUID del asociado"
              {...register('idAsociado')}
            />
            {errors.idAsociado && (
              <p className="text-sm text-red-600">{errors.idAsociado.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Formato UUID (ej: 550e8400-e29b-41d4-a716-446655440000)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supervisor_id">ID Supervisor</Label>
            <Input
              id="supervisorId"
              placeholder="UUID del supervisor"
              {...register('supervisorId')}
            />
            {errors.supervisorId && (
              <p className="text-sm text-red-600">{errors.supervisorId.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Formato UUID (ej: 550e8400-e29b-41d4-a716-446655440000)
            </p>
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
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Usuario' : 'Registrar Usuario'}
        </Button>
      </div>
    </form>
  );
}
