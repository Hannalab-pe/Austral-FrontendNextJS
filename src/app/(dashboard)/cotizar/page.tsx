"use client";

import { useState, useEffect } from "react";
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
import { useLeadStore } from "@/store/leadStore";

export default function CotizarPage() {
  const selectedLead = useLeadStore((state) => state.selectedLeadForQuote);
  const clearSelectedLeadForQuote = useLeadStore(
    (state) => state.clearSelectedLeadForQuote
  );

  const [formData, setFormData] = useState({
    id_lead: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    tipo_seguro_interes: "",
    presupuesto_aproximado: "",
    notas: "",
    puntaje_calificacion: "",
    prioridad: "",
  });

  // Prellenar formulario cuando hay un lead seleccionado
  useEffect(() => {
    if (selectedLead) {
      setFormData({
        id_lead: selectedLead.id_lead?.toString() || "",
        nombre: selectedLead.nombre || "",
        apellido: selectedLead.apellido || "",
        email: selectedLead.email || "",
        telefono: selectedLead.telefono || "",
        fecha_nacimiento: selectedLead.fecha_nacimiento
          ? new Date(selectedLead.fecha_nacimiento).toISOString().split("T")[0]
          : "",
        tipo_seguro_interes: selectedLead.tipo_seguro_interes || "",
        presupuesto_aproximado:
          selectedLead.presupuesto_aproximado?.toString() || "",
        notas: selectedLead.notas || "",
        puntaje_calificacion:
          selectedLead.puntaje_calificacion?.toString() || "",
        prioridad: selectedLead.prioridad || "",
      });
    }
  }, [selectedLead]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes enviar los datos a una API o procesarlos
    // Limpiar el lead seleccionado después de enviar
    clearSelectedLeadForQuote();
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-4xl mb-5 font-bold">Cotizar</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Primera fila: ID Lead, Nombre, Apellido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="id_lead" className="mb-2">
              ID Lead
            </Label>
            <Input
              id="id_lead"
              name="id_lead"
              value={formData.id_lead}
              onChange={handleChange}
              placeholder="ID del lead"
            />
          </div>
          <div>
            <Label htmlFor="nombre" className="mb-2">
              Nombre
            </Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
            />
          </div>
          <div>
            <Label htmlFor="apellido" className="mb-2">
              Apellido
            </Label>
            <Input
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Apellido"
            />
          </div>
        </div>

        {/* Segunda fila: Email, Teléfono, Fecha de Nacimiento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>
          <div>
            <Label htmlFor="telefono" className="mb-2">
              Teléfono
            </Label>
            <Input
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
            />
          </div>
          <div>
            <Label htmlFor="fecha_nacimiento" className="mb-2">
              Fecha de Nacimiento
            </Label>
            <Input
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              type="date"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Tercera fila: Tipo de Seguro, Presupuesto, Puntaje */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="tipo_seguro_interes" className="mb-2">
              Tipo de Seguro de Interés
            </Label>
            <Input
              id="tipo_seguro_interes"
              name="tipo_seguro_interes"
              value={formData.tipo_seguro_interes}
              onChange={handleChange}
              placeholder="Tipo de seguro"
            />
          </div>
          <div>
            <Label htmlFor="presupuesto_aproximado" className="mb-2">
              Presupuesto Aproximado
            </Label>
            <Input
              id="presupuesto_aproximado"
              name="presupuesto_aproximado"
              type="number"
              value={formData.presupuesto_aproximado}
              onChange={handleChange}
              placeholder="Presupuesto"
            />
          </div>
          <div>
            <Label htmlFor="puntaje_calificacion" className="mb-2">
              Puntaje de Calificación
            </Label>
            <Input
              id="puntaje_calificacion"
              name="puntaje_calificacion"
              type="number"
              min="0"
              max="100"
              value={formData.puntaje_calificacion}
              onChange={handleChange}
              placeholder="0-100"
            />
          </div>
        </div>

        {/* Cuarta fila: Prioridad y Notas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="prioridad" className="mb-2">
              Prioridad
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("prioridad", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALTA">Alta</SelectItem>
                <SelectItem value="MEDIA">Media</SelectItem>
                <SelectItem value="BAJA">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notas" className="mb-2">
              Notas
            </Label>
            <Textarea
              id="notas"
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              placeholder="Notas adicionales"
              className="h-24"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Enviar Cotización</Button>
        </div>
      </form>
    </div>
  );
}
