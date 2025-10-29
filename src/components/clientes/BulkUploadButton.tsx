'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, FileSpreadsheet, CheckCircle, XCircle } from 'lucide-react';
import { clientesService } from '@/services/clientes.service';
import { Spinner } from '@/components/ui/spinner';

interface BulkUploadResult {
    success: number;
    errors: Array<{
        row: number;
        error: string;
    }>;
    total: number;
}

export default function BulkUploadButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDownloadTemplate = async () => {
        try {
            setIsDownloading(true);
            setError(null);

            const blob = await clientesService.downloadTemplate();

            // Crear URL para descarga
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'plantilla_clientes.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            setError('Error al descargar la plantilla. Inténtalo de nuevo.');
            console.error('Error downloading template:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
                setError('Solo se permiten archivos Excel (.xlsx o .xls)');
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
            setError(null);
            setUploadResult(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Por favor selecciona un archivo');
            return;
        }

        try {
            setIsUploading(true);
            setError(null);
            setUploadResult(null);

            const result = await clientesService.bulkUpload(selectedFile);
            setUploadResult(result);

            // Si hay éxito, mostrar mensaje (podrías agregar un toast aquí)
            if (result.success > 0) {
                console.log('Subida masiva completada exitosamente');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al procesar el archivo. Inténtalo de nuevo.';
            setError(errorMessage);
            console.error('Error uploading file:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const resetModal = () => {
        setSelectedFile(null);
        setUploadResult(null);
        setError(null);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-white text-black border-gray-300 hover:bg-gray-50">
                    <Upload className="mr-2 h-4 w-4" />
                    Subida Masiva
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5" />
                        Subida Masiva de Clientes
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Descarga de plantilla */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Paso 1: Descargar Plantilla</Label>
                        <p className="text-sm text-muted-foreground">
                            Descarga la plantilla Excel con los campos requeridos para la subida masiva.
                        </p>
                        <Button
                            onClick={handleDownloadTemplate}
                            disabled={isDownloading}
                            variant="outline"
                            className="w-full"
                        >
                            {isDownloading ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" />
                                    Descargando...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Descargar Plantilla
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Subida de archivo */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Paso 2: Subir Archivo</Label>
                        <p className="text-sm text-muted-foreground">
                            Selecciona el archivo Excel completado con los datos de los clientes.
                        </p>
                        <div className="space-y-2">
                            <Input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileSelect}
                                disabled={isUploading}
                            />
                            {selectedFile && (
                                <p className="text-sm text-green-600">
                                    Archivo seleccionado: {selectedFile.name}
                                </p>
                            )}
                        </div>
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || isUploading}
                            className="w-full"
                        >
                            {isUploading ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Subir y Procesar
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Resultados */}
                    {uploadResult && (
                        <Alert className={uploadResult.errors.length > 0 ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"}>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                                <div className="space-y-1">
                                    <p className="font-medium">
                                        Procesamiento completado: {uploadResult.success} de {uploadResult.total} clientes creados exitosamente.
                                    </p>
                                    {uploadResult.errors.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm font-medium text-red-600">Errores encontrados:</p>
                                            <ul className="text-sm text-red-600 mt-1 space-y-1">
                                                {uploadResult.errors.slice(0, 5).map((error, index) => (
                                                    <li key={index}>
                                                        • Fila {error.row}: {error.error}
                                                    </li>
                                                ))}
                                                {uploadResult.errors.length > 5 && (
                                                    <li className="text-gray-500">
                                                        ... y {uploadResult.errors.length - 5} errores más
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Errores */}
                    {error && (
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={resetModal}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}