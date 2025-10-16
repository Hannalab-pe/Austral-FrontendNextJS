'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  companiaSchema,
  type CompaniaFormData,
} from '@/lib/schemas/compania.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  User,
  FileText,
} from 'lucide-react';

interface CompaniaFormProps {
  onSubmit: (data: CompaniaFormData) => void;
  initialData?: Partial<CompaniaFormData>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export default function CompaniaForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
}: CompaniaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompaniaFormData>({
    resolver: zodResolver(companiaSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: CompaniaFormData) => {
    try {
      onSubmit(data);
    } catch (error) {
      toast.error('Error al procesar el formulario');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Información de la Compañía */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información de la Compañía
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="nombre">
              Nombre Comercial <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              placeholder="Ej: Rímac Seguros"
              {...register('nombre')}
            />
            {errors.nombre && (
              <p className="text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="razonSocial">Razón Social</Label>
            <Input
              id="razonSocial"
              placeholder="Ej: Rímac Seguros y Reaseguros S.A."
              {...register('razonSocial')}
            />
            {errors.razonSocial && (
              <p className="text-sm text-red-600">
                {errors.razonSocial.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ruc">RUC</Label>
            <Input
              id="ruc"
              placeholder="Ej: 20100041953"
              maxLength={20}
              {...register('ruc')}
            />
            {errors.ruc && (
              <p className="text-sm text-red-600">{errors.ruc.message}</p>
            )}
            <p className="text-xs text-gray-500">Solo números</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="telefono"
                placeholder="Ej: +51 1 411 1111"
                className="pl-10"
                {...register('telefono')}
              />
            </div>
            {errors.telefono && (
              <p className="text-sm text-red-600">{errors.telefono.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Corporativo</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Ej: contacto@rimac.com.pe"
                className="pl-10"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sitioWeb">Sitio Web</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="sitioWeb"
                type="url"
                placeholder="Ej: https://www.rimac.com.pe"
                className="pl-10"
                {...register('sitioWeb')}
              />
            </div>
            {errors.sitioWeb && (
              <p className="text-sm text-red-600">{errors.sitioWeb.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="direccion">Dirección</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="direccion"
                placeholder="Ej: Av. Benavides 1555, Miraflores, Lima"
                className="pl-10 min-h-20"
                {...register('direccion')}
              />
            </div>
            {errors.direccion && (
              <p className="text-sm text-red-600">{errors.direccion.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contacto Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contacto Principal
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="contactoPrincipal">Nombre del Contacto</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="contactoPrincipal"
                placeholder="Ej: Juan Pérez"
                className="pl-10"
                {...register('contactoPrincipal')}
              />
            </div>
            {errors.contactoPrincipal && (
              <p className="text-sm text-red-600">
                {errors.contactoPrincipal.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefonoContacto">Teléfono del Contacto</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="telefonoContacto"
                placeholder="Ej: +51 987 654 321"
                className="pl-10"
                {...register('telefonoContacto')}
              />
            </div>
            {errors.telefonoContacto && (
              <p className="text-sm text-red-600">
                {errors.telefonoContacto.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailContacto">Email del Contacto</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="emailContacto"
                type="email"
                placeholder="Ej: juan.perez@rimac.com.pe"
                className="pl-10"
                {...register('emailContacto')}
              />
            </div>
            {errors.emailContacto && (
              <p className="text-sm text-red-600">
                {errors.emailContacto.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
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
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Guardar Compañía
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
