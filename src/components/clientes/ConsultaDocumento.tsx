'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle, XCircle, Loader2, User, Building } from 'lucide-react';
import { decolectaService, DatosPersona, DatosEmpresa } from '@/services/decolecta.service';

interface ConsultaDocumentoProps {
  tipoDocumento: 'DNI' | 'RUC';
  numeroDocumento: string;
  onNumeroDocumentoChange: (numero: string) => void;
  onDatosEncontrados?: (datos: DatosPersona | DatosEmpresa | null) => void;
  className?: string;
}

export default function ConsultaDocumento({
  tipoDocumento,
  numeroDocumento,
  onNumeroDocumentoChange,
  onDatosEncontrados,
  className = ''
}: ConsultaDocumentoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [datosEncontrados, setDatosEncontrados] = useState<DatosPersona | DatosEmpresa | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [consultaRealizada, setConsultaRealizada] = useState(false);

  const validarDocumento = (numero: string): boolean => {
    if (tipoDocumento === 'DNI') {
      return /^\d{8}$/.test(numero);
    } else if (tipoDocumento === 'RUC') {
      return /^\d{11}$/.test(numero);
    }
    return false;
  };

  const handleConsulta = async () => {
    if (!numeroDocumento.trim()) {
      setError('Por favor ingrese un número de documento');
      return;
    }

    if (!validarDocumento(numeroDocumento)) {
      const longitudEsperada = tipoDocumento === 'DNI' ? '8' : '11';
      setError(`El ${tipoDocumento} debe tener exactamente ${longitudEsperada} dígitos`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setDatosEncontrados(null);

    try {
      let datosConvertidos;

      if (tipoDocumento === 'DNI') {
        const resultado = await decolectaService.consultarDNI(numeroDocumento);
        datosConvertidos = decolectaService.convertirDatosPersona(resultado);
        setDatosEncontrados(datosConvertidos);
        onDatosEncontrados?.(datosConvertidos);
      } else if (tipoDocumento === 'RUC') {
        const resultado = await decolectaService.consultarRUC(numeroDocumento);
        datosConvertidos = decolectaService.convertirDatosEmpresa(resultado);
        setDatosEncontrados(datosConvertidos);
        onDatosEncontrados?.(datosConvertidos);
      }

      setConsultaRealizada(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión. Verifique su conexión a internet.';
      setError(errorMessage);
      console.error('Error en consulta:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleConsulta();
    }
  };

  const renderDatosPersona = (datos: DatosPersona) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-blue-500" />
        <span className="font-medium text-sm">Datos de Persona</span>
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm">
        <div>
          <span className="font-medium">Nombres:</span> {datos.nombres}
        </div>
        <div>
          <span className="font-medium">Apellidos:</span> {datos.apellidos}
        </div>
        {datos.direccion && (
          <div>
            <span className="font-medium">Dirección:</span> {datos.direccion}
          </div>
        )}
      </div>
    </div>
  );

  const renderDatosEmpresa = (datos: DatosEmpresa) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Building className="w-4 h-4 text-green-500" />
        <span className="font-medium text-sm">Datos de Empresa</span>
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm">
        <div>
          <span className="font-medium">Razón Social:</span> {datos.razonSocial}
        </div>
        {datos.direccion && (
          <div>
            <span className="font-medium">Dirección:</span> {datos.direccion}
          </div>
        )}
        <div>
          <span className="font-medium">Estado:</span>
          <Badge variant={datos.estado === 'ACTIVO' ? 'default' : 'secondary'} className="ml-2">
            {datos.estado}
          </Badge>
        </div>
      </div>
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="w-5 h-5" />
          Consulta de {tipoDocumento}
        </CardTitle>
        <CardDescription>
          Busca información oficial por {tipoDocumento} para auto-completar el formulario. Solo disponible para DNI y RUC
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input y botón de consulta */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor={`numero-${tipoDocumento}`} className="sr-only">
              Número de {tipoDocumento}
            </Label>
            <Input
              id={`numero-${tipoDocumento}`}
              placeholder={`Ingrese ${tipoDocumento}`}
              value={numeroDocumento}
              onChange={(e) => onNumeroDocumentoChange(e.target.value.replace(/\D/g, ''))}
              onKeyPress={handleKeyPress}
              maxLength={tipoDocumento === 'DNI' ? 8 : 11}
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleConsulta}
            disabled={isLoading || !numeroDocumento.trim()}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {isLoading ? 'Consultando...' : 'Consultar'}
          </Button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Datos encontrados */}
        {datosEncontrados && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium text-green-700">
                  ¡Información encontrada exitosamente!
                </div>
                {tipoDocumento === 'DNI' ? renderDatosPersona(datosEncontrados as DatosPersona) : renderDatosEmpresa(datosEncontrados as DatosEmpresa)}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Mensaje cuando no se encuentra información */}
        {consultaRealizada && !datosEncontrados && !error && !isLoading && (
          <Alert>
            <AlertDescription>
              No se encontró información para el {tipoDocumento} ingresado.
            </AlertDescription>
          </Alert>
        )}

        {/* Información adicional */}
        <div className="text-xs text-muted-foreground">
          <p>
            Esta consulta utiliza la API de Decolecta para obtener información oficial.
            Los datos se utilizan únicamente para facilitar el registro del cliente.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}