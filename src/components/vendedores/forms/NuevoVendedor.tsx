"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { vendedoresService, CreateVendedorDto } from '@/services/vendedores.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FormData extends CreateVendedorDto {
  confirmarContrasena: string;
}

export const NuevoVendedor = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: (data: CreateVendedorDto) => vendedoresService.create(data),
    onSuccess: () => {
      toast.success('Vendedor creado exitosamente');
      router.push('/broker/vendedores');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear vendedor');
    },
  });

  const submitHandler = (data: FormData) => {
    const { confirmarContrasena, ...vendedorData } = data;
    createMutation.mutate(vendedorData);
  };

  const contrasena = watch('contrasena');

  return (
    <Card className="max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Nuevo Vendedor</CardTitle>
        <CardDescription>
          Complete la información del vendedor que desea registrar. Se le asignará automáticamente a su cartera.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          {/* Información de Acceso */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información de Acceso</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombreUsuario">
                  Nombre de Usuario <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombreUsuario"
                  type="text"
                  {...register('nombreUsuario', {
                    required: 'El nombre de usuario es requerido',
                    minLength: {
                      value: 3,
                      message: 'Mínimo 3 caracteres'
                    },
                    maxLength: {
                      value: 50,
                      message: 'Máximo 50 caracteres'
                    }
                  })}
                  className={errors.nombreUsuario ? 'border-red-500' : ''}
                />
                {errors.nombreUsuario && (
                  <p className="text-sm text-red-500">{errors.nombreUsuario.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contrasena">
                  Contraseña <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contrasena"
                  type="password"
                  {...register('contrasena', {
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 6,
                      message: 'Mínimo 6 caracteres'
                    }
                  })}
                  className={errors.contrasena ? 'border-red-500' : ''}
                />
                {errors.contrasena && (
                  <p className="text-sm text-red-500">{errors.contrasena.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarContrasena">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmarContrasena"
                  type="password"
                  {...register('confirmarContrasena', {
                    required: 'Debe confirmar la contraseña',
                    validate: (value) =>
                      value === contrasena || 'Las contraseñas no coinciden'
                  })}
                  className={errors.confirmarContrasena ? 'border-red-500' : ''}
                />
                {errors.confirmarContrasena && (
                  <p className="text-sm text-red-500">{errors.confirmarContrasena.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Personal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  {...register('nombre', {
                    required: 'El nombre es requerido',
                    minLength: {
                      value: 1,
                      message: 'Ingrese un nombre válido'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Máximo 100 caracteres'
                    }
                  })}
                  className={errors.nombre ? 'border-red-500' : ''}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500">{errors.nombre.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido">
                  Apellido <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="apellido"
                  type="text"
                  {...register('apellido', {
                    required: 'El apellido es requerido',
                    minLength: {
                      value: 1,
                      message: 'Ingrese un apellido válido'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Máximo 100 caracteres'
                    }
                  })}
                  className={errors.apellido ? 'border-red-500' : ''}
                />
                {errors.apellido && (
                  <p className="text-sm text-red-500">{errors.apellido.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
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
                  placeholder="+54 11 1234-5678"
                />
                {errors.telefono && (
                  <p className="text-sm text-red-500">{errors.telefono.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentoIdentidad">Documento de Identidad</Label>
                <Input
                  id="documentoIdentidad"
                  type="text"
                  {...register('documentoIdentidad', {
                    maxLength: {
                      value: 20,
                      message: 'Máximo 20 caracteres'
                    }
                  })}
                  className={errors.documentoIdentidad ? 'border-red-500' : ''}
                  placeholder="12345678"
                />
                {errors.documentoIdentidad && (
                  <p className="text-sm text-red-500">{errors.documentoIdentidad.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información de Comisión */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Comisión</h3>
            
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
              disabled={createMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Registrando...' : 'Registrar Vendedor'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

