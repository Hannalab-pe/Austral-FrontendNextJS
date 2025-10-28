'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { ChevronLeft, ChevronRight, User, Phone, FileText, Plus, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useCliente } from '@/lib/hooks/useClientes';
import type { Cliente, UpdateClienteDto } from '@/types/cliente.interface';

// Interfaz para el formulario
interface ClienteFormData {
  tipoPersona: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  cumpleanos: Date | undefined;
  razonSocial: string;
  telefono1: string;
  telefono2: string;
  whatsapp: string;
  emailNotificaciones: string;
  recibirNotificaciones: boolean;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
}

interface ContactoFormData {
  id: number;
  nombre: string;
  cargo: string;
  telefono: string;
  correo: string;
}

const STEPS = [
  { id: 1, title: 'Información Básica', description: 'Datos personales del cliente', icon: User },
  { id: 2, title: 'Contactos Adicionales', description: 'Información de contacto adicional (opcional)', icon: Phone },
  { id: 3, title: 'Documentos', description: 'Archivos y documentos (opcional)', icon: FileText },
];

export default function EditarCliente() {
  const params = useParams();
  const clienteId = params.id as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [contactos, setContactos] = useState<ContactoFormData[]>([{ id: 1, nombre: '', cargo: '', telefono: '', correo: '' }]);
  const [documentos, setDocumentos] = useState([{ id: 1, tipoDocumento: '', archivo: null, descripcion: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Obtener datos del cliente
  const { data: cliente, isLoading, isError, error } = useCliente(clienteId);

  // Estado del formulario con react-hook-form
  const { control, register, setValue, watch, handleSubmit } = useForm<ClienteFormData>({
    defaultValues: {
      tipoPersona: '',
      tipoDocumento: '',
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      cumpleanos: undefined,
      razonSocial: '',
      telefono1: '',
      telefono2: '',
      whatsapp: '',
      emailNotificaciones: '',
      recibirNotificaciones: false,
      direccion: '',
      distrito: '',
      provincia: '',
      departamento: '',
    },
  });

  // Cargar datos del cliente en el formulario cuando se obtengan
  useEffect(() => {
    if (cliente) {
      // Cargar datos básicos
      setValue('tipoPersona', cliente.tipoPersona || '');
      setValue('tipoDocumento', cliente.tipoDocumento || '');
      setValue('numeroDocumento', cliente.numeroDocumento || '');
      setValue('nombres', cliente.nombres || '');
      setValue('apellidos', cliente.apellidos || '');
      setValue('razonSocial', cliente.razonSocial || '');
      setValue('telefono1', cliente.telefono1 || '');
      setValue('telefono2', cliente.telefono2 || '');
      setValue('whatsapp', cliente.whatsapp || '');
      setValue('emailNotificaciones', cliente.emailNotificaciones || '');
      setValue('recibirNotificaciones', cliente.recibirNotificaciones || false);
      setValue('direccion', cliente.direccion || '');
      setValue('distrito', cliente.distrito || '');
      setValue('provincia', cliente.provincia || '');
      setValue('departamento', cliente.departamento || '');

      // Cargar fecha de nacimiento si existe
      if (cliente.cumpleanos) {
        setValue('cumpleanos', new Date(cliente.cumpleanos));
      }

      // Cargar contactos si existen
      if (cliente.contactos && cliente.contactos.length > 0) {
        const contactosData = cliente.contactos.map((contacto, index) => ({
          id: index + 1,
          nombre: contacto.nombre || '',
          cargo: contacto.cargo || '',
          telefono: contacto.telefono || '',
          correo: contacto.correo || '',
        }));
        setContactos(contactosData);
      }
    }
  }, [cliente, setValue]);

  // Función para manejar el envío del formulario
  const onSubmit = async (data: ClienteFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Aquí irá la lógica para actualizar el cliente
      // Por ahora solo mostramos que se recibió la data
      console.log('Datos del formulario:', data);
      console.log('Contactos:', contactos);

      // Simular una actualización exitosa
      setTimeout(() => {
        setSubmitSuccess(true);
        setIsSubmitting(false);
      }, 2000);

    } catch (error: any) {
      console.error('Error al actualizar cliente:', error);
      setSubmitError(error.message || 'Error al actualizar el cliente');
      setIsSubmitting(false);
    }
  };

  // Funciones para navegación entre pasos
  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Funciones para manejar contactos
  const addContacto = () => {
    const newId = Math.max(...contactos.map(c => c.id)) + 1;
    setContactos([...contactos, { id: newId, nombre: '', cargo: '', telefono: '', correo: '' }]);
  };

  const removeContacto = (id: number) => {
    if (contactos.length > 1) {
      setContactos(contactos.filter(c => c.id !== id));
    }
  };

  const updateContacto = (id: number, field: keyof ContactoFormData, value: string) => {
    setContactos(contactos.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  // Funciones para manejar documentos
  const agregarDocumento = () => {
    const nuevoId = Math.max(...documentos.map(d => d.id)) + 1;
    setDocumentos([...documentos, { id: nuevoId, tipoDocumento: '', archivo: null, descripcion: '' }]);
  };

  const eliminarDocumento = (id: number) => {
    if (documentos.length > 1) {
      setDocumentos(documentos.filter(d => d.id !== id));
    }
  };

    const actualizarDocumento = (id: number, campo: string, valor: string | File | null) => {
    setDocumentos(documentos.map(d =>
      d.id === id ? { ...d, [campo]: valor } : d
    ));
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isActive
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-center mt-2 max-w-24">
                <div className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-400 hidden sm:block">
                  {step.description}
                </div>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <div className="text-gray-600">Cargando información del cliente...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">Error al cargar cliente</div>
          <div className="text-gray-600">{error?.message || 'Error desconocido'}</div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!cliente) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">Cliente no encontrado</div>
          <div className="text-gray-400">El cliente solicitado no existe o no tienes permisos para editarlo.</div>
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de Persona */}
        <div className="space-y-2">
          <Label htmlFor="tipoPersona">Tipo de Persona *</Label>
          <Controller
            name="tipoPersona"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NATURAL">Persona Natural</SelectItem>
                  <SelectItem value="JURIDICA">Persona Jurídica</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Tipo de Documento */}
        <div className="space-y-2">
          <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
          <Controller
            name="tipoDocumento"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DNI">DNI</SelectItem>
                  <SelectItem value="CEDULA">Cédula</SelectItem>
                  <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                  <SelectItem value="RUC">RUC</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Número de Documento */}
        <div className="space-y-2">
          <Label htmlFor="numeroDocumento">Número de Documento *</Label>
          <Input
            id="numeroDocumento"
            placeholder="Ej: 12345678"
            {...register('numeroDocumento')}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setValue('numeroDocumento', value);
            }}
          />
        </div>

        {/* Teléfono Principal */}
        <div className="space-y-2">
          <Label htmlFor="telefono1">Teléfono Principal *</Label>
          <Input
            id="telefono1"
            placeholder="Ej: 925757151"
            {...register('telefono1')}
          />
        </div>

        {/* Nombres (solo para natural) */}
        <div className="space-y-2">
          <Label htmlFor="nombres">Nombres</Label>
          <Input
            id="nombres"
            placeholder="Ej: Hannah"
            {...register('nombres')}
          />
        </div>

        {/* Apellidos (solo para natural) */}
        <div className="space-y-2">
          <Label htmlFor="apellidos">Apellidos</Label>
          <Input
            id="apellidos"
            placeholder="Ej: Pérez"
            {...register('apellidos')}
          />
        </div>

        {/* Cumpleaños */}
        <div className="space-y-2">
          <Label htmlFor="cumpleanos">Cumpleaños</Label>
          <Controller
            name="cumpleanos"
            control={control}
            render={({ field }) => (
              <DatePicker
                date={field.value}
                onDateChange={field.onChange}
                placeholder="Seleccionar fecha de nacimiento"
              />
            )}
          />
        </div>

        {/* Razón Social (solo para jurídico) */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="razonSocial">Razón Social</Label>
          <Input
            id="razonSocial"
            placeholder="Ej: Mi Empresa S.A."
            {...register('razonSocial')}
          />
        </div>

        {/* Dirección */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="direccion">Dirección *</Label>
          <Textarea
            id="direccion"
            placeholder="Ej: Av. Siempre Viva 123, Lima"
            {...register('direccion')}
          />
        </div>

        {/* Distrito */}
        <div className="space-y-2">
          <Label htmlFor="distrito">Distrito</Label>
          <Input
            id="distrito"
            placeholder="Ingrese distrito"
            {...register('distrito')}
          />
        </div>

        {/* Provincia */}
        <div className="space-y-2">
          <Label htmlFor="provincia">Provincia</Label>
          <Input
            id="provincia"
            placeholder="Ingrese provincia"
            {...register('provincia')}
          />
        </div>

        {/* Departamento */}
        <div className="space-y-2">
          <Label htmlFor="departamento">Departamento</Label>
          <Input
            id="departamento"
            placeholder="Ingrese departamento"
            {...register('departamento')}
          />
        </div>

        {/* Teléfono Secundario */}
        <div className="space-y-2">
          <Label htmlFor="telefono2">Teléfono Secundario</Label>
          <Input
            id="telefono2"
            placeholder="Ingrese teléfono secundario"
            {...register('telefono2')}
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-2">
          <Label className='text-green-600' htmlFor="whatsapp">WhatsApp <span className='text-black'>(Incluya el código de país)</span></Label>
          <Input
            id="whatsapp"
            placeholder="Ej: +51 925757151"
            {...register('whatsapp')}
          />
        </div>

        {/* Email para Notificaciones */}
        <div className="space-y-2">
          <Label htmlFor="emailNotificaciones">Email para Notificaciones</Label>
          <Input
            id="emailNotificaciones"
            type="email"
            placeholder="austral@ejemplo.com"
            {...register('emailNotificaciones')}
          />
        </div>

        {/* Recibir Notificaciones */}
        <div className="space-y-2 flex items-center space-x-2">
          <Controller
            name="recibirNotificaciones"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="recibirNotificaciones"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="recibirNotificaciones">Recibir notificaciones</Label>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Badge variant="secondary" className="mb-2">Opcional</Badge>
        <p className="text-sm text-muted-foreground">
          Agrega contactos adicionales para este cliente
        </p>
      </div>

      <div className="space-y-4">
        {contactos.map((contacto, index) => (
          <Card key={contacto.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg">Contacto Adicional #{index + 1}</CardTitle>
                <CardDescription>
                  Información de una persona de contacto adicional
                </CardDescription>
              </div>
              {contactos.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeContacto(contacto.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`contactoNombre-${contacto.id}`}>Nombre *</Label>
                  <Input
                    id={`contactoNombre-${contacto.id}`}
                    placeholder="Nombre del contacto"
                    value={contacto.nombre}
                    onChange={(e) => updateContacto(contacto.id, 'nombre', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`contactoCargo-${contacto.id}`}>Cargo</Label>
                  <Input
                    id={`contactoCargo-${contacto.id}`}
                    placeholder="Cargo del contacto"
                    value={contacto.cargo}
                    onChange={(e) => updateContacto(contacto.id, 'cargo', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`contactoTelefono-${contacto.id}`}>Teléfono</Label>
                  <Input
                    id={`contactoTelefono-${contacto.id}`}
                    placeholder="Teléfono del contacto"
                    value={contacto.telefono}
                    onChange={(e) => updateContacto(contacto.id, 'telefono', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`contactoCorreo-${contacto.id}`}>Correo</Label>
                  <Input
                    id={`contactoCorreo-${contacto.id}`}
                    type="email"
                    placeholder="Correo del contacto"
                    value={contacto.correo}
                    onChange={(e) => updateContacto(contacto.id, 'correo', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={addContacto}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Otro Contacto
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Puedes agregar múltiples contactos o omitir este paso completamente
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Badge variant="secondary" className="mb-2">Opcional</Badge>
        <p className="text-sm text-muted-foreground">
          Sube documentos importantes del cliente
        </p>
      </div>

      <div className="space-y-4">
        {documentos.map((documento, index) => (
          <Card key={documento.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg">Documento #{index + 1}</CardTitle>
                <CardDescription>
                  Archivo como DNI, licencias, contratos, etc.
                </CardDescription>
              </div>
              {documentos.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => eliminarDocumento(documento.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`tipoDocumento-${documento.id}`}>Tipo de Documento *</Label>
                  <Select
                    value={documento.tipoDocumento}
                    onValueChange={(value) => actualizarDocumento(documento.id, 'tipoDocumento', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DNI">DNI</SelectItem>
                      <SelectItem value="LICENCIA">Licencia de Conducir</SelectItem>
                      <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                      <SelectItem value="RUC">RUC</SelectItem>
                      <SelectItem value="CONTRATO">Contrato</SelectItem>
                      <SelectItem value="CERTIFICADO">Certificado</SelectItem>
                      <SelectItem value="OTRO">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`documentoArchivo-${documento.id}`}>Archivo</Label>
                  <Input
                    id={`documentoArchivo-${documento.id}`}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      actualizarDocumento(documento.id, 'archivo', file);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`documentoDescripcion-${documento.id}`}>Descripción</Label>
                <Textarea
                  id={`documentoDescripcion-${documento.id}`}
                  placeholder="Descripción del documento (opcional)"
                  rows={3}
                  value={documento.descripcion}
                  onChange={(e) => actualizarDocumento(documento.id, 'descripcion', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={agregarDocumento}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Otro Documento
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Puedes agregar múltiples documentos o omitir este paso completamente
      </div>
    </div>
  );

  const watchedTipoPersona = watch('tipoPersona');

  return (
    <div className="max-w-6xl mx-auto">
      {renderStepIndicator()}

      {/* Indicador de éxito */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                ¡Cliente actualizado exitosamente!
              </p>
              <p className="text-sm text-green-700">
                Redirigiendo en unos segundos...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de error */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                Error al actualizar cliente
              </p>
              <p className="text-sm text-red-700">
                {submitError}
              </p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
          <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1 || isSubmitting}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        <Button
          onClick={currentStep === STEPS.length ? () => {} : nextStep}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Actualizando...
            </>
          ) : currentStep === STEPS.length ? (
            'Finalizar'
          ) : (
            <>
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
