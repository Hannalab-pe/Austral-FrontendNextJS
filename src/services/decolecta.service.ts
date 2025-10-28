import axios, { AxiosInstance } from 'axios';

// Interfaces para las respuestas de Decolecta API
export interface ConsultaDNIResponse {
    first_name: string;
    first_last_name: string;
    second_last_name: string;
    full_name: string;
    document_number: string;
}

export interface ConsultaRUCResponse {
    ruc: string;
    razon_social: string;
    nombre_comercial?: string;
    tipo_contribuyente?: string;
    fecha_inscripcion?: string;
    fecha_inicio_actividades?: string;
    estado_contribuyente: string;
    condicion_contribuyente?: string;
    domicilio_fiscal: string;
    actividad_economica_principal?: string;
    actividades_economicas_secundarias?: string[];
    comprobantes_de_pago?: string[];
    sistema_emision_comprobante?: string;
    sistema_contabilidad?: string;
    actividad_exterior?: string;
    emisores_de_comprobantes?: string[];
    fecha_emisor_140100?: string;
    padrones?: string[];
}

export interface DatosPersona {
    nombres: string;
    apellidos: string;
    direccion?: string;
}

export interface DatosEmpresa {
    razonSocial: string;
    direccion?: string;
    estado: string;
}

class DecolectaService {
    private client: AxiosInstance;

    constructor() {
        const baseURL = process.env.NEXT_PUBLIC_DECOLECTA_API_BASE_URL || '/api/decolecta';
        const token = process.env.NEXT_PUBLIC_DECOLECTA_API_TOKEN || '';

        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        });

        if (!token) {
            console.warn('DECOLECTA_API_TOKEN no está configurado. Las consultas de documento no funcionarán.');
        }
    }

    /**
     * Consulta información de una persona por DNI
     * @param dni Número de DNI (8 dígitos)
     * @returns Promise<ConsultaDNIResponse>
     */
    async consultarDNI(dni: string): Promise<ConsultaDNIResponse> {
        try {
            // Validar formato del DNI
            if (!/^\d{8}$/.test(dni)) {
                throw new Error('El DNI debe tener exactamente 8 dígitos');
            }

            const response = await this.client.get<ConsultaDNIResponse>(`/reniec/dni?numero=${dni}`);
            return response.data;
        } catch (error) {
            console.error('Error consultando DNI:', error);
            throw new Error('No se pudo consultar el DNI');
        }
    }

    /**
     * Consulta información de una empresa por RUC
     * @param ruc Número de RUC (11 dígitos)
     * @returns Promise<ConsultaRUCResponse>
     */
    async consultarRUC(ruc: string): Promise<ConsultaRUCResponse> {
        try {
            // Validar formato del RUC
            if (!/^\d{11}$/.test(ruc)) {
                throw new Error('El RUC debe tener exactamente 11 dígitos');
            }

            const response = await this.client.get<ConsultaRUCResponse>(`/sunat/ruc?numero=${ruc}`);
            return response.data;
        } catch (error) {
            console.error('Error consultando RUC:', error);
            throw new Error('No se pudo consultar el RUC');
        }
    }

    /**
     * Convierte respuesta de DNI a formato utilizable por el formulario
     * @param response Respuesta de la API
     * @returns DatosPersona | null
     */
    convertirDatosPersona(response: ConsultaDNIResponse): DatosPersona | null {
        if (!response) {
            return null;
        }

        return {
            nombres: `${response.first_name}`.trim(),
            apellidos: `${response.first_last_name} ${response.second_last_name}`.trim(),
        };
    }

    /**
     * Convierte respuesta de RUC a formato utilizable por el formulario
     * @param response Respuesta de la API
     * @returns DatosEmpresa | null
     */
    convertirDatosEmpresa(response: ConsultaRUCResponse): DatosEmpresa | null {
        if (!response) {
            return null;
        }

        return {
            razonSocial: response.razon_social,
            direccion: response.domicilio_fiscal,
            estado: response.estado_contribuyente,
        };
    }
}

// Exportar instancia singleton
export const decolectaService = new DecolectaService();
export default decolectaService;