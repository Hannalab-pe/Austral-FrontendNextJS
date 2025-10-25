"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CotizacionResult {
  vehiculoBase: {
    marca: string;
    modelo: string;
    anio: number;
    precioReferencial: number;
  };
  primas: {
    primaNeta: number;
    primaTotal: number;
    iva: number;
  };
  coberturas: string[];
  deducibles: number[];
  garantiasRequeridas: string[];
  metadata: {
    primaNeta: number;
    primaComercial: number;
    tasaAplicada: number;
    valorAsegurado: number;
    fechaCotizacion?: string;
    vigenciaDesde?: string;
    vigenciaHasta?: string;
    moneda?: string;
  };
}

export default function CotizacionesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [cotizacionResult, setCotizacionResult] =
    useState<CotizacionResult | null>(null);
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    anio: "",
    precio: "",
    tipoVehiculo: "",
    usoVehiculo: "",
    ubicacion: "",
    conductorPrincipal: "",
    edadConductor: "",
    historialConducir: "",
    coberturaDeseada: "",
    deduciblePreferido: "",
    adicionales: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCotizar = async () => {
    try {
      const response = await fetch(
        "http://localhost:3002/cotizaciones/calcular",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vehiculo: {
              marca: formData.marca,
              modelo: formData.modelo,
              anio: parseInt(formData.anio),
              precio: parseFloat(formData.precio),
              tipo: formData.tipoVehiculo,
              uso: formData.usoVehiculo,
            },
            ubicacion: formData.ubicacion,
            conductor: {
              nombre: formData.conductorPrincipal,
              edad: parseInt(formData.edadConductor),
              historial: formData.historialConducir,
            },
            cobertura: {
              tipo: formData.coberturaDeseada,
              deducible: formData.deduciblePreferido,
            },
            adicionales: formData.adicionales,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al calcular la cotización");
      }

      const result = await response.json();
      const cotizacionResult: CotizacionResult = {
        vehiculoBase: result.vehiculoBase,
        primas: {
          primaNeta: result.metadata.primaNeta,
          primaTotal: result.prima,
          iva: result.prima - result.metadata.primaNeta,
        },
        coberturas: result.coberturas,
        deducibles: result.deducibles,
        garantiasRequeridas: result.garantiasRequeridas,
        metadata: result.metadata,
      };
      setCotizacionResult(cotizacionResult);

      // Cerrar modal del formulario y abrir modal de resultados
      setIsDialogOpen(false);
      setIsResultDialogOpen(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al calcular la cotización. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis Cotizaciones</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Nueva Cotización
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nueva Cotización de Seguro</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marca">Marca del Vehículo</Label>
                  <Input
                    id="marca"
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                    placeholder="Ej: Toyota"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input
                    id="modelo"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleInputChange}
                    placeholder="Ej: Corolla"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="anio">Año</Label>
                  <Input
                    id="anio"
                    name="anio"
                    type="number"
                    value={formData.anio}
                    onChange={handleInputChange}
                    placeholder="Ej: 2020"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="precio">Precio del Vehículo</Label>
                  <Input
                    id="precio"
                    name="precio"
                    type="number"
                    value={formData.precio}
                    onChange={handleInputChange}
                    placeholder="Ej: 25000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoVehiculo">Tipo de Vehículo</Label>
                  <Input
                    id="tipoVehiculo"
                    name="tipoVehiculo"
                    value={formData.tipoVehiculo}
                    onChange={handleInputChange}
                    placeholder="Ej: Automóvil"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usoVehiculo">Uso del Vehículo</Label>
                  <Input
                    id="usoVehiculo"
                    name="usoVehiculo"
                    value={formData.usoVehiculo}
                    onChange={handleInputChange}
                    placeholder="Ej: Particular"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input
                  id="ubicacion"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  placeholder="Ej: Buenos Aires, Argentina"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="conductorPrincipal">
                    Conductor Principal
                  </Label>
                  <Input
                    id="conductorPrincipal"
                    name="conductorPrincipal"
                    value={formData.conductorPrincipal}
                    onChange={handleInputChange}
                    placeholder="Nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edadConductor">Edad del Conductor</Label>
                  <Input
                    id="edadConductor"
                    name="edadConductor"
                    type="number"
                    value={formData.edadConductor}
                    onChange={handleInputChange}
                    placeholder="Ej: 30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="historialConducir">Historial de Conducir</Label>
                <Textarea
                  id="historialConducir"
                  name="historialConducir"
                  value={formData.historialConducir}
                  onChange={handleInputChange}
                  placeholder="Describe el historial de conducción..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coberturaDeseada">Cobertura Deseada</Label>
                  <Input
                    id="coberturaDeseada"
                    name="coberturaDeseada"
                    value={formData.coberturaDeseada}
                    onChange={handleInputChange}
                    placeholder="Ej: Todo Riesgo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deduciblePreferido">
                    Deducible Preferido
                  </Label>
                  <Input
                    id="deduciblePreferido"
                    name="deduciblePreferido"
                    value={formData.deduciblePreferido}
                    onChange={handleInputChange}
                    placeholder="Ej: 5%"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adicionales">Información Adicional</Label>
                <Textarea
                  id="adicionales"
                  name="adicionales"
                  value={formData.adicionales}
                  onChange={handleInputChange}
                  placeholder="Cualquier información adicional relevante..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCotizar}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Cotizar
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal de Resultados */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resultado de la Cotización</DialogTitle>
          </DialogHeader>
          {cotizacionResult && (
            <div className="space-y-6 py-4">
              {/* Vehículo Base */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vehículo Base</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Marca
                    </Label>
                    <p className="text-sm">
                      {cotizacionResult.vehiculoBase?.marca || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Modelo
                    </Label>
                    <p className="text-sm">
                      {cotizacionResult.vehiculoBase?.modelo || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Año
                    </Label>
                    <p className="text-sm">
                      {cotizacionResult.vehiculoBase?.anio || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Precio
                    </Label>
                    <p className="text-sm">
                      S/{" "}
                      {cotizacionResult.vehiculoBase?.precioReferencial
                        ? cotizacionResult.vehiculoBase.precioReferencial.toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Primas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Información de Primas
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Prima Neta
                    </Label>
                    <p className="text-sm font-semibold">
                      S/{" "}
                      {cotizacionResult.primas?.primaNeta
                        ? cotizacionResult.primas.primaNeta.toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      IVA
                    </Label>
                    <p className="text-sm">
                      S/{" "}
                      {cotizacionResult.primas?.iva
                        ? cotizacionResult.primas.iva.toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Prima Total
                    </Label>
                    <p className="text-sm font-bold text-green-600">
                      S/{" "}
                      {cotizacionResult.primas?.primaTotal
                        ? cotizacionResult.primas.primaTotal.toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Prima Total (Duplicado)
                    </Label>
                    <p className="text-sm">
                      S/{" "}
                      {cotizacionResult.primas?.primaTotal
                        ? cotizacionResult.primas.primaTotal.toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Información Adicional */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Información Adicional
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Deducible
                    </Label>
                    <p className="text-sm">N/A%</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Monto
                    </Label>
                    <p className="text-sm">S/ N/A</p>
                  </div>
                </CardContent>
              </Card>

              {/* Coberturas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-700">
                    Coberturas Incluidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Array.isArray(cotizacionResult.coberturas) &&
                      cotizacionResult.coberturas.map((cobertura, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-3 bg-green-50"
                        >
                          <p className="text-sm font-medium text-green-800">
                            {cobertura}
                          </p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Deducibles */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">
                    Deducibles Disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 flex-wrap">
                    {Array.isArray(cotizacionResult.deducibles) &&
                      cotizacionResult.deducibles.map((deducible, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-3 bg-blue-50"
                        >
                          <p className="text-sm font-medium">
                            S/ {Number(deducible).toLocaleString()}
                          </p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Garantías Requeridas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-700">
                    Garantías Requeridas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Array.isArray(cotizacionResult.garantiasRequeridas) &&
                    cotizacionResult.garantiasRequeridas.length > 0 ? (
                      cotizacionResult.garantiasRequeridas.map(
                        (garantia, index) => (
                          <div
                            key={index}
                            className="border rounded-lg p-3 bg-yellow-50"
                          >
                            <h4 className="font-medium text-yellow-800">
                              {garantia}
                            </h4>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-sm text-gray-500">
                        No hay garantías requeridas especificadas
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Información de la Cotización
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Fecha de Cotización
                    </Label>
                    <p className="text-sm">
                      {cotizacionResult.metadata?.fechaCotizacion
                        ? new Date(
                            cotizacionResult.metadata.fechaCotizacion
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Moneda
                    </Label>
                    <p className="text-sm">S/</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Vigencia Desde
                    </Label>
                    <p className="text-sm">
                      {cotizacionResult.metadata?.vigenciaDesde
                        ? new Date(
                            cotizacionResult.metadata.vigenciaDesde
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Vigencia Hasta
                    </Label>
                    <p className="text-sm">
                      {cotizacionResult.metadata?.vigenciaHasta
                        ? new Date(
                            cotizacionResult.metadata.vigenciaHasta
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsResultDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cerrar
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Guardar Cotización
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-4">
        {/* Aquí iría la lista de cotizaciones existentes */}
        <p className="text-gray-500">No hay cotizaciones guardadas aún.</p>
      </div>
    </div>
  );
}
