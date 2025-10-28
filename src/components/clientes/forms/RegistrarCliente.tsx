'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { DatePicker } from '@/components/ui/date-picker';
import { ChevronLeft, ChevronRight, User, Phone, FileText, Plus, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import ConsultaDocumento from '@/components/clientes/ConsultaDocumento';
import { DatosPersona, DatosEmpresa } from '@/services/decolecta.service';
import { clientesService } from '@/services/clientes.service';
import { contactosClienteService } from '@/services/contactos-cliente.service';
import type { CreateClienteDto, CreateClienteContactoDto } from '@/types/cliente.interface';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

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

export default function RegistrarCliente() {
  const [currentStep, setCurrentStep] = useState(1);
  const [contactos, setContactos] = useState<ContactoFormData[]>([{ id: 1, nombre: '', cargo: '', telefono: '', correo: '' }]);
  const [documentos, setDocumentos] = useState([{ id: 1, tipoDocumento: '', archivo: null, descripcion: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Obtener usuario actual del store de autenticación
  const { user } = useAuthStore();

  // Estado del formulario con react-hook-form
  const { control, register, setValue, watch } = useForm<ClienteFormData>({
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

  // Estado para datos encontrados por API
  const [datosEncontrados, setDatosEncontrados] = useState<DatosPersona | DatosEmpresa | null>(null);

  // Función para manejar datos encontrados por la API
  const handleDatosEncontrados = (datos: DatosPersona | DatosEmpresa | null) => {
    setDatosEncontrados(datos);

    // Auto-llenar campos según el tipo de datos
    if (datos && 'nombres' in datos) {
      // Es una persona natural
      setValue('tipoPersona', 'NATURAL');
      setValue('nombres', datos.nombres);
      setValue('apellidos', datos.apellidos);
      if (datos.direccion) {
        setValue('direccion', datos.direccion);
      }
    } else if (datos && 'razonSocial' in datos) {
      // Es una empresa
      setValue('tipoPersona', 'JURIDICO');
      setValue('razonSocial', datos.razonSocial);
      if (datos.direccion) {
        setValue('direccion', datos.direccion);
      }
    }
  };

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

  const agregarContacto = () => {
    const nuevoId = Math.max(...contactos.map(c => c.id)) + 1;
    setContactos([...contactos, { id: nuevoId, nombre: '', cargo: '', telefono: '', correo: '' }]);
  };

  const eliminarContacto = (id: number) => {
    if (contactos.length > 1) {
      setContactos(contactos.filter(c => c.id !== id));
    }
  };

  const actualizarContacto = (id: number, campo: keyof ContactoFormData, valor: string) => {
    setContactos(contactos.map(c =>
      c.id === id ? { ...c, [campo]: valor } : c
    ));
  };

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

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Verificar que el usuario esté autenticado
      if (!user?.idUsuario) {
        throw new Error('Usuario no autenticado. Por favor, inicia sesión nuevamente.');
      }

      // Obtener valores del formulario
      const formValues = watch();

      // Validar campos requeridos
      if (!formValues.tipoPersona || !formValues.tipoDocumento || !formValues.numeroDocumento ||
          !formValues.telefono1 || !formValues.direccion) {
        throw new Error('Por favor complete todos los campos requeridos marcados con *');
      }

      // Preparar datos del cliente
      const clienteData: CreateClienteDto = {
        tipoPersona: formValues.tipoPersona as 'NATURAL' | 'JURIDICO',
        tipoDocumento: formValues.tipoDocumento,
        numeroDocumento: formValues.numeroDocumento,
        nombres: formValues.nombres || undefined,
        apellidos: formValues.apellidos || undefined,
        razonSocial: formValues.razonSocial || undefined,
        direccion: formValues.direccion,
        distrito: formValues.distrito || undefined,
        provincia: formValues.provincia || undefined,
        departamento: formValues.departamento || undefined,
        telefono1: formValues.telefono1,
        telefono2: formValues.telefono2 || undefined,
        whatsapp: formValues.whatsapp || undefined,
        emailNotificaciones: formValues.emailNotificaciones || undefined,
        recibirNotificaciones: formValues.recibirNotificaciones || false,
        cumpleanos: formValues.cumpleanos ? formValues.cumpleanos.toISOString().split('T')[0] : undefined,
        asignadoA: user.idUsuario, // Asignar automáticamente al usuario actual
      };

      // Preparar contactos adicionales si existen
      const contactosValidos = contactos.filter(c => c.nombre.trim() !== '');
      const contactosData: CreateClienteContactoDto[] = contactosValidos.map(c => ({
        nombre: c.nombre,
        cargo: c.cargo || undefined,
        telefono: c.telefono || undefined,
        correo: c.correo || undefined,
      }));

      console.log('📝 Enviando datos del cliente:', clienteData);
      console.log('📞 Contactos a crear:', contactosData);

      // Crear cliente con contactos
      const clienteCreado = await clientesService.create({
        ...clienteData,
        contactos: contactosData.length > 0 ? contactosData : undefined,
      });

      console.log('✅ Cliente creado:', clienteCreado);

      // TODO: Implementar subida de documentos cuando esté disponible

      setSubmitSuccess(true);
      toast.success('Cliente registrado exitosamente');

      // Resetear formulario después de 2 segundos
      setTimeout(() => {
        // Aquí podrías redirigir a la lista de clientes o resetear el formulario
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error('❌ Error al registrar cliente:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido al registrar cliente';
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Componente de consulta de documento */}
      <ConsultaDocumento
        tipoDocumento={watch('tipoDocumento') as 'DNI' | 'RUC'}
        numeroDocumento={watch('numeroDocumento')}
        onNumeroDocumentoChange={(numero) => setValue('numeroDocumento', numero)}
        onDatosEncontrados={handleDatosEncontrados}
      />

      {/* Indicador de datos encontrados */}
      {datosEncontrados && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Datos encontrados automáticamente
              </p>
              <p className="text-sm text-green-700">
                Los campos han sido completados con la información obtenida de la consulta.
              </p>
            </div>
          </div>
        </div>
      )}

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
                  <SelectItem value="JURIDICO">Persona Jurídica</SelectItem>
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
                  onClick={() => eliminarContacto(contacto.id)}
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
                    onChange={(e) => actualizarContacto(contacto.id, 'nombre', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`contactoCargo-${contacto.id}`}>Cargo</Label>
                  <Input
                    id={`contactoCargo-${contacto.id}`}
                    placeholder="Cargo del contacto"
                    value={contacto.cargo}
                    onChange={(e) => actualizarContacto(contacto.id, 'cargo', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`contactoTelefono-${contacto.id}`}>Teléfono</Label>
                  <Input
                    id={`contactoTelefono-${contacto.id}`}
                    placeholder="Teléfono del contacto"
                    value={contacto.telefono}
                    onChange={(e) => actualizarContacto(contacto.id, 'telefono', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`contactoCorreo-${contacto.id}`}>Correo</Label>
                  <Input
                    id={`contactoCorreo-${contacto.id}`}
                    type="email"
                    placeholder="Correo del contacto"
                    value={contacto.correo}
                    onChange={(e) => actualizarContacto(contacto.id, 'correo', e.target.value)}
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
          onClick={agregarContacto}
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
                ¡Cliente registrado exitosamente!
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
                Error al registrar cliente
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
          onClick={currentStep === STEPS.length ? onSubmit : nextStep}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Registrando...
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
