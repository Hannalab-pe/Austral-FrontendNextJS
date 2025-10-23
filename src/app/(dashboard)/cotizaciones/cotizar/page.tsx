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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function CotizarPage() {
  const router = useRouter();
  const { selectedLeadForQuote, clearSelectedLeadForQuote } = useLeadStore();
  const [detalleSeguro, setDetalleSeguro] = useState<DetalleSeguro | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      } catch (err) {
        console.error("CotizarPage: Error fetching detalle seguro:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchDetalleSeguro();
  }, [selectedLeadForQuote, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar la cotización
    console.log("Enviando cotización:", {
      lead: selectedLeadForQuote,
      detalleSeguro,
    });
  };

  const handleCancel = () => {
    clearSelectedLeadForQuote();
    router.push("/leads");
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
                    <CardTitle>Detalles del Seguro</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Campos específicos según el tipo de seguro */}
                    {isDetalleSeguroVehicular(detalleSeguro) && (
                      <>
                        <div>
                          <Label>Marca del Auto</Label>
                          <Input value={detalleSeguro.marca_auto} readOnly />
                        </div>
                        <div>
                          <Label>Año del Auto</Label>
                          <Input
                            type="number"
                            value={detalleSeguro.ano_auto}
                            readOnly
                          />
                        </div>
                        <div>
                          <Label>Modelo del Auto</Label>
                          <Input value={detalleSeguro.modelo_auto} readOnly />
                        </div>
                        <div>
                          <Label>Placa del Auto</Label>
                          <Input value={detalleSeguro.placa_auto} readOnly />
                        </div>
                        <div>
                          <Label>Tipo de Uso</Label>
                          <Input value={detalleSeguro.tipo_uso} readOnly />
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
                          <Label>Edad</Label>
                          <Input
                            type="number"
                            value={detalleSeguro.edad}
                            readOnly
                          />
                        </div>
                        <div>
                          <Label>Sexo</Label>
                          <Input value={detalleSeguro.sexo} readOnly />
                        </div>
                        <div>
                          <Label>Grupo Familiar</Label>
                          <Input
                            value={detalleSeguro.grupo_familiar}
                            readOnly
                          />
                        </div>
                        <div>
                          <Label>Estado Clínico</Label>
                          <Input
                            value={detalleSeguro.estado_clinico}
                            readOnly
                          />
                        </div>
                        <div>
                          <Label>Zona de Trabajo/Vivienda</Label>
                          <Input
                            value={detalleSeguro.zona_trabajo_vivienda}
                            readOnly
                          />
                        </div>
                        <div>
                          <Label>Preferencia de Plan</Label>
                          <Input
                            value={detalleSeguro.preferencia_plan}
                            readOnly
                          />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                          <Label>Coberturas</Label>
                          <Input value={detalleSeguro.coberturas} readOnly />
                        </div>
                        <div>
                          <Label>Reembolso</Label>
                          <Input
                            value={detalleSeguro.reembolso ? "Sí" : "No"}
                            readOnly
                          />
                        </div>
                      </>
                    )}

                    {isDetalleSeguroSCTR(detalleSeguro) && (
                      <>
                        <div>
                          <Label>Razón Social</Label>
                          <Input value={detalleSeguro.razon_social} readOnly />
                        </div>
                        <div>
                          <Label>RUC</Label>
                          <Input value={detalleSeguro.ruc} readOnly />
                        </div>
                        <div>
                          <Label>Número de Trabajadores</Label>
                          <Input
                            type="number"
                            value={detalleSeguro.numero_trabajadores}
                            readOnly
                          />
                        </div>
                        <div>
                          <Label>Monto de Planilla</Label>
                          <Input
                            type="number"
                            value={`S/ ${detalleSeguro.monto_planilla.toLocaleString()}`}
                            readOnly
                          />
                        </div>
                        <div>
                          <Label>Actividad de Negocio</Label>
                          <Input
                            value={detalleSeguro.actividad_negocio}
                            readOnly
                          />
                        </div>
                        <div>
                          <Label>Tipo de Seguro</Label>
                          <Input value={detalleSeguro.tipo_seguro} readOnly />
                        </div>
                      </>
                    )}

                    <div>
                      <Label>Fecha de Creación</Label>
                      <Input
                        type="datetime-local"
                        value={new Date(detalleSeguro.fecha_creacion)
                          .toISOString()
                          .slice(0, 16)}
                        readOnly
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                console.log("Cotizando con data:", { selectedLeadForQuote, detalleSeguro });
                // Aquí irá la lógica para enviar al bot cotizador
                setIsDialogOpen(false);
              }}>
                Cotizar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
