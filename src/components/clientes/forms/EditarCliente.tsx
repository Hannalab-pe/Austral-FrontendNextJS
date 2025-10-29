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
import { ChevronLeft, ChevronRight, User, Phone, FileText, Plus, Trash2, Loader2, CheckCircle, AlertCircle, Check } from 'lucide-react';
import { useCliente } from '@/lib/hooks/useClientes';
import { clientesService } from '@/services/clientes.service';
import { contactosClienteService } from '@/services/contactos-cliente.service';
import type { Cliente, ClienteContacto, UpdateClienteDto, CreateClienteContactoDto } from '@/types/cliente.interface';
import { toast } from 'sonner';

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
  idContacto?: string;
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
  const [contactosOriginales, setContactosOriginales] = useState<ClienteContacto[]>([]);
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
      if (cliente.cumpleanos && typeof cliente.cumpleanos === 'string') {
        const [year, month, day] = cliente.cumpleanos.split('-').map(Number);
        setValue('cumpleanos', new Date(year, month - 1, day));
      }

      // Cargar contactos si existen
      if (cliente.contactos && cliente.contactos.length > 0) {
        setContactosOriginales(cliente.contactos);
        const contactosData = cliente.contactos.map((contacto, index) => ({
          id: index + 1,
          idContacto: contacto.idContacto,
          nombre: contacto.nombre || '',
          cargo: contacto.cargo || '',
          telefono: contacto.telefono || '',
          correo: contacto.correo || '',
        }));
        setContactos(contactosData);
      } else {
        setContactosOriginales([]);
        setContactos([{ id: 1, nombre: '', cargo: '', telefono: '', correo: '' }]);
      }
    }
  }, [cliente, setValue]);

  // Función para manejar el envío del formulario
  const onSubmit = async (data: ClienteFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Validar campos requeridos
      if (!data.tipoPersona || !data.tipoDocumento || !data.numeroDocumento ||
          !data.telefono1 || !data.direccion) {
        throw new Error('Por favor complete todos los campos requeridos marcados con *');
      }

      // Preparar datos del cliente
      const clienteData: UpdateClienteDto = {
        tipoPersona: data.tipoPersona as 'NATURAL' | 'JURIDICO',
        tipoDocumento: data.tipoDocumento,
        numeroDocumento: data.numeroDocumento,
        nombres: data.nombres || undefined,
        apellidos: data.apellidos || undefined,
        razonSocial: data.razonSocial || undefined,
        direccion: data.direccion,
        distrito: data.distrito || undefined,
        provincia: data.provincia || undefined,
        departamento: data.departamento || undefined,
        telefono1: data.telefono1,
        telefono2: data.telefono2 || undefined,
        whatsapp: data.whatsapp || undefined,
        emailNotificaciones: data.emailNotificaciones || undefined,
        recibirNotificaciones: data.recibirNotificaciones || false,
        cumpleanos: data.cumpleanos || undefined,
      };

      // Preparar operaciones de contactos
      const contactosActuales = contactos.filter(c => c.nombre.trim() !== '');
      const contactosACrear: CreateClienteContactoDto[] = [];
      const contactosAActualizar: (CreateClienteContactoDto & { idContacto: string })[] = [];
      const contactosAEliminar: string[] = [];

      // Identificar contactos a crear y actualizar
      contactosActuales.forEach(contacto => {
        if (contacto.idContacto) {
          // Actualizar existente
          contactosAActualizar.push({
            idContacto: contacto.idContacto,
            nombre: contacto.nombre,
            cargo: contacto.cargo || undefined,
            telefono: contacto.telefono || undefined,
            correo: contacto.correo || undefined,
          });
        } else {
          // Crear nuevo
          contactosACrear.push({
            nombre: contacto.nombre,
            cargo: contacto.cargo || undefined,
            telefono: contacto.telefono || undefined,
            correo: contacto.correo || undefined,
          });
        }
      });

      // Identificar contactos a eliminar
      contactosOriginales.forEach(original => {
        const existe = contactosActuales.some(actual => actual.idContacto === original.idContacto);
        if (!existe) {
          contactosAEliminar.push(original.idContacto);
        }
      });

      console.log('📝 Actualizando cliente:', clienteData);
      console.log('➕ Contactos a crear:', contactosACrear);
      console.log('✏️ Contactos a actualizar:', contactosAActualizar);
      console.log('🗑️ Contactos a eliminar:', contactosAEliminar);

      // Actualizar cliente
      await clientesService.update(clienteId, clienteData);

      // Crear nuevos contactos
      for (const contacto of contactosACrear) {
        await contactosClienteService.create(clienteId, contacto);
      }

      // Actualizar contactos existentes
      for (const contacto of contactosAActualizar) {
        const { idContacto, ...updateData } = contacto;
        await contactosClienteService.update(idContacto, updateData);
      }

      // Eliminar contactos removidos
      for (const idContacto of contactosAEliminar) {
        await contactosClienteService.delete(idContacto);
      }

      console.log('✅ Cliente actualizado exitosamente');

      setSubmitSuccess(true);
      toast.success('Cliente actualizado exitosamente');

      // Resetear después de 2 segundos
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 2000);

    } catch (error: any) {
      console.error('❌ Error al actualizar cliente:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido al actualizar cliente';
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
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
    <div className="hidden md:flex flex-col space-y-4 w-64 pr-8 border-r border-gray-200">
      {[1, 2, 3].map((stepNumber) => (
        <div key={stepNumber} className="flex items-start space-x-3">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === stepNumber
                ? 'bg-blue-600 text-white'
                : stepNumber < currentStep
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {stepNumber < currentStep ? (
              <Check className="w-4 h-4" />
            ) : (
              stepNumber
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${
              currentStep === stepNumber ? 'text-blue-600' : 'text-gray-900'
            }`}>
              {stepNumber === 1 && 'Información del Cliente'}
              {stepNumber === 2 && 'Documentos y Contactos'}
              {stepNumber === 3 && 'Confirmación'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stepNumber === 1 && 'Datos personales y de contacto'}
              {stepNumber === 2 && 'Documentos requeridos y contactos adicionales'}
              {stepNumber === 3 && 'Revisar y guardar cambios'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMobileStepIndicator = () => (
    <div className="md:hidden mb-6">
      <div className="flex items-center justify-center space-x-2 mb-4">
        {[1, 2, 3].map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === stepNumber
                  ? 'bg-blue-600 text-white'
                  : stepNumber < currentStep
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {stepNumber < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                stepNumber
              )}
            </div>
            {stepNumber < 3 && (
              <div
                className={`flex-1 h-0.5 ${
                  stepNumber < currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-900">
          {currentStep === 1 && 'Información del Cliente'}
          {currentStep === 2 && 'Documentos y Contactos'}
          {currentStep === 3 && 'Confirmación'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {currentStep === 1 && 'Datos personales y de contacto'}
          {currentStep === 2 && 'Documentos requeridos y contactos adicionales'}
          {currentStep === 3 && 'Revisar y guardar cambios'}
        </p>
      </div>
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
    <div className="space-y-8">
      {/* SECCIÓN 1: IDENTIFICACIÓN DEL CLIENTE */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-900">Identificación del Cliente</h3>
          <p className="text-sm text-gray-600">Información básica para identificar al cliente</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
      </div>

      {/* SECCIÓN 2: DATOS PERSONALES */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-900">Datos Personales</h3>
          <p className="text-sm text-gray-600">Información específica según el tipo de persona</p>
        </div>

        {/* Campos para Persona Natural */}
        {watchedTipoPersona === 'NATURAL' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombres">Nombres *</Label>
              <Input
                id="nombres"
                placeholder="Ej: Juan Carlos"
                {...register('nombres')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellidos">Apellidos *</Label>
              <Input
                id="apellidos"
                placeholder="Ej: Pérez García"
                {...register('apellidos')}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cumpleanos">Fecha de Nacimiento</Label>
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
          </div>
        )}

        {/* Campos para Persona Jurídica */}
        {watchedTipoPersona === 'JURIDICO' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="razonSocial">Razón Social *</Label>
              <Input
                id="razonSocial"
                placeholder="Ej: Empresa S.A.C."
                {...register('razonSocial')}
              />
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 3: DIRECCIÓN Y UBICACIÓN */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-900">Dirección y Ubicación</h3>
          <p className="text-sm text-gray-600">Información de domicilio del cliente</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección Completa *</Label>
            <Textarea
              id="direccion"
              placeholder="Ej: Av. Principal 123, Urbanización Los Jardines, Lima"
              rows={3}
              {...register('direccion')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distrito">Distrito</Label>
              <Input
                id="distrito"
                placeholder="Ej: Miraflores"
                {...register('distrito')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provincia">Provincia</Label>
              <Input
                id="provincia"
                placeholder="Ej: Lima"
                {...register('provincia')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento</Label>
              <Input
                id="departamento"
                placeholder="Ej: Lima"
                {...register('departamento')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: INFORMACIÓN DE CONTACTO */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-900">Información de Contacto</h3>
          <p className="text-sm text-gray-600">Datos para comunicarse con el cliente</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="telefono1">Teléfono Principal *</Label>
            <Input
              id="telefono1"
              placeholder="Ej: 925757151"
              {...register('telefono1')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono2">Teléfono Secundario</Label>
            <Input
              id="telefono2"
              placeholder="Ej: 987654321"
              {...register('telefono2')}
            />
          </div>

          <div className="space-y-2">
            <Label className='text-green-600' htmlFor="whatsapp">
              WhatsApp <span className='text-black'>(Incluya el código de país)</span>
            </Label>
            <Input
              id="whatsapp"
              placeholder="Ej: +51 925757151"
              {...register('whatsapp')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailNotificaciones">Email para Notificaciones</Label>
            <Input
              id="emailNotificaciones"
              type="email"
              placeholder="cliente@ejemplo.com"
              {...register('emailNotificaciones')}
            />
          </div>
        </div>

        {/* Preferencias de notificación */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
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
            <Label htmlFor="recibirNotificaciones" className="text-sm">
              Acepto recibir notificaciones por email sobre actualizaciones importantes
            </Label>
          </div>
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
      {/* Indicador de pasos móvil */}
      {renderMobileStepIndicator()}

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

      <div className="md:flex md:space-x-8">
        {/* Indicador de pasos desktop */}
        {renderStepIndicator()}

        {/* Contenido principal */}
        <div className="flex-1">
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
              onClick={currentStep === STEPS.length ? handleSubmit(onSubmit) : nextStep}
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
      </div>
    </div>
  );
}
