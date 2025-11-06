"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { leadSchema, type LeadFormData } from "@/lib/schemas/lead.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useLeads } from "@/lib/hooks/useLeads";
import { useEstadoLeads } from "@/lib/hooks/useEstadoLeads";
import { FuentesLeadService } from "@/services/fuentes-lead.service";
import { UpdateLeadDto, Lead } from "@/types/lead.interface";

interface LeadFormEditProps {
  lead: Lead;
}

export default function LeadFormEdit({ lead }: LeadFormEditProps) {
  const router = useRouter();

  // ==========================================
  // HOOKS - Gestión de datos
  // ==========================================

  const { updateLead, isUpdating } = useLeads();
  const { estadosLead, isLoading: isLoadingEstados } = useEstadoLeads();
  const { data: fuentes, isLoading: isLoadingFuentes } = FuentesLeadService.useGetAll();

  // ==========================================
  // FORM - React Hook Form con datos iniciales del lead
  // ==========================================

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema) as any,
    defaultValues: {
      nombre: lead.nombre,
      apellido: lead.apellido || "",
      email: lead.email || "",
      telefono: lead.telefono,
      fecha_nacimiento: lead.fecha_nacimiento || "",
      tipo_seguro_interes: lead.tipo_seguro_interes || "",
      presupuesto_aproximado: lead.presupuesto_aproximado,
      notas: lead.notas || "",
      puntaje_calificacion: lead.puntaje_calificacion || 0,
      prioridad: lead.prioridad,
      proxima_fecha_seguimiento: lead.proxima_fecha_seguimiento || "",
      id_estado: lead.id_estado,
      id_fuente: lead.id_fuente,
      asignado_a_usuario: lead.asignado_a_usuario || "",
    },
  });

  // ==========================================
  // HANDLERS - Manejadores de eventos
  // ==========================================

  const handleFormSubmit: SubmitHandler<LeadFormData> = async (data) => {
    // Construir el DTO para actualizar el lead
    const updateData: UpdateLeadDto = {
      id_lead: lead.id_lead,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      telefono: data.telefono,
      fecha_nacimiento: data.fecha_nacimiento,
      tipo_seguro_interes: data.tipo_seguro_interes,
      presupuesto_aproximado: data.presupuesto_aproximado,
      notas: data.notas,
      puntaje_calificacion: data.puntaje_calificacion || 0,
      prioridad: data.prioridad,
      proxima_fecha_seguimiento: data.proxima_fecha_seguimiento,
      id_estado: data.id_estado,
      id_fuente: data.id_fuente,
      asignado_a_usuario: data.asignado_a_usuario,
    };

    try {
      await updateLead(updateData);
      
      // Redirigir al detalle del lead después de actualizar
      setTimeout(() => {
        router.push(`/admin/leads/${lead.id_lead}`);
      }, 1000);
    } catch (error) {
      // El error ya fue manejado por el hook con toast
      console.error("Error updating lead:", error);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/leads/${lead.id_lead}`);
  };

  // ==========================================
  // RENDER - Estados de carga
  // ==========================================

  const isLoading = isLoadingEstados || isLoadingFuentes;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER - Formulario
  // ==========================================

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full space-y-8"
    >
      {/* Información Personal */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                placeholder="Nombre del lead"
                {...register("nombre")}
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
                {...register("apellido")}
              />
              {errors.apellido && (
                <p className="text-sm text-red-600">
                  {errors.apellido.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                {...register("email")}
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
                {...register("telefono")}
              />
              {errors.telefono && (
                <p className="text-sm text-red-600">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
              <Input
                id="fecha_nacimiento"
                type="date"
                {...register("fecha_nacimiento")}
              />
              {errors.fecha_nacimiento && (
                <p className="text-sm text-red-600">
                  {errors.fecha_nacimiento.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información del Negocio */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Información del Negocio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tipo_seguro_interes">
                Tipo de Seguro de Interés
              </Label>
              <Input
                id="tipo_seguro_interes"
                placeholder="Ej: Seguro Vehicular, Vida, etc."
                {...register("tipo_seguro_interes")}
              />
              {errors.tipo_seguro_interes && (
                <p className="text-sm text-red-600">
                  {errors.tipo_seguro_interes.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="presupuesto_aproximado">
                Presupuesto Aproximado (S/)
              </Label>
              <Input
                id="presupuesto_aproximado"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("presupuesto_aproximado", {
                  setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                })}
              />
              {errors.presupuesto_aproximado && (
                <p className="text-sm text-red-600">
                  {errors.presupuesto_aproximado.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="puntaje_calificacion">
                Puntaje de Calificación (0-100)
              </Label>
              <Input
                id="puntaje_calificacion"
                type="number"
                min="0"
                max="100"
                {...register("puntaje_calificacion", {
                  setValueAs: (v) => (v === "" ? 0 : parseInt(v)),
                })}
              />
              {errors.puntaje_calificacion && (
                <p className="text-sm text-red-600">
                  {errors.puntaje_calificacion.message}
                </p>
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
                <p className="text-sm text-red-600">
                  {errors.prioridad.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestión del Lead */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Gestión del Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      {estadosLead
                        ?.filter((e) => e.esta_activo)
                        .sort((a, b) => a.orden_proceso - b.orden_proceso)
                        .map((estado) => (
                          <SelectItem
                            key={estado.id_estado}
                            value={estado.id_estado}
                          >
                            {estado.nombre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.id_estado && (
                <p className="text-sm text-red-600">
                  {errors.id_estado.message}
                </p>
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
                        ?.filter((f) => f.esta_activo)
                        .map((fuente) => (
                          <SelectItem
                            key={fuente.id_fuente}
                            value={fuente.id_fuente}
                          >
                            {fuente.nombre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.id_fuente && (
                <p className="text-sm text-red-600">
                  {errors.id_fuente.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="proxima_fecha_seguimiento">
                Próxima Fecha de Seguimiento
              </Label>
              <Input
                id="proxima_fecha_seguimiento"
                type="datetime-local"
                {...register("proxima_fecha_seguimiento")}
              />
              {errors.proxima_fecha_seguimiento && (
                <p className="text-sm text-red-600">
                  {errors.proxima_fecha_seguimiento.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                placeholder="Agregar notas sobre el lead..."
                rows={4}
                {...register("notas")}
              />
              {errors.notas && (
                <p className="text-sm text-red-600">{errors.notas.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isUpdating}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isUpdating}
          className="bg-blue-700 hover:bg-blue-800"
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Actualizando...
            </>
          ) : (
            "Actualizar Lead"
          )}
        </Button>
      </div>
    </form>
  );
}
