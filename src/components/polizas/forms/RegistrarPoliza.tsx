import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { polizaSchema, PolizaFormData, TIPOS_VIGENCIA, MONEDAS } from "@/lib/schemas/poliza.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface RegistrarPolizaProps {
  onSubmit: (data: PolizaFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  companias?: { idCompania: string; nombre: string; estaActivo: boolean }[];
}

export function RegistrarPoliza({ onSubmit, onCancel, isLoading = false, companias = [] }: RegistrarPolizaProps): JSX.Element {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PolizaFormData>({
    resolver: zodResolver(polizaSchema),
    defaultValues: {
      comision_compania: 0,
      comision_sub_agente: 0,
    },
  });

  const isLoadingCompanias = false; // Ajustar si se maneja loading externo



  return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Datos principales */}
      <Card>
        <CardHeader>
          <CardTitle>Datos de la Póliza</CardTitle>
          <CardDescription>Información general de la póliza</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contratante */}
            <div className="space-y-2">
              <Label htmlFor="contratante">Contratante</Label>
              <Input id="contratante" placeholder="Nombre del contratante" {...register("contratante")} className={errors.contratante ? "border-red-500" : ""} />
              {errors.contratante && <p className="text-sm text-red-500">{errors.contratante.message}</p>}
            </div>
            {/* Sub Agente */}
            <div className="space-y-2">
              <Label htmlFor="sub_agente">Sub Agente</Label>
              <Input id="sub_agente" placeholder="Nombre del sub agente" {...register("sub_agente")} className={errors.sub_agente ? "border-red-500" : ""} />
              {errors.sub_agente && <p className="text-sm text-red-500">{errors.sub_agente.message}</p>}
            </div>
            {/* Compañía */}
            <div className="space-y-2">
              <Label htmlFor="cia">Compañía <span className="text-red-500">*</span></Label>
              <Select onValueChange={value => setValue("cia", value)} value={watch("cia")} disabled={isLoadingCompanias}>
                <SelectTrigger className={errors.cia ? "border-red-500" : ""}>
                  <SelectValue placeholder="** Selecciona una Compañía" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCompanias ? (
                    <SelectItem value="__loading__" disabled>
                      <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Cargando compañías...</span>
                    </SelectItem>
                  ) : companias && companias.length > 0 ? (
                    companias.filter(c => c.estaActivo).map(compania => (
                      <SelectItem key={compania.idCompania} value={compania.nombre}>{compania.nombre}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="__no_options__" disabled>No hay compañías disponibles</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.cia && <p className="text-sm text-red-500">{errors.cia.message}</p>}
              {isLoadingCompanias && <p className="text-xs text-muted-foreground">Cargando compañías desde el servidor...</p>}
            </div>
            {/* Ramo */}
            <div className="space-y-2">
              <Label htmlFor="ram">Ramo <span className="text-red-500">*</span></Label>
              <Input id="ram" placeholder="Ramo del seguro" {...register("ram")} className={errors.ram ? "border-red-500" : ""} />
              {errors.ram && <p className="text-sm text-red-500">{errors.ram.message}</p>}
            </div>
            {/* Producto */}
            <div className="space-y-2">
              <Label htmlFor="prod">Producto <span className="text-red-500">*</span></Label>
              <Input id="prod" placeholder="Selecciona un producto" {...register("prod")} className={errors.prod ? "border-red-500" : ""} />
              {errors.prod && <p className="text-sm text-red-500">{errors.prod.message}</p>}
              <p className="text-xs text-muted-foreground">** Selecciona un Producto</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Comisiones */}
      <Card>
        <CardHeader>
          <CardTitle>Comisiones</CardTitle>
          <CardDescription>Porcentajes de comisión</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* % Comisión Compañía */}
            <div className="space-y-2">
              <Label htmlFor="comision_compania">% Comisión Compañía</Label>
              <Input id="comision_compania" type="number" min="0" max="100" step="0.01" {...register("comision_compania", { valueAsNumber: true })} className={errors.comision_compania ? "border-red-500" : ""} />
              {errors.comision_compania && <p className="text-sm text-red-500">{errors.comision_compania.message}</p>}
            </div>
            {/* % Comisión Sub Agente */}
            <div className="space-y-2">
              <Label htmlFor="comision_sub_agente">% Comisión Sub Agente</Label>
              <Input id="comision_sub_agente" type="number" min="0" max="100" step="0.01" {...register("comision_sub_agente", { valueAsNumber: true })} className={errors.comision_sub_agente ? "border-red-500" : ""} />
              {errors.comision_sub_agente && <p className="text-sm text-red-500">{errors.comision_sub_agente.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Vigencia y Fechas */}
      <Card>
        <CardHeader>
          <CardTitle>Vigencia y Fechas</CardTitle>
          <CardDescription>Información de vigencia de la póliza</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de Vigencia */}
            <div className="space-y-2">
              <Label htmlFor="tipo_vigencia">Tipo de Vigencia <span className="text-red-500">*</span></Label>
              <Select onValueChange={value => setValue("tipo_vigencia", value)} value={watch("tipo_vigencia") || ""}>
                <SelectTrigger className={errors.tipo_vigencia ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecciona tipo de vigencia" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_VIGENCIA.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipo_vigencia && <p className="text-sm text-red-500">{errors.tipo_vigencia.message}</p>}
            </div>
            {/* Moneda */}
            <div className="space-y-2">
              <Label htmlFor="mo">Moneda <span className="text-red-500">*</span></Label>
              <Select onValueChange={value => setValue("mo", value)} value={watch("mo") || ""}>
                <SelectTrigger className={errors.mo ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecciona moneda" />
                </SelectTrigger>
                <SelectContent>
                  {MONEDAS.map(moneda => (
                    <SelectItem key={moneda.value} value={moneda.value}>{moneda.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mo && <p className="text-sm text-red-500">{errors.mo.message}</p>}
            </div>
            {/* Vigencia Inicio */}
            <div className="space-y-2">
              <Label htmlFor="vig_inicio">Vigencia Inicio <span className="text-red-500">*</span></Label>
              <Input id="vig_inicio" type="date" {...register("vig_inicio")} className={errors.vig_inicio ? "border-red-500" : ""} />
              {errors.vig_inicio && <p className="text-sm text-red-500">{errors.vig_inicio.message}</p>}
            </div>
            {/* Vigencia Fin */}
            <div className="space-y-2">
              <Label htmlFor="vig_fin">Vigencia Fin <span className="text-red-500">*</span></Label>
              <Input id="vig_fin" type="date" {...register("vig_fin")} className={errors.vig_fin ? "border-red-500" : ""} />
              {errors.vig_fin && <p className="text-sm text-red-500">{errors.vig_fin.message}</p>}
            </div>
            {/* Fecha Emisión */}
            <div className="space-y-2">
              <Label htmlFor="fecha_emision">Fecha Emisión <span className="text-red-500">*</span></Label>
              <Input id="fecha_emision" type="date" {...register("fecha_emision")} className={errors.fecha_emision ? "border-red-500" : ""} />
              {errors.fecha_emision && <p className="text-sm text-red-500">{errors.fecha_emision.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Información Adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
          <CardDescription>Detalles y observaciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Breve descripción de lo que se asegura */}
          <div className="space-y-2">
            <Label htmlFor="descripcion_asegurado">Breve descripción de lo que se asegura</Label>
            <Textarea id="descripcion_asegurado" placeholder="Describe brevemente lo que se está asegurando" rows={3} {...register("descripcion_asegurado")} className={errors.descripcion_asegurado ? "border-red-500" : ""} />
            {errors.descripcion_asegurado && <p className="text-sm text-red-500">{errors.descripcion_asegurado.message}</p>}
          </div>
          {/* Ejecutivo de Cuenta */}
          <div className="space-y-2">
            <Label htmlFor="ejecutivo_cuenta">Ejecutivo de Cuenta</Label>
            <Input id="ejecutivo_cuenta" placeholder="Nombre del ejecutivo de cuenta" {...register("ejecutivo_cuenta")} className={errors.ejecutivo_cuenta ? "border-red-500" : ""} />
            {errors.ejecutivo_cuenta && <p className="text-sm text-red-500">{errors.ejecutivo_cuenta.message}</p>}
          </div>
          {/* Más Información */}
          <div className="space-y-2">
            <Label htmlFor="mas_informacion">Más Información</Label>
            <Textarea id="mas_informacion" placeholder="Información adicional relevante" rows={4} {...register("mas_informacion")} className={errors.mas_informacion ? "border-red-500" : ""} />
            {errors.mas_informacion && <p className="text-sm text-red-500">{errors.mas_informacion.message}</p>}
          </div>
        </CardContent>
      </Card>
      {/* Botones de acción */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancelar</Button>
        )}
        <Button type="submit" disabled={isLoading}>{isLoading ? "Guardando..." : "Registrar Póliza"}</Button>
      </div>
    </form>
  );
}
