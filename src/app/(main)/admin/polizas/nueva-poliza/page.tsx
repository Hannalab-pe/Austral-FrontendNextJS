"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export default function NuevaPolizaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    poliza: "",
    asegurado: "MENDOZA GOZAR, ENRIQUE CARLOS",
    sub_agente: "ROSANA MARIA ALVAREZ CALDERON VELIZ",
    cia: "",
    ram: "",
    prod: "",
    comision_compania: 0,
    comision_sub_agente: 70,
    tipo_vigencia: "ANUAL",
    vig_inicio: "",
    vig_fin: "",
    fecha_emision: "",
    mo: "",
    descripcion_asegurado: "",
    ejecutivo_cuenta: "",
    mas_informacion: "",
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implementar envío a API
      console.log("Creando nueva póliza:", formData);

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Póliza creada exitosamente");
      router.push("/polizas");
    } catch (error) {
      console.error("Error al crear póliza:", error);
      toast.error("Error al crear la póliza");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/polizas");
  };

  return (
    <div className="w-full min-h-screen py-8 px-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-blue-900">Nueva Póliza</h1>
              <p className="text-gray-600 mt-2">
                Complete la información de la nueva póliza
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full space-y-8">
          {/* Información Básica */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Información Básica</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="poliza">
                    Póliza <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="poliza"
                    value={formData.poliza}
                    onChange={(e) =>
                      handleInputChange("poliza", e.target.value)
                    }
                    placeholder="Número de póliza"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asegurado">
                    Asegurado <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="asegurado"
                    value={formData.asegurado}
                    onChange={(e) =>
                      handleInputChange("asegurado", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub_agente">Sub Agente</Label>
                  <Input
                    id="sub_agente"
                    value={formData.sub_agente}
                    onChange={(e) =>
                      handleInputChange("sub_agente", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cia">
                    Compañía <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.cia}
                    onValueChange={(value) => handleInputChange("cia", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una Compañía" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rimac">Rimac Seguros</SelectItem>
                      <SelectItem value="pacifico">Pacífico Seguros</SelectItem>
                      <SelectItem value="mapfre">Mapfre</SelectItem>
                      <SelectItem value="positiva">La Positiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ram">
                    Ramo <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.ram}
                    onValueChange={(value) => handleInputChange("ram", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un Ramo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vehicular">Vehicular</SelectItem>
                      <SelectItem value="salud">Salud</SelectItem>
                      <SelectItem value="sctr">SCTR</SelectItem>
                      <SelectItem value="multiriesgo">Multiriesgo</SelectItem>
                      <SelectItem value="vida">Vida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prod">
                    Producto <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.prod}
                    onValueChange={(value) => handleInputChange("prod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un Producto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo-riesgo">Todo Riesgo</SelectItem>
                      <SelectItem value="responsabilidad-civil">
                        Responsabilidad Civil
                      </SelectItem>
                      <SelectItem value="plan-familiar">
                        Plan Familiar
                      </SelectItem>
                      <SelectItem value="pension">Pensión</SelectItem>
                      <SelectItem value="comercio">Comercio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comisiones */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Comisiones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="comision_compania">% Comisión Compañía</Label>
                  <Input
                    id="comision_compania"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.comision_compania}
                    onChange={(e) =>
                      handleInputChange(
                        "comision_compania",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comision_sub_agente">
                    % Comisión Sub Agente
                  </Label>
                  <Input
                    id="comision_sub_agente"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.comision_sub_agente}
                    onChange={(e) =>
                      handleInputChange(
                        "comision_sub_agente",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vigencia y Fechas */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Vigencia y Fechas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tipo_vigencia">
                    Tipo de Vigencia <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.tipo_vigencia}
                    onValueChange={(value) =>
                      handleInputChange("tipo_vigencia", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ANUAL">Anual</SelectItem>
                      <SelectItem value="SEMESTRAL">Semestral</SelectItem>
                      <SelectItem value="TRIMESTRAL">Trimestral</SelectItem>
                      <SelectItem value="MENSUAL">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vig_inicio">
                    Vigencia Inicio <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="vig_inicio"
                    type="date"
                    value={formData.vig_inicio}
                    onChange={(e) =>
                      handleInputChange("vig_inicio", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vig_fin">
                    Vigencia Fin <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="vig_fin"
                    type="date"
                    value={formData.vig_fin}
                    onChange={(e) =>
                      handleInputChange("vig_fin", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_emision">
                    Fecha Emisión <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fecha_emision"
                    type="date"
                    value={formData.fecha_emision}
                    onChange={(e) =>
                      handleInputChange("fecha_emision", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Moneda y Descripción */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Moneda y Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mo">
                    Moneda <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.mo}
                    onValueChange={(value) => handleInputChange("mo", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PEN">Soles (PEN)</SelectItem>
                      <SelectItem value="USD">Dólares (USD)</SelectItem>
                      <SelectItem value="EUR">Euros (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion_asegurado">
                    Breve descripción de lo que se asegura
                  </Label>
                  <Textarea
                    id="descripcion_asegurado"
                    value={formData.descripcion_asegurado}
                    onChange={(e) =>
                      handleInputChange("descripcion_asegurado", e.target.value)
                    }
                    placeholder="Describe brevemente lo que se asegura..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Información Adicional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ejecutivo_cuenta">Ejecutivo de Cuenta</Label>
                  <Input
                    id="ejecutivo_cuenta"
                    value={formData.ejecutivo_cuenta}
                    onChange={(e) =>
                      handleInputChange("ejecutivo_cuenta", e.target.value)
                    }
                    placeholder="Nombre del ejecutivo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mas_informacion">Más Información</Label>
                  <Textarea
                    id="mas_informacion"
                    value={formData.mas_informacion}
                    onChange={(e) =>
                      handleInputChange("mas_informacion", e.target.value)
                    }
                    placeholder="Información adicional..."
                    rows={3}
                  />
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
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-700 hover:bg-blue-800"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Crear Póliza
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
