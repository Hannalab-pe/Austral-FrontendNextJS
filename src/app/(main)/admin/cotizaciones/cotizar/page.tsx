"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLeadStore } from "@/store/leadStore";
import { CotizacionesService } from "@/services/cotizaciones.service";
import {
  DetalleSeguro,
  isDetalleSeguroVehicular,
  isDetalleSeguroSalud,
  isDetalleSeguroSCTR,
} from "@/types/api.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface CotizacionResult {
  coberturas: string[];
  deducibles: number[];
  metadata: {
    primaNeta: number;
    primaComercial: number;
    tasaAplicada: number;
    valorAsegurado: number;
  };
  garantiasRequeridas: string[];
  vehiculoBase: {
    marca: string;
    modelo: string;
    anio: number;
    precioReferencial: number;
  };
  prima: number;
  total: number;
}

export default function CotizarPage() {
  const router = useRouter();
  const { selectedLeadForQuote, clearSelectedLeadForQuote } = useLeadStore();
  const [detalleSeguro, setDetalleSeguro] = useState<DetalleSeguro | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [cotizacionData, setCotizacionData] = useState({
    tipo_seguro: "",
    datos: {
      marca: "",
      modelo: "",
      anio: 0,
      valor_vehiculo: 0,
      tipo_cobertura: "",
      zona_riesgo: "",
      antiguedad_licencia: 0,
    },
  });
  const [cotizacionResult, setCotizacionResult] =
    useState<CotizacionResult | null>(null);

  useEffect(() => {
    console.log("CotizarPage: useEffect triggered", { selectedLeadForQuote });

    if (!selectedLeadForQuote) {
      console.log("CotizarPage: No selected lead, redirecting to /leads");
      router.push("/leads");
      return;
    }

    const fetchDetalleSeguro = async () => {
      console.log(
        "CotizarPage: Fetching detalle seguro for lead:",
        selectedLeadForQuote
      );

      if (
        !selectedLeadForQuote.tipo_seguro_interes ||
        !selectedLeadForQuote.id_lead
      ) {
        const errorMsg =
          "El lead no tiene tipo de seguro de interés o ID válido";
        console.error("CotizarPage:", errorMsg, {
          tipo_seguro_interes: selectedLeadForQuote.tipo_seguro_interes,
          id_lead: selectedLeadForQuote.id_lead,
        });
        setError(errorMsg);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(
          "CotizarPage: Calling CotizacionesService.getDetalleSeguro",
          {
            tipoSeguro: selectedLeadForQuote.tipo_seguro_interes,
            leadId: selectedLeadForQuote.id_lead,
          }
        );

        const detalle = await CotizacionesService.getDetalleSeguro(
          selectedLeadForQuote.tipo_seguro_interes,
          selectedLeadForQuote.id_lead
        );

        console.log("CotizarPage: API response received:", detalle);
        setDetalleSeguro(detalle);

        // Inicializar datos de cotización
        if (isDetalleSeguroVehicular(detalle)) {
          setCotizacionData({
            tipo_seguro: "auto",
            datos: {
              marca: detalle.marca_auto,
              modelo: detalle.modelo_auto,
              anio: detalle.ano_auto,
              valor_vehiculo: 0,
              tipo_cobertura: "",
              zona_riesgo: "",
              antiguedad_licencia: 0,
            },
          });
        }
      } catch (err) {
        console.error("CotizarPage: Error fetching detalle seguro:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchDetalleSeguro();
  }, [selectedLeadForQuote, router]);

  const handleCancel = () => {
    clearSelectedLeadForQuote();
    router.push("/leads");
  };

  const handleCotizar = async () => {
    try {
      const response = await fetch("http://localhost:3002/cotizaciones/auto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marca: cotizacionData.datos.marca,
          modelo: cotizacionData.datos.modelo,
          anio: cotizacionData.datos.anio,
          valor_vehiculo: cotizacionData.datos.valor_vehiculo,
          tipo_cobertura: cotizacionData.datos.tipo_cobertura,
          zona_riesgo: cotizacionData.datos.zona_riesgo,
          antiguedad_licencia: cotizacionData.datos.antiguedad_licencia,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar la cotización");
      }

      const result = await response.json();
      console.log("Cotización enviada exitosamente:", result);
      setCotizacionResult({
        ...result,
        vehiculoBase: {
          marca: result.vehiculoBase?.marca || cotizacionData.datos.marca,
          modelo: result.vehiculoBase?.modelo || cotizacionData.datos.modelo,
          anio: result.vehiculoBase?.anio || cotizacionData.datos.anio,
          precioReferencial:
            result.vehiculoBase?.precioReferencial ||
            cotizacionData.datos.valor_vehiculo,
        },
        garantiasRequeridas: result.metadata?.garantiasRequeridas || [],
      });
      setIsDialogOpen(false); // Cerrar el modal de formulario
      setIsResultDialogOpen(true); // Abrir el modal de resultados
    } catch (error) {
      console.error("Error al cotizar:", error);
      // Aquí puedes mostrar un mensaje de error al usuario
    }
  };

  if (!selectedLeadForQuote) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-6">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Cotizar Seguro</h1>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>

        {/* Información del Lead */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Información del Lead</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label>Nombre</Label>
              <Input
                value={`${selectedLeadForQuote.nombre} ${
                  selectedLeadForQuote.apellido || ""
                }`}
                readOnly
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={selectedLeadForQuote.email || ""} readOnly />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value={selectedLeadForQuote.telefono} readOnly />
            </div>
            <div>
              <Label>Tipo de Seguro</Label>
              <Input
                value={selectedLeadForQuote.tipo_seguro_interes || ""}
                readOnly
              />
            </div>
            <div>
              <Label>Presupuesto Aproximado</Label>
              <Input
                value={
                  selectedLeadForQuote.presupuesto_aproximado
                    ? `S/ ${selectedLeadForQuote.presupuesto_aproximado}`
                    : ""
                }
                readOnly
              />
            </div>
          </CardContent>
        </Card>

        {/* Detalles del Seguro */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detalles del Seguro</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Cargando detalles del seguro...</span>
              </div>
            )}

            {error && (
              <Alert className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {detalleSeguro && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Campos específicos según el tipo de seguro */}
                {isDetalleSeguroVehicular(detalleSeguro) && (
                  <>
                    <div>
                      <Label htmlFor="marca_auto">Marca del Auto</Label>
                      <Input
                        id="marca_auto"
                        value={detalleSeguro.marca_auto}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="ano_auto">Año del Auto</Label>
                      <Input
                        id="ano_auto"
                        type="number"
                        value={detalleSeguro.ano_auto}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="modelo_auto">Modelo del Auto</Label>
                      <Input
                        id="modelo_auto"
                        value={detalleSeguro.modelo_auto}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="placa_auto">Placa del Auto</Label>
                      <Input
                        id="placa_auto"
                        value={detalleSeguro.placa_auto}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipo_uso">Tipo de Uso</Label>
                      <Input
                        id="tipo_uso"
                        value={detalleSeguro.tipo_uso}
                        readOnly
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <Label>Información del Lead Asociado</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <Label className="text-sm text-gray-600">
                            Nombre
                          </Label>
                          <Input
                            value={`${detalleSeguro.lead.nombre} ${detalleSeguro.lead.apellido}`}
                            readOnly
                            className="bg-white"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">
                            ID Lead
                          </Label>
                          <Input
                            value={detalleSeguro.lead.id_lead}
                            readOnly
                            className="bg-white"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">
                            Teléfono
                          </Label>
                          <Input
                            value={detalleSeguro.lead.telefono}
                            readOnly
                            className="bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {isDetalleSeguroSalud(detalleSeguro) && (
                  <>
                    <div>
                      <Label htmlFor="edad">Edad</Label>
                      <Input
                        id="edad"
                        type="number"
                        value={detalleSeguro.edad}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="sexo">Sexo</Label>
                      <Input id="sexo" value={detalleSeguro.sexo} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="grupo_familiar">Grupo Familiar</Label>
                      <Input
                        id="grupo_familiar"
                        value={detalleSeguro.grupo_familiar}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="estado_clinico">Estado Clínico</Label>
                      <Input
                        id="estado_clinico"
                        value={detalleSeguro.estado_clinico}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="zona_trabajo_vivienda">
                        Zona de Trabajo/Vivienda
                      </Label>
                      <Input
                        id="zona_trabajo_vivienda"
                        value={detalleSeguro.zona_trabajo_vivienda}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferencia_plan">
                        Preferencia de Plan
                      </Label>
                      <Input
                        id="preferencia_plan"
                        value={detalleSeguro.preferencia_plan}
                        readOnly
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <Label htmlFor="coberturas">Coberturas</Label>
                      <Input
                        id="coberturas"
                        value={detalleSeguro.coberturas}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="reembolso">Reembolso</Label>
                      <Input
                        id="reembolso"
                        value={detalleSeguro.reembolso ? "Sí" : "No"}
                        readOnly
                      />
                    </div>
                  </>
                )}

                {isDetalleSeguroSCTR(detalleSeguro) && (
                  <>
                    <div>
                      <Label htmlFor="razon_social">Razón Social</Label>
                      <Input
                        id="razon_social"
                        value={detalleSeguro.razon_social}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="ruc">RUC</Label>
                      <Input id="ruc" value={detalleSeguro.ruc} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="numero_trabajadores">
                        Número de Trabajadores
                      </Label>
                      <Input
                        id="numero_trabajadores"
                        type="number"
                        value={detalleSeguro.numero_trabajadores}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="monto_planilla">Monto de Planilla</Label>
                      <Input
                        id="monto_planilla"
                        type="number"
                        value={`S/ ${detalleSeguro.monto_planilla.toLocaleString()}`}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="actividad_negocio">
                        Actividad de Negocio
                      </Label>
                      <Input
                        id="actividad_negocio"
                        value={detalleSeguro.actividad_negocio}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipo_seguro">Tipo de Seguro</Label>
                      <Input
                        id="tipo_seguro"
                        value={detalleSeguro.tipo_seguro}
                        readOnly
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="fecha_creacion">Fecha de Creación</Label>
                  <Input
                    id="fecha_creacion"
                    type="datetime-local"
                    value={new Date(detalleSeguro.fecha_creacion)
                      .toISOString()
                      .slice(0, 16)}
                    readOnly
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3 flex gap-4 mt-6">
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Cotizar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Data a Enviar al Bot Cotizador</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Información del Lead */}
              <Card>
                <CardHeader>
                  <CardTitle>Información del Lead</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={`${selectedLeadForQuote.nombre} ${
                        selectedLeadForQuote.apellido || ""
                      }`}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={selectedLeadForQuote.email || ""} readOnly />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input value={selectedLeadForQuote.telefono} readOnly />
                  </div>
                  <div>
                    <Label>Tipo de Seguro</Label>
                    <Input
                      value={selectedLeadForQuote.tipo_seguro_interes || ""}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Presupuesto Aproximado</Label>
                    <Input
                      value={
                        selectedLeadForQuote.presupuesto_aproximado
                          ? `S/ ${selectedLeadForQuote.presupuesto_aproximado}`
                          : ""
                      }
                      readOnly
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Detalles del Seguro */}
              {detalleSeguro && (
                <Card>
                  <CardHeader>
                    <CardTitle>Datos para Cotización</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Campos específicos según el tipo de seguro */}
                    {isDetalleSeguroVehicular(detalleSeguro) && (
                      <>
                        <div>
                          <Label htmlFor="marca">Marca</Label>
                          <Input
                            id="marca"
                            value={cotizacionData.datos.marca}
                            onChange={(e) =>
                              setCotizacionData({
                                ...cotizacionData,
                                datos: {
                                  ...cotizacionData.datos,
                                  marca: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="modelo">Modelo</Label>
                          <Input
                            id="modelo"
                            value={cotizacionData.datos.modelo}
                            onChange={(e) =>
                              setCotizacionData({
                                ...cotizacionData,
                                datos: {
                                  ...cotizacionData.datos,
                                  modelo: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="anio">Año</Label>
                          <Input
                            id="anio"
                            type="number"
                            value={cotizacionData.datos.anio}
                            onChange={(e) =>
                              setCotizacionData({
                                ...cotizacionData,
                                datos: {
                                  ...cotizacionData.datos,
                                  anio: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="valor_vehiculo">
                            Valor del Vehículo
                          </Label>
                          <Input
                            id="valor_vehiculo"
                            type="number"
                            value={cotizacionData.datos.valor_vehiculo}
                            onChange={(e) =>
                              setCotizacionData({
                                ...cotizacionData,
                                datos: {
                                  ...cotizacionData.datos,
                                  valor_vehiculo:
                                    parseFloat(e.target.value) || 0,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="tipo_cobertura">
                            Tipo de Cobertura
                          </Label>
                          <Input
                            id="tipo_cobertura"
                            value={cotizacionData.datos.tipo_cobertura}
                            onChange={(e) =>
                              setCotizacionData({
                                ...cotizacionData,
                                datos: {
                                  ...cotizacionData.datos,
                                  tipo_cobertura: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="zona_riesgo">Zona de Riesgo</Label>
                          <Select
                            onValueChange={(value) =>
                              setCotizacionData({
                                ...cotizacionData,
                                datos: {
                                  ...cotizacionData.datos,
                                  zona_riesgo: value,
                                },
                              })
                            }
                            value={cotizacionData.datos.zona_riesgo}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccione zona de riesgo..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Baja">Baja</SelectItem>
                              <SelectItem value="Media">Media</SelectItem>
                              <SelectItem value="Alta">Alta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="antiguedad_licencia">
                            Antigüedad de Licencia (años)
                          </Label>
                          <Input
                            id="antiguedad_licencia"
                            type="number"
                            value={cotizacionData.datos.antiguedad_licencia}
                            onChange={(e) =>
                              setCotizacionData({
                                ...cotizacionData,
                                datos: {
                                  ...cotizacionData.datos,
                                  antiguedad_licencia:
                                    parseInt(e.target.value) || 0,
                                },
                              })
                            }
                          />
                        </div>
                      </>
                    )}

                    {/* Para otros tipos de seguro, puedes agregar campos similares aquí */}
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCotizar}>Cotizar</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Resultados de Cotización */}
        <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
          <DialogContent className="w-[95vw] max-w-[1600px] max-h-[90vh] overflow-y-auto p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Resultado de la Cotización
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
              {cotizacionResult && (
                <>
                  {/* Información del Vehículo Base */}
                  <Card className="h-full">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <CardTitle className="text-lg font-bold text-blue-900">
                        Vehículo Base
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Marca
                          </Label>
                          <p className="text-base font-medium text-gray-900">
                            {cotizacionResult.vehiculoBase?.marca || "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Modelo
                          </Label>
                          <p className="text-base font-medium text-gray-900">
                            {cotizacionResult.vehiculoBase?.modelo || "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Año
                          </Label>
                          <p className="text-base font-medium text-gray-900">
                            {cotizacionResult.vehiculoBase?.anio || "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Precio Referencial
                          </Label>
                          <p className="text-base font-medium text-gray-900">
                            S/{" "}
                            {cotizacionResult.vehiculoBase?.precioReferencial?.toLocaleString() ||
                              "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Información de Primas */}
                  <Card className="h-full">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                      <CardTitle className="text-lg font-bold text-green-900">
                        Información de Primas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Prima Neta
                          </Label>
                          <p className="text-xl font-bold text-green-600">
                            S/{" "}
                            {cotizacionResult.metadata?.primaNeta?.toLocaleString() ||
                              "N/A"}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Prima Comercial
                          </Label>
                          <p className="text-xl font-bold text-blue-600">
                            S/{" "}
                            {cotizacionResult.metadata?.primaComercial?.toLocaleString() ||
                              "N/A"}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Prima Total
                          </Label>
                          <p className="text-xl font-bold text-purple-600">
                            S/{" "}
                            {cotizacionResult.prima?.toLocaleString() || "N/A"}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-2 border-red-200">
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Total a Pagar
                          </Label>
                          <p className="text-2xl font-bold text-red-600">
                            S/{" "}
                            {cotizacionResult.total?.toLocaleString() || "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Información Adicional */}
                  <Card className="lg:col-span-2">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <CardTitle className="text-lg font-bold text-gray-900">
                        Información Adicional
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Tasa Aplicada
                          </Label>
                          <p className="text-lg font-medium text-gray-900">
                            {cotizacionResult.metadata?.tasaAplicada || "N/A"}%
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Valor Asegurado
                          </Label>
                          <p className="text-lg font-medium text-gray-900">
                            S/{" "}
                            {cotizacionResult.metadata?.valorAsegurado?.toLocaleString() ||
                              "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Coberturas */}
                  <Card className="h-full">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                      <CardTitle className="text-lg font-bold text-green-900">
                        Coberturas Incluidas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {cotizacionResult.coberturas?.map(
                          (cobertura: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200"
                            >
                              <span className="text-sm font-medium text-green-800">
                                {cobertura}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Deducibles */}
                  <Card className="h-full">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <CardTitle className="text-lg font-bold text-blue-900">
                        Deducibles Disponibles
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex flex-wrap gap-4">
                        {cotizacionResult.deducibles?.map(
                          (deducible: number, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-center px-6 py-4 bg-blue-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-colors"
                            >
                              <span className="text-base font-bold text-blue-800">
                                S/ {deducible.toLocaleString()}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Garantías Requeridas */}
                  <Card className="lg:col-span-2">
                    <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100">
                      <CardTitle className="text-lg font-bold text-yellow-900">
                        Garantías Requeridas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex flex-wrap gap-4">
                        {cotizacionResult.garantiasRequeridas &&
                        cotizacionResult.garantiasRequeridas.length > 0 ? (
                          cotizacionResult.garantiasRequeridas.map(
                            (garantia: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-center px-6 py-4 bg-yellow-50 rounded-lg border-2 border-yellow-300 hover:border-yellow-500 transition-colors"
                              >
                                <span className="text-base font-bold text-yellow-900">
                                  {garantia}
                                </span>
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
                </>
              )}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsResultDialogOpen(false)}
              >
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
